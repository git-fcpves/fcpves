import { describe, expect, it } from "vitest";
import { workCategories } from "../components/work-section";

describe("Cinematic portfolio films", () => {
  it("includes all three supplied films in the requested order", () => {
    const cinematic = workCategories.find((category) => category.name === "Cinematic videos");
    expect(cinematic?.clips.map((clip) => clip.href)).toEqual([
      "https://youtu.be/er1WXxV_5KA",
      "https://youtu.be/0ASm37QZjdc",
      "https://youtu.be/rJB3l8hkYB0",
    ]);
  });
});