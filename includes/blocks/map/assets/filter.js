import { ICON_MAP } from "@places/marker";

const el = document.querySelector(".map-filter");

let locations;
export const initializeFilter = ({ locations: fetchedLocations, onSelect }) => {
  locations = fetchedLocations;
  el.addEventListener("click", () => {
    el.classList.add("expanded");
  });

  const names = locations
    .reduce((acc, el) => {
      if (!acc.includes(el.type)) {
        acc.push(el.type);
      }
      return acc;
    }, [])
    .sort((a, b) => a.localeCompare(b));
  const list = document.createElement("div");
  list.classList.add("content");

  names.forEach((name) => {
    const button = document.createElement("div");
    button.classList.add("filter-button");
    button.innerHTML = `${ICON_MAP[name].emoji} ${ICON_MAP[name].label}`;
    button.addEventListener("click", () => {
      onSelect(name);
    });
    list.append(button);
  });
  el.append(list);
};

export const collapseFilter = () => {
  el.classList.remove("expanded");
};
