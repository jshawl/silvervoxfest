import { ICON_MAP, getMarkers, closePopups } from "@places/marker";

const el = document.querySelector(".map-filter");

let locations;
export const initializeFilter = ({ locations: fetchedLocations, onSelect }) => {
  locations = fetchedLocations;
  el.addEventListener("click", () => {
    el.classList.add("expanded");
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach((button) => {
      button.style.display = "block";
    });
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
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      closePopups();
      const buttons = document.querySelectorAll(".filter-button");
      buttons.forEach((button) => {
        button.style.display = "none";
      });
      button.style.display = "block";
      const filteredMarkers = filterMarkers({
        type: name,
        markers: getMarkers(),
      });
      const filteredLocations = filteredMarkers.map(({ location }) => location);
      onSelect({ filteredLocations });
    });
    list.append(button);
  });
  el.append(list);
};

export const collapseFilter = () => {
  el.classList.remove("expanded");
};

export const filterMarkers = ({ type, markers }) => {
  markers.forEach(({ marker }) => {
    marker.getElement().style.display = "none";
  });
  const filteredMarkers = markers.filter(
    ({ location }) => location.type === type,
  );
  filteredMarkers.forEach(({ marker }) => {
    marker.getElement().style.display = "block";
  });
  return filteredMarkers;
};
