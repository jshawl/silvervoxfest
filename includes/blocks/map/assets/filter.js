import { ICON_MAP, getMarkers, closePopups } from "@places/marker";

export const getFilterContainer = () => document.querySelector(".map-filter");

const getLocationTypes = (locations) =>
  locations
    .reduce((acc, el) => {
      if (!acc.includes(el.type)) {
        acc.push(el.type);
      }
      return acc;
    }, [])
    .sort((a, b) => a.localeCompare(b));

const onFilterContainerClick = () => {
  const el = getFilterContainer();
  el.classList.add("expanded");
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach((button) => {
    button.style.display = "block";
  });
};

export const onFilterButtonClick =
  ({ type, onSelect, button }) =>
  (e) => {
    e.stopPropagation();
    closePopups();
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach((button) => {
      button.style.display = "none";
    });
    button.style.display = "block";
    const filteredMarkers = filterMarkers({
      type,
      markers: getMarkers(),
    });
    const filteredLocations = filteredMarkers.map(({ location }) => location);
    onSelect({ filteredLocations });
  };

const createFilterButton = ({ type, onSelect }) => {
  const button = document.createElement("div");
  button.classList.add("filter-button");
  button.innerHTML = `${ICON_MAP[type].emoji} ${ICON_MAP[type].label}`;
  button.addEventListener(
    "click",
    onFilterButtonClick({ type, onSelect, button }),
  );
  return button;
};

let locations;
export const initializeFilter = ({ locations: fetchedLocations, onSelect }) => {
  locations = fetchedLocations;
  const el = getFilterContainer();
  el.addEventListener("click", onFilterContainerClick);

  const list = document.createElement("div");
  list.classList.add("content");

  getLocationTypes(locations).forEach((type) => {
    list.append(createFilterButton({ type, onSelect }));
  });
  el.append(list);
};

export const collapseFilter = () =>
  getFilterContainer().classList.remove("expanded");

export const filterMarkers = ({ type, markers }) =>
  markers.filter(({ location, marker }) => {
    marker.getElement().style.display = "none";
    if (location.type === type) {
      marker.getElement().style.display = "block";
      return true;
    }
    return false;
  });
