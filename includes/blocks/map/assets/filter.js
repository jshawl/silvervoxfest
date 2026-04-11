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

const onFilterContainerClick =
  ({ onSelect }) =>
  () => {
    closePopups();
    const el = getFilterContainer();
    el.classList.add("expanded");
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach((button) => {
      button.parentElement.style.display = "block";
    });
    document.querySelectorAll(".filter-location").forEach((locel) => {
      locel.style.display = "none";
    });
    const filteredMarkers = filterMarkers({
      all: true,
      markers: getMarkers(),
    });
    const filteredLocations = filteredMarkers.map(({ location }) => location);
    onSelect({ filteredLocations });
  };

export const onFilterButtonClick =
  ({ type, onSelect, button }) =>
  (e) => {
    e.stopPropagation();
    closePopups();
    const buttons = document.querySelectorAll(".filter-button");
    buttons.forEach((button) => {
      button.parentElement.style.display = "none";
    });
    button.parentElement.style.display = "block";
    document.querySelectorAll(".filter-location").forEach((locel) => {
      locel.style.display = "none";
    });
    const locations = button.parentElement.childNodes;
    locations.forEach((location) => {
      location.style.display = "block";
    });
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

const createFilterLocation = ({ location, onSelect }) => {
  const el = document.createElement("div");
  el.classList.add("filter-location");
  el.innerHTML = location.title.rendered;
  el.style.display = "none";
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    closePopups();
    const filteredMarkers = filterMarkers({
      title: location.title,
      markers: getMarkers(),
    });
    const popup = filteredMarkers[0].marker.getPopup();
    if (!popup.isOpen()) {
      filteredMarkers[0].marker.togglePopup();
    }
    const filteredLocations = filteredMarkers.map(({ location }) => location);
    onSelect({ filteredLocations });
  });
  return el;
};

let locations;
export const initializeFilter = ({ locations: fetchedLocations, onSelect }) => {
  locations = fetchedLocations;
  const el = getFilterContainer();
  el.addEventListener("click", onFilterContainerClick({ onSelect }));

  const list = document.createElement("div");
  list.classList.add("content");

  getLocationTypes(locations).forEach((type) => {
    const group = document.createElement("div");
    group.append(createFilterButton({ type, onSelect }));

    const locationsForType = locations
      .filter((location) => location.type === type)
      .sort((a, b) => a.title.rendered.localeCompare(b.title.rendered));
    locationsForType.forEach((location) => {
      group.append(createFilterLocation({ location, onSelect }));
    });
    list.append(group);
  });
  el.append(list);
};

export const collapseFilter = () =>
  getFilterContainer().classList.remove("expanded");

export const filterMarkers = ({ all, type, title, markers }) =>
  markers.filter(({ location, marker }) => {
    marker.getElement().style.display = "none";
    if (location.type === type || location.title === title || all) {
      marker.getElement().style.display = "block";
      return true;
    }
    return false;
  });
