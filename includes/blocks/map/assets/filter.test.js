/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  collapseFilter,
  getFilterContainer,
  initializeFilter,
  onFilterButtonClick,
} from "./filter";

import { getMarkers } from "@places/marker";

vi.mock("@places/marker", async () => {
  return {
    ...(await vi.importActual("@places/marker")),
    getMarkers: vi.fn(),
  };
});

describe("filter", () => {
  describe("initializeFilter", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div class='map-filter'></div>`;
    });
    it("expands", () => {
      initializeFilter({ locations: [{ type: "coffee" }] });
      expect(getFilterContainer().classList).not.toContain("expanded");
      getFilterContainer().dispatchEvent(new Event("click"));
      expect(getFilterContainer().classList).toContain("expanded");
    });
    it("adds location types to the list", () => {
      initializeFilter({
        locations: [
          { type: "coffee" },
          { type: "alcohol" },
          { type: "coffee" },
        ],
      });
      expect(getFilterContainer().innerHTML).toContain("Coffee Shops");
    });
  });
  describe("onFilterButtonClick", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div class='map-filter'></div>`;
    });
    it("hides the other filter buttons", () => {
      const marker = {
        getElement: () => ({
          style: {
            display: "",
          },
        }),
      };
      getMarkers.mockImplementationOnce(() => [
        { location: { type: "coffee" }, marker },
        { location: { type: "alcohol" }, marker },
      ]);
      initializeFilter({
        locations: [
          { type: "coffee" },
          { type: "alcohol" },
          { type: "coffee" },
        ],
      });
      const [firstFilterButton, ...otherFilterButtons] =
        document.querySelectorAll(".filter-button");
      const type = "coffee";
      const onSelect = vi.fn();
      const onClick = onFilterButtonClick({
        type,
        onSelect,
        button: firstFilterButton,
      });
      onClick(new Event("click"));
      expect(firstFilterButton.style.display).toBe("block");
      otherFilterButtons.forEach((ofb) =>
        expect(ofb.style.display).toBe("none"),
      );
      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect).toHaveBeenCalledWith({
        filteredLocations: [{ type: "coffee" }],
      });
    });
  });
  describe("collapseFilter", () => {
    it("removes the expanded class", () => {
      document.body.innerHTML = `<div class='map-filter expanded'></div>`;
      collapseFilter();
      expect(document.querySelector(".map-filter").classList).not.toContain(
        "expanded",
      );
    });
  });
});
