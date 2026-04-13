/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { collapseFilter, getFilterContainer, initializeFilter } from "./filter";

vi.mock("@places/marker", async () => {
  return {
    ...(await vi.importActual("@places/marker")),
    getMarkers: vi.fn(),
  };
});

describe("filter", () => {
  const coffeeShops = [
    {
      location: {
        title: "A Coffee Shop",
      },
      label: "A Coffee Shop",
    },
    {
      location: {
        title: "Another Coffee Shop",
      },
      label: "Another Coffee Shop",
    },
  ];
  const tree = [
    {
      label: "☕️ Coffee Shops",
      children: coffeeShops,
    },
    {
      label: "🍻 Bars",
      children: [
        {
          location: {
            title: "A Bar",
          },
          label: "A Bar",
        },
      ],
    },
  ];
  describe("initializeFilter", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div class='map-filter'><input/></div>`;
    });
    it("expands on click", () => {
      initializeFilter({ onSelect: vi.fn(), tree: [] });
      expect(getFilterContainer().classList).not.toContain("expanded");
      getFilterContainer().dispatchEvent(new Event("click"));
      expect(getFilterContainer().classList).toContain("expanded");
    });
    it("renders the whole tree but only groups are visible", () => {
      initializeFilter({
        tree,
        onSelect: vi.fn(),
      });
      const container = getFilterContainer();
      container.dispatchEvent(new Event("click"));
      // visible group
      expect(
        container.querySelector("[data-filter-key='☕️ Coffee Shops']")
          .classList,
      ).not.toContain("hidden");
      // hidden item
      expect(
        container.querySelector("[data-filter-key='A Coffee Shop']").classList,
      ).toContain("hidden");
    });
    it("shows items on group click and hides other groups", () => {
      const onSelect = vi.fn();
      initializeFilter({
        tree,
        onSelect,
      });
      const container = getFilterContainer();
      container.dispatchEvent(new Event("click"));
      container
        .querySelector("[data-filter-key='☕️ Coffee Shops']")
        .dispatchEvent(new Event("click"));
      expect(onSelect).toHaveBeenCalledWith(coffeeShops);
      // visible item
      expect(
        container.querySelector("[data-filter-key='A Coffee Shop']").classList,
      ).not.toContain("hidden");
      expect(
        container.querySelector("[data-filter-key='Another Coffee Shop']")
          .classList,
      ).not.toContain("hidden");
      // hidden sibling groups
      const otherGroup = [
        ...container.querySelectorAll("[data-filter-key]"),
      ].find((el) => el.dataset.filterKey === "🍻 Bars");
      expect(otherGroup.classList).toContain("hidden");
    });
    it("keeps showing the group on item click", () => {
      const onSelect = vi.fn();
      initializeFilter({
        tree,
        onSelect,
      });
      const container = getFilterContainer();
      container.dispatchEvent(new Event("click"));
      container
        .querySelector("[data-filter-key='☕️ Coffee Shops']")
        .dispatchEvent(new Event("click"));
      const item = container.querySelector("[data-filter-key='A Coffee Shop']");
      item.dispatchEvent(new Event("click"));
      expect(onSelect).toHaveBeenCalledWith([coffeeShops[0]]);
      // visible sibling item
      expect(
        container.querySelector("[data-filter-key='Another Coffee Shop']")
          .classList,
      ).not.toContain("hidden");
    });
    it("searches groups and items", () => {
      initializeFilter({
        tree,
        onSelect: vi.fn(),
      });
      const container = getFilterContainer();
      container.dispatchEvent(new Event("click"));
      const input = container.querySelector("input");
      input.value = "bar";
      input.dispatchEvent(new Event("keyup"));
      expect(
        container.querySelector("[data-filter-key='A Bar']").classList,
      ).not.toContain("hidden");
    });
    it("only shows groups when the search is cleared", () => {
      initializeFilter({
        tree,
        onSelect: vi.fn(),
      });
      const container = getFilterContainer();
      container.dispatchEvent(new Event("click"));
      const input = container.querySelector("input");
      input.value = "";
      input.dispatchEvent(new Event("keyup"));
      const items = container.querySelectorAll(".filter-item");
      items.forEach((item) => {
        expect(item.classList).toContain("hidden");
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
