/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, beforeEach, vi } from "vitest";
import { initializeFilter } from "./filter";

vi.mock("@places/marker", async () => {
  return {
    ...(await vi.importActual("@places/marker")),
    getMarkers: vi.fn(),
  };
});

const click = (element) => element.dispatchEvent(new Event("click"));
const type = (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event("keyup"));
};

describe("filter", () => {
  const coffeeShops = [
    {
      id: 1,
      location: {
        title: "A Coffee Shop",
      },
    },
    {
      id: 2,
      location: {
        title: "Another Coffee Shop",
      },
    },
  ];
  const tree = [
    {
      id: "coffee",
      children: coffeeShops,
    },
    {
      id: "alcohol",
      children: [
        {
          id: 3,
          location: {
            title: "A Saloon",
          },
        },
      ],
    },
  ];
  describe("initializeFilter", () => {
    beforeEach(() => {
      document.body.innerHTML = `<div class='map-filter'>
        <input/>
        <span class="close-filter"></span>
      </div>`;
    });
    it("expands on click", () => {
      const container = document.querySelector(".map-filter");
      initializeFilter({ onSelect: vi.fn(), tree: [] });
      expect(container.classList).not.toContain("expanded");
      click(container);
      expect(container.classList).toContain("expanded");
      // collapse
      click(container.querySelector(".close-filter"));
      expect(container.classList).not.toContain("expanded");
    });
    it("renders the whole tree but only groups are visible", () => {
      initializeFilter({
        tree,
        onSelect: vi.fn(),
      });
      const container = document.querySelector(".map-filter");
      click(container);
      // visible group
      expect(
        container.querySelector("[data-filter-id='coffee']").classList,
      ).not.toContain("hidden");
      // hidden item
      expect(
        container.querySelector("[data-filter-id='1']").classList,
      ).toContain("hidden");
    });
    it("shows items on group click and hides other groups", () => {
      const onSelect = vi.fn();
      initializeFilter({
        tree,
        onSelect,
      });
      const container = document.querySelector(".map-filter");
      click(container);
      click(container.querySelector("[data-filter-id='coffee']"));
      expect(onSelect).toHaveBeenCalledWith(coffeeShops);
      //visible group

      expect(
        container.querySelector("[data-filter-id='coffee']").classList,
      ).not.toContain("hidden");
      // visible item
      expect(
        container.querySelector("[data-filter-id='1']").classList,
      ).not.toContain("hidden");
      expect(
        container.querySelector("[data-filter-id='2']").classList,
      ).not.toContain("hidden");
      // hidden sibling groups
      expect(
        container.querySelector("[data-filter-id='alcohol']").classList,
      ).toContain("hidden");
    });
    it("keeps showing the group on item click", () => {
      const onSelect = vi.fn();
      initializeFilter({
        tree,
        onSelect,
      });
      const container = document.querySelector(".map-filter");
      container.dispatchEvent(new Event("click"));
      click(container.querySelector("[data-filter-id='coffee']"));
      click(container.querySelector("[data-filter-id='1']"));
      expect(onSelect).toHaveBeenCalledWith([coffeeShops[0]]);
      // visible sibling item
      expect(
        container.querySelector("[data-filter-id='2']").classList,
      ).not.toContain("hidden");
    });
    it("searches groups and items", () => {
      initializeFilter({
        tree,
        onSelect: vi.fn(),
      });
      const container = document.querySelector(".map-filter");
      click(container);
      type(container.querySelector("input"), "saloon");
      expect(
        container.querySelector("[data-filter-id='alcohol']").classList,
      ).not.toContain("hidden");
      expect(
        container.querySelector("[data-filter-id='3']").classList,
      ).not.toContain("hidden");
    });
    it("only shows groups when the search is cleared", () => {
      initializeFilter({
        tree,
        onSelect: vi.fn(),
      });
      const container = document.querySelector(".map-filter");
      click(container);
      type(container.querySelector("input"), "");
      const items = container.querySelectorAll(".filter-item");
      items.forEach((item) => {
        expect(item.classList).toContain("hidden");
      });
    });
  });
});
