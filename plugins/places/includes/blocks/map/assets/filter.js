const collapseFilter = (container) => {
  container.classList.remove("expanded");
  hideAll(container);
};

const hideAll = (container) => {
  container.querySelector(".no-results").classList.add("hidden");
  container.querySelectorAll("[data-filter-id]").forEach((element) => {
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

const handleFilterContainerClick =
  ({ filterContainer }) =>
  () => {
    hideAll(filterContainer);
    filterContainer.classList.add("expanded");
    show(filterContainer, ".filter-group");
  };

const handleSearch =
  ({ filterContainer, search, tree }) =>
  () => {
    hideAll(filterContainer);

    if (search.value === "") {
      show(filterContainer, ".filter-group");
      return;
    }
    const regexp = new RegExp(search.value, "ig");
    let results = false;
    tree.forEach(({ children, id }) => {
      children.forEach((child) => {
        if (regexp.test(JSON.stringify(child.location))) {
          results = true;
          show(filterContainer, `[data-filter-id="${id}"]`);
          show(filterContainer, `[data-filter-id="${child.id}"]`);
        }
      });
    });
    if (!results) {
      show(filterContainer, ".no-results");
    }
  };

const handleGroupClick =
  ({ children, filterContainer, id, onSelect }) =>
  (e) => {
    e.stopPropagation();
    hideAll(filterContainer);
    // show this one group
    show(filterContainer, `[data-filter-id="${id}"]`);
    children.forEach((child) =>
      // show this group's children
      show(filterContainer, `[data-filter-id="${child.id}"`),
    );
    onSelect(getLeafMarkers(children));
  };

export const initializeFilter = ({ tree, onSelect }) => {
  const filterContainer = document.querySelector(".map-filter");
  const search = filterContainer.querySelector("input");
  const close = filterContainer.querySelector(".close-filter");
  close.addEventListener("click", (e) => {
    e.stopPropagation();
    collapseFilter(filterContainer);
    onSelect(getLeafMarkers(tree));
  });

  filterContainer.addEventListener(
    "click",
    handleFilterContainerClick({ filterContainer }),
  );

  search.addEventListener(
    "keyup",
    handleSearch({ filterContainer, search, tree }),
  );

  tree.forEach(({ label, children, id }) => {
    const group = document.createElement("div");
    group.classList.add("filter-group");
    group.setAttribute("data-filter-id", id);
    group.addEventListener(
      "click",
      handleGroupClick({ children, filterContainer, id, onSelect }),
    );
    group.innerHTML = label;
    children.forEach((child) => {
      const leaf = document.createElement("div");
      leaf.classList.add("filter-item");
      leaf.setAttribute(`data-filter-id`, child.id);
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
