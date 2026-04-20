/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from "vitest";
import { createElement } from "./marker";

describe("marker", () => {
  describe("createElement", () => {
    it("sets innerHTML to emoji", () => {
      expect(createElement({ type: "coffee", emoji: "☕️" }).innerHTML).toBe(
        "☕️",
      );
    });
    it("returns undefined if either type or emoji are missing", () => {
      expect(createElement({})).toBeUndefined();
    });
  });
});
