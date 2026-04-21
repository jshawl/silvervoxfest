import { describe, expect, it } from "vitest";
import { buildTree } from "./view";

describe("view", () => {
  describe("buildTree", () => {
    it("sorts labels alphabetically", () => {
      const tree = buildTree({
        locations: [
          { type: "Restaurant" },
          { type: "Coffee" },
          { type: "Bar" },
        ],
        markers: [],
      });
      expect(tree[0].id).toBe("Bar");
      expect(tree[2].id).toBe("Restaurant");
    });
  });
});
