import { describe, expect, it } from "vitest";
import { workCategories } from "../components/work-section";

const CINEMATIC: [string, string][] = [
  ["Farmer", "/__l5e/assets-v1/cdb9bb15-45a5-4d4d-97dd-cef42d9e6e84/farmer.mp4"],
  ["Modern", "/__l5e/assets-v1/cb6a6a47-f2f8-4019-b764-e32892433f8d/modern.mp4"],
  ["Retro", "/__l5e/assets-v1/62782aff-b9e0-4621-bb94-489640fbcc3e/retro.mp4"],
];

describe("Cinematic portfolio films", () => {
  it.each(CINEMATIC)("shows %s from its own uploaded file", (title, url) => {
    const cinematic = workCategories.find((category) => category.name === "Cinematic videos");
    const clip = cinematic?.clips.find((c) => c.title === title);
    expect(clip?.src).toBe(url);
    expect(clip?.poster).toBeTruthy();
  });

  it("keeps the cinematic films inside the app, with no external links", () => {
    const cinematic = workCategories.find((category) => category.name === "Cinematic videos");
    expect(cinematic?.clips.every((clip) => clip.href === undefined)).toBe(true);
  });
});
