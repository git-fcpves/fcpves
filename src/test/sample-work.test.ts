import { describe, expect, it } from "vitest";
import { featuredWork } from "../components/work-section";

const REAL_CLIPS: [string, string][] = [
  ["Farmer", "/__l5e/assets-v1/cdb9bb15-45a5-4d4d-97dd-cef42d9e6e84/farmer.mp4"],
  ["Modern", "/__l5e/assets-v1/cb6a6a47-f2f8-4019-b764-e32892433f8d/modern.mp4"],
  ["Retro", "/__l5e/assets-v1/62782aff-b9e0-4621-bb94-489640fbcc3e/retro.mp4"],
  ["Muhurtham Reel", "/__l5e/assets-v1/a06e72b6-0212-4437-af81-a3063207a982/muhurtham-reel.mp4"],
  ["Reception Reel", "/__l5e/assets-v1/e28d11b8-417a-4056-af90-71662e90afae/reception-reel.mp4"],
  ["Wedding Reel", "/__l5e/assets-v1/ffa2cf48-cf54-4b17-91cd-27cad3fa8afc/wedding-reel.mp4"],
  ["Pre Wedding 1", "/__l5e/assets-v1/b6cc2d1d-1618-408d-b4e6-e94cd7d654c4/pre-wedding-1.mp4"],
  ["Pre Wedding 2", "/__l5e/assets-v1/e474549e-c34c-4779-a75c-660de44172c9/pre-wedding-2.mp4"],
  ["Teaser 4K", "/__l5e/assets-v1/ecc1dd5b-1138-4b31-a33e-b7b4797738e4/teaser-4k.mp4"],
  ["Teaser 2", "/__l5e/assets-v1/3d627946-c688-41b0-a178-5be9ffa6b586/teaser-2.mp4"],
  ["AI Video", "/__l5e/assets-v1/538fdbbc-2979-4fda-b87e-0c29e9b5cc4c/ai-video.mp4"],
  ["Teaser", "/__l5e/assets-v1/8e6222c8-85e3-456e-8ec2-b096cb1f9c45/teaser.mp4"],
  ["Wedding Teaser", "/__l5e/assets-v1/d1747472-e2a8-4e97-86cf-305122e77e2e/wedding-teaser.mp4"],
];

describe("Home sample work clips", () => {
  it.each(REAL_CLIPS)("plays %s from its own uploaded file", (title, url) => {
    const tile = featuredWork.find((w) => w.title === title);
    expect(tile?.src).toBe(url);
    expect(tile?.poster).toBeTruthy();
  });

  it("keeps every sample work tile on one in-app player", () => {
    expect(featuredWork.every((w) => w.src.length > 0 && w.poster.length > 0)).toBe(true);
  });
});
