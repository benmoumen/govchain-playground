import Script from "next/script";

export function EmbeddedScripts() {
  return (
    <Script
      data-embed-id="cf451081-13a8-4d9c-85d8-2a5005990beb"
      data-base-api-url="https://chat.tutorial.eregistrations.org/api/embed"
      src="https://chat.tutorial.eregistrations.org/embed/anythingllm-chat-widget.min.js"
    ></Script>
  );
}
