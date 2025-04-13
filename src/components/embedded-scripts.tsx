import Script from "next/script";

export function EmbeddedScripts() {
  return (
    <Script
      // Core Embed Settings
      data-embed-id="cf451081-13a8-4d9c-85d8-2a5005990beb"
      data-base-api-url="https://chat.tutorial.eregistrations.org/api/embed"
      src="https://chat.tutorial.eregistrations.org/embed/anythingllm-chat-widget.min.js"
      // LLM Overrides
      // data-prompt="You are a helpful assistant for the Tanzania Investment Center."
      // data-model="claude-3-sonnet-20240229"
      // data-temperature="0.7"
      // Style Overrides
      data-greeting="Welcome! I'm the AI assistant from the Tanzania Investment Centre.\nI'm here to guide you through business procedures and help you find the information you need.\nHow can I assist you today?"
      data-button-color="#6766fc"
      data-chat-icon="chatBubble"
      data-user-bg-color="#e0e0e0"
      data-assistant-bg-color="#d1e7ff"
      data-brand-image-url="https://librechat.tutorial.eregistrations.org/images/67dacf1ad5a625a2aefbf6d6/5af94c2c-7133-42a7-84d3-6688f7a1874f-tz_tradeportal.png" // Replace with actual URL
      data-assistant-name="eRegulations AI Assistant"
      data-assistant-icon="https://librechat.tutorial.eregistrations.org/images/67dacf1ad5a625a2aefbf6d6/5af94c2c-7133-42a7-84d3-6688f7a1874f-tz_tradeportal.png" // Replace with actual URL
      data-position="bottom-left"
      data-window-height="600px"
      data-window-width="400px"
      data-text-size="14px"
      data-no-sponsor="true" // Hides the sponsor footer
      // data-sponsor-link="..." // Not needed if data-no-sponsor is true
      // data-sponsor-text="..." // Not needed if data-no-sponsor is true
      data-default-messages="How do I register a business?, Tell me about investment incentives."
      // Behavior Overrides
      data-open-on-load="on"
      data-show-thoughts="true"
      data-support-email="faraja101@gmail.com"
      //data-username="WebsiteVisitor"
    ></Script>
  );
}
