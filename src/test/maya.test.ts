import { describe, expect, it } from "vitest";
import { initialMessages, whatsappMessage, destinations } from "../lib/maya/config";
describe("Maya's visitor rules", () => {
  it("initializes independent temporary conversations", () => {
    const first = initialMessages();
    const second = initialMessages();
    first.push({ id: "u1", role: "user", parts: [{ type: "text", text: "My project" }] });
    expect(second).toHaveLength(1);
    expect(second.some((message) => message.role === "user")).toBe(false);
  });
  it("prepares a draft to Sagar's verified WhatsApp, not a delivery claim", () => {
    const url = new URL(whatsappMessage("Asha", "asha@example.com", "Wedding film enquiry"));
    expect(url.pathname).toBe("/917619633201");
    expect(url.searchParams.get("text")).toContain(
      "Name: Asha\nContact: asha@example.com\nMessage: Wedding film enquiry",
    );
  });
  it("offers only the five actual site destinations", () => {
    expect(Object.values(destinations)).toEqual(["/", "/about", "/work", "/projects", "/connect"]);
  });
});
