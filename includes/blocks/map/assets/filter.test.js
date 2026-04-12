/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  collapseFilter,
  getFilterContainer,
  initializeFilter,
  onFilterTypeButtonClick,
} from "./filter";

import { getMarkers } from "@places/marker";

vi.mock("@places/marker", async () => {
  return {
    ...(await vi.importActual("@places/marker")),
    getMarkers: vi.fn(),
  };
});

describe("filter", () => {
  const locations = [
    { type: "coffee", title: { rendered: "Java Hut" } },
    { type: "alcohol", title: { rendered: "Turnt town" } },
    { type: "coffee", title: { rendered: "Joe's Joe" } },
  ];
  const marker = {
    getElement: () => ({
      style: {
        display: "",
      },
    }),
  };
  describe("initializeFilter", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div class='map-filter'></div>`;
    });
    it("expands on click", () => {
      getMarkers.mockImplementationOnce(() => [
        { location: locations[0], marker },
        { location: locations[1], marker },
      ]);
      initializeFilter({ locations, onSelect: vi.fn() });
      expect(getFilterContainer().classList).not.toContain("expanded");
      getFilterContainer().dispatchEvent(new Event("click"));
      expect(getFilterContainer().classList).toContain("expanded");
    });
    it("adds location types and locations to the list", () => {
      initializeFilter({
        locations,
      });
      const html = getFilterContainer().innerHTML;
      expect(html).toContain("Coffee Shops");
      expect(html).toContain("Java Hut");
      expect(html).toContain("Bars");
      expect(
        document.querySelector(".filter-location-button").style.display,
      ).toBe("none");
    });
  });
  describe("onFilterButtonClick", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div class='map-filter'></div>`;
    });
    it("hides the other filter buttons and shows locations", () => {
      getMarkers.mockImplementationOnce(() => [
        { location: locations[0], marker },
        { location: locations[1], marker },
      ]);
      initializeFilter({
        locations,
      });
      const [firstFilterButton, ...otherFilterButtons] =
        document.querySelectorAll(".filter-type-button");
      const type = "coffee";
      const onSelect = vi.fn();
      const onClick = onFilterTypeButtonClick({
        type,
        onSelect,
        button: firstFilterButton,
      });
      onClick(new Event("click"));
      expect(firstFilterButton.parentElement.style.display).toBe("block");
      expect(firstFilterButton.parentElement.childNodes[0].style.display).toBe(
        "block",
      );
      otherFilterButtons.forEach((ofb) =>
        expect(ofb.parentElement.style.display).toBe("none"),
      );
      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect).toHaveBeenCalledWith({
        filteredLocations: [locations[0]],
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
