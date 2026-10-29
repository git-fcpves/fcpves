import { describe, expect, it } from "vitest";
import { FINAL_GREETING, GREETINGS, greetingAt, INTRO_SESSION_KEY } from "../lib/intro-sequence";
describe("Cinematic intro rules", () => {
  it("keeps the exact multilingual greeting order", () => {
    expect(GREETINGS).toEqual(["HELLO", "ನಮಸ್ಕಾರ", "VANAKKAM", "வணக்கம்", "నమస్కారం", "नमस्ते", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "નમસ્તે", "السلام عليكم", "ASSALAMU ALAIKUM", "নমস্কার", "നമസ്കാരം", "NAMASKARA"]);
  });
  it("starts with no greeting before the voice", () => { expect(greetingAt(0, 28)).toBe(""); });
  it("holds the exact final Kannada greeting after the sequence", () => { expect(greetingAt(27, 28)).toBe("ನಮಸ್ಕಾರ ಗೆಳೆಯರೇ"); expect(FINAL_GREETING).toBe("ನಮಸ್ಕಾರ ಗೆಳೆಯರೇ"); });
  it("uses one browser-session marker", () => { expect(INTRO_SESSION_KEY).toBe("sagars-world-intro-seen"); });
});