export const INTRO_SESSION_KEY = "sagars-world-intro-seen";
export const GREETINGS = ["HELLO", "ನಮಸ್ಕಾರ", "VANAKKAM", "வணக்கம்", "నమస్కారం", "नमस्ते", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "નમસ્તે", "السلام عليكم", "ASSALAMU ALAIKUM", "নমস্কার", "നമസ്കാരം", "NAMASKARA"];
export const FINAL_GREETING = "ನಮಸ್ಕಾರ ಗೆಳೆಯರೇ";
export function greetingAt(elapsed: number, duration: number) {
  const start = Math.max(2, duration - 5.7);
  if (elapsed < start) return "";
  const index = Math.floor((elapsed - start) / 0.33);
  return index < GREETINGS.length ? GREETINGS[index] ?? "" : FINAL_GREETING;
}