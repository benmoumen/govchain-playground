"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
  ExpandableChatHeader,
} from "@/components/ui/expandable-chat";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  ChevronsUpDown,
  RefreshCcw,
  Send,
  Square,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

// Update Message type
interface Message {
  id: string;
  role: "user" | "assistant";
  thinkingContent?: string; // Content between <think>...</think>
  finalContent: string; // Final content after </think> or if no tags
  isThinking?: boolean; // Is the stream currently in a thinking block?
  showThinking?: boolean; // Should the thinking content be visible?
  isError?: boolean;
}

// Define a type for the API response (adjust based on actual API)
// interface ChatApiResponse {
//   // e.g., id: string; object: string; created: number; model: string;
//   choices: Array<{
//     index: number;
//     message: {
//       role: 'assistant';
//       content: string;
//     };
//     // finish_reason: string;
//   }>;
//   // usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
// }

// List of available models
const availableModels = [
  "MFDoom/deepseek-r1-tool-calling:14b",
  "deepseek-r1:70b",
  "qwq:32b",
  "gemma3:12b",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<string>(
    availableModels[0]
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to toggle visibility of thinking steps
  const handleToggleThinking = useCallback(
    (messageId: string, isOpen: boolean) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, showThinking: isOpen } : msg
        )
      );
    },
    []
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to stop generation (used by Send and New Conversation)
  const handleStopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      // finally block in handleSendMessage will clear the ref and set isLoading false
    }
  }, []);

  const handleSendMessage = async () => {
    const messageContent = input.trim();
    if (!messageContent) return;

    setIsLoading(true);
    setInput("");

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      finalContent: messageContent, // User messages only have finalContent
    };

    // Update placeholder for assistant response
    const assistantPlaceholderId = (Date.now() + 1).toString();
    const initialMessages = [
      ...messages,
      newUserMessage,
      {
        id: assistantPlaceholderId,
        role: "assistant",
        thinkingContent: "",
        finalContent: "", // Start both contents as empty
        isThinking: false,
        showThinking: false,
        isError: false,
      } as Message,
    ];
    setMessages(initialMessages);

    // --- Stream Processing Logic ---
    let currentIsThinking = false;
    let accumulatedThinkingContent = "";
    let accumulatedFinalContent = "";

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: initialMessages
            .slice(0, -1)
            .map(({ role, finalContent }) => ({ role, content: finalContent })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Handle initial fetch error (e.g., 4xx, 5xx from our API route)
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  finalContent: `Error: ${
                    errorData.error ||
                    response.statusText ||
                    "Failed to get response"
                  }`,
                  isError: true,
                }
              : msg
          )
        );
        return; // Stop processing if fetch failed
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = ""; // Buffer to handle tags spanning chunks

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // Process buffer line by line
          let lineEndIndex;
          while ((lineEndIndex = buffer.indexOf("\n")) !== -1) {
            const line = buffer.substring(0, lineEndIndex).trim();
            buffer = buffer.substring(lineEndIndex + 1);

            if (line === "") continue;

            try {
              const parsed = JSON.parse(line);
              let contentDelta = parsed.message?.content || "";

              // --- Tag Detection Logic ---
              // ADDED: Check for and discard leading </think> if not currently thinking
              if (!currentIsThinking && contentDelta.startsWith("</think>")) {
                contentDelta = contentDelta.substring(8); // Remove leading </think>
              }

              let thinkStartIdx = contentDelta.indexOf("<think>");
              let thinkEndIdx = contentDelta.indexOf("</think>");

              while (thinkStartIdx !== -1 || thinkEndIdx !== -1) {
                if (currentIsThinking) {
                  // Currently thinking, look for end tag
                  if (thinkEndIdx !== -1) {
                    // End tag found
                    accumulatedThinkingContent += contentDelta.substring(
                      0,
                      thinkEndIdx
                    );
                    contentDelta = contentDelta.substring(thinkEndIdx + 8); // Skip </think>
                    currentIsThinking = false;
                    // ADDED: Check again for leading </think> immediately after closing one
                    if (
                      !currentIsThinking &&
                      contentDelta.startsWith("</think>")
                    ) {
                      contentDelta = contentDelta.substring(8);
                    }
                    thinkEndIdx = contentDelta.indexOf("</think>"); // Update index for remaining delta
                    thinkStartIdx = contentDelta.indexOf("<think>"); // Update index for remaining delta
                  } else {
                    // No end tag in this chunk, add whole delta to thinking
                    accumulatedThinkingContent += contentDelta;
                    contentDelta = ""; // Consumed entire delta
                    break; // Move to next chunk
                  }
                } else {
                  // Not currently thinking, look for start tag
                  if (thinkStartIdx !== -1) {
                    // Start tag found
                    accumulatedFinalContent += contentDelta.substring(
                      0,
                      thinkStartIdx
                    );
                    contentDelta = contentDelta.substring(thinkStartIdx + 7); // Skip <think>
                    currentIsThinking = true;
                    thinkStartIdx = contentDelta.indexOf("<think>"); // Update index for remaining delta
                    thinkEndIdx = contentDelta.indexOf("</think>"); // Update index for remaining delta
                  } else {
                    // No start tag in this chunk, add whole delta to final
                    accumulatedFinalContent += contentDelta;
                    contentDelta = ""; // Consumed entire delta
                    break; // Move to next chunk
                  }
                }
              }
              // Add any remaining delta after tag processing
              if (contentDelta) {
                if (currentIsThinking) {
                  accumulatedThinkingContent += contentDelta;
                } else {
                  accumulatedFinalContent += contentDelta;
                }
              }
              // --- End Tag Detection ---

              // Update message state
              setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                  msg.id === assistantPlaceholderId
                    ? {
                        ...msg,
                        thinkingContent: accumulatedThinkingContent,
                        finalContent: accumulatedFinalContent,
                        isThinking: currentIsThinking,
                      }
                    : msg
                )
              );

              if (parsed.done) {
                done = true;
              }
            } catch (e) {
              console.error("Failed to parse stream chunk:", line, e);
            }
          }
        }
        // Process any remaining buffer after the loop if stream ends without newline
        if (done && buffer.trim() !== "") {
          // similar parsing/tag detection logic as above for the remaining buffer
          // this part is complex and might need refinement based on exact API behavior
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Fetch aborted."); // Simplified log
        // Update message state to indicate stopped
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 // Target the last message (the assistant placeholder)
              ? {
                  ...msg,
                  finalContent: msg.finalContent + " [Stopped]",
                  isThinking: false,
                }
              : msg
          )
        );
      } else {
        console.error("Failed to process stream:", error);
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1
              ? {
                  ...msg,
                  finalContent: "Error: Could not process AI response stream.",
                  isError: true,
                  isThinking: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Function to start a new conversation
  const handleNewConversation = useCallback(() => {
    handleStopGenerating(); // Stop any ongoing generation first
    setMessages([]); // Clear messages
    // Optionally clear input as well
    // setInput("");
  }, [handleStopGenerating]); // Add dependency

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline on Enter
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <ExpandableChat position="bottom-right">
        <ExpandableChatHeader className="border-b flex-shrink-0 flex justify-between items-center pl-4 pr-2">
          <h2 className="font-semibold">AI Assistant</h2>
          {/* New Conversation Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            disabled={isLoading} // Disable while generating
            className="h-8 w-8" // Smaller icon button
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">New Conversation</span>
          </Button>
        </ExpandableChatHeader>

        <ExpandableChatBody
          ref={chatBodyRef}
          className="p-4 space-y-4 flex-grow overflow-y-auto"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full", // Ensure full width for proper alignment
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-4 py-2 break-words",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.isError
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted",
                  "text-sm" // Apply smaller text size to the message bubble
                )}
              >
                {/* Conditional Rendering for Assistant Messages */}
                {message.role === "assistant" ? (
                  <>
                    {/* Collapsible Thinking Section */}
                    {message.thinkingContent && (
                      <Collapsible
                        open={message.showThinking}
                        onOpenChange={(isOpen: boolean) =>
                          handleToggleThinking(message.id, isOpen)
                        }
                        className="w-full"
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex w-full items-center justify-start gap-2 p-1 h-auto mb-1 text-muted-foreground hover:text-accent-foreground"
                          >
                            <BrainCircuit
                              className={cn(
                                "h-4 w-4",
                                message.isThinking && "animate-pulse"
                              )}
                            />
                            Thinking...
                            <ChevronsUpDown className="h-4 w-4 ml-auto shrink-0" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="text-xs text-muted-foreground italic pl-6 pb-2">
                          <pre className="whitespace-pre-wrap font-sans text-xs">
                            {message.thinkingContent}
                          </pre>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    {/* Final Content */}
                    <div className="text-muted-foreground">
                      {message.finalContent}
                      {/* Add a blinking cursor if isThinking is true and no final content yet? (Optional) */}
                      {message.isThinking && !message.finalContent && (
                        <span className="animate-pulse">▍</span>
                      )}
                    </div>
                  </>
                ) : (
                  /* Render User Message Content */
                  message.finalContent
                )}
              </div>
            </div>
          ))}
        </ExpandableChatBody>

        <ExpandableChatFooter className="p-2 border-t flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-grow"
              autoComplete="off"
            />
            {isLoading ? (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleStopGenerating}
              >
                <Square className="h-4 w-4" />
                <span className="sr-only">Stop Generating</span>
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            )}
          </div>
          <div className="mt-1 text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2 focus:outline-none h-auto p-0"
                >
                  Model: {selectedModel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {availableModels.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onSelect={() => setSelectedModel(model)}
                    className={cn("text-xs", {
                      "font-semibold": model === selectedModel,
                    })}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
}
