import { defineManifest } from "@crxjs/vite-plugin";

export const manifest = defineManifest({
  manifest_version: 3,
  name: "chat-gpt-counter",
  version: "1.0.0",
  content_scripts: [
    {
      matches: ["https://chat.openai.com/*"],
      js: ["src/content.ts"],
      all_frames: true,
    },
  ],
});
