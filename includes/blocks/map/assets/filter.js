export const getFilterContainer = () => document.querySelector(".map-filter");

export const getLocationTypes = (locations) =>
  [...new Set(locations.map((l) => l.type))].sort((a, b) => a.localeCompare(b));

export const collapseFilter = () => {
  const container = getFilterContainer();
  container.classList.remove("expanded");
  hideAll(container);
};

const hideAll = (container) => {
  hide(container, ".filter-group");
  hide(container, ".filter-item");
};

const hide = (container, selector) => {
  container.querySelectorAll(selector).forEach((element) => {
    element.classList.add("hidden");
  });
};

const show = (container, selector) => {
  container.querySelectorAll(selector).forEach((element) => {
    element.classList.remove("hidden");
  });
};

const getLeafMarkers = (nodes) =>
  nodes.flatMap((node) =>
    node.children ? getLeafMarkers(node.children) : [node],
  );

export const initializeFilter = ({ tree, onSelect }) => {
  const filterContainer = getFilterContainer();
  filterContainer.addEventListener("click", (e) => {
    filterContainer.classList.add("expanded");
    show(filterContainer, ".filter-group");
    hide(filterContainer, ".filter-item");
    onSelect(getLeafMarkers(tree));
  });

  const search = filterContainer.querySelector("input");
  search.addEventListener("keyup", (e) => {
    hideAll(filterContainer);

    if (search.value === "") {
      show(filterContainer, ".filter-group");
      return;
    }
    const regexp = new RegExp(search.value, "ig");
    tree.forEach(({ label, children }) => {
      if (regexp.test(label)) {
        show(filterContainer, `[data-filter-key="${label}"]`);
      }
      children.forEach((child) => {
        if (regexp.test(JSON.stringify(child.location))) {
          show(filterContainer, `[data-filter-key="${label}"]`);
          show(filterContainer, `[data-filter-key="${child.label}"]`);
        }
      });
    });
  });

  tree.forEach(({ label, children }) => {
    const group = document.createElement("div");
    group.classList.add("filter-group");
    group.setAttribute("data-filter-key", label);
    group.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAll(filterContainer);
      // show this one group
      show(filterContainer, `[data-filter-key="${label}"]`);
      children.forEach((child) =>
        // show this group's children
        show(filterContainer, `[data-filter-key="${child.label}"`),
      );
      onSelect(getLeafMarkers(children));
    });
    group.innerHTML = label;
    children.forEach((child) => {
      const leaf = document.createElement("div");
      leaf.classList.add("filter-item");
      leaf.setAttribute(`data-filter-key`, child.label);
      leaf.innerHTML = child.label;
      leaf.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect(getLeafMarkers([child]));
      });
      group.append(leaf);
    });
    filterContainer.append(group);
  });
  hideAll(filterContainer);
};
