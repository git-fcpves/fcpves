import type { UIMessage } from "ai";

export const MAYA_GREETING =
  "Hey there! 💗 Welcome to Sagar's World!\n\nI'm Maya, your little AI guide. I can help you explore Sagar's work, discover what he does, or get in touch with him.\n\nSo, what would you like to explore today? ✨";
export const destinations = {
  home: "/",
  about: "/about",
  work: "/work",
  projects: "/projects",
  connect: "/connect",
} as const;
export const initialMessages = (): UIMessage[] => [
  { id: "maya-greeting", role: "assistant", parts: [{ type: "text", text: MAYA_GREETING }] },
];
export function whatsappMessage(name: string, contact: string, message: string) {
  return `https://wa.me/917619633201?text=${encodeURIComponent(`Enquiry from Sagar's World\nName: ${name}\nContact: ${contact}\nMessage: ${message}`)}`;
}
