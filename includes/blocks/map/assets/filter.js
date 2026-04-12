import { ICON_MAP, closePopups } from "@places/marker";

export const getFilterContainer = () => document.querySelector(".map-filter");

const getLocationTypes = (locations) =>
  [...new Set(locations.map((l) => l.type))].sort((a, b) => a.localeCompare(b));

const setFilterTypeButtonsVisible = (visible) => {
  const buttons = document.querySelectorAll(".filter-type-button");
  buttons.forEach((button) => {
    button.parentElement.style.display = visible ? "block" : "none";
  });
};

const hideFilterLocationButtons = () => {
  document.querySelectorAll(".filter-location-button").forEach((locel) => {
    locel.style.display = "none";
  });
};

const createFilterHandler =
  ({ getFilter, onSelect, sideEffect, markers }) =>
  (e) => {
    e?.stopPropagation();
    closePopups();
    const filteredMarkers = filterMarkers({
      ...getFilter(),
      markers,
    });
    sideEffect?.({ filteredMarkers });
    onSelect({
      filteredLocations: filteredMarkers.map(({ location }) => location),
    });
  };

const createFilterTypeButton = ({ type, onSelect, markers }) => {
  const button = document.createElement("div");
  button.classList.add("filter-type-button");
  button.innerHTML = `${ICON_MAP[type].emoji} ${ICON_MAP[type].label}`;
  button.addEventListener(
    "click",
    createFilterHandler({
      markers,
      getFilter: () => ({ type }),
      onSelect,
      sideEffect: () => {
        setFilterTypeButtonsVisible(false);
        button.parentElement.style.display = "block";
        hideFilterLocationButtons();
        const locations = button.parentElement.childNodes;
        locations.forEach((location) => {
          location.style.display = "block";
        });
      },
    }),
  );
  return button;
};

const createFilterLocationButton = ({
  marker,
  location,
  onSelect,
  markers,
}) => {
  const button = document.createElement("div");
  button.classList.add("filter-location-button");
  button.innerHTML = location.title.rendered;
  button.style.display = "none";
  button.addEventListener(
    "click",
    createFilterHandler({
      markers,
      getFilter: () => ({ title: location.title }),
      onSelect,
      sideEffect: () => {
        const popup = marker.getPopup();
        if (!popup.isOpen()) {
          setTimeout(() => {
            marker.togglePopup();
          }, 500);
        }
      },
    }),
  );
  return button;
};

export const initializeFilter = ({ locations, markers, onSelect }) => {
  const el = getFilterContainer();
  el.addEventListener(
    "click",
    createFilterHandler({
      markers,
      getFilter: () => ({ all: true }),
      onSelect,
      sideEffect: () => {
        el.classList.add("expanded");
        setFilterTypeButtonsVisible(true);
        hideFilterLocationButtons();
      },
    }),
  );

  const list = document.createElement("div");
  list.classList.add("content");
  getLocationTypes(locations).forEach((type) => {
    const group = document.createElement("div");
    group.append(createFilterTypeButton({ type, onSelect, markers }));

    const markersForType = markers
      .filter(({ location }) => location.type === type)
      .sort((a, b) =>
        a.location.title.rendered.localeCompare(b.location.title.rendered),
      );
    markersForType.forEach(({ marker, location }) => {
      group.append(
        createFilterLocationButton({ marker, markers, location, onSelect }),
      );
    });
    list.append(group);
  });
  el.append(list);
};

export const collapseFilter = () =>
  getFilterContainer().classList.remove("expanded");

export const filterMarkers = ({ all, type, title, markers }) => {
  const filtered = markers.filter(
    ({ location }) => all || location.type === type || location.title === title,
  );
  const filteredSet = new Set(filtered.map(({ marker }) => marker));
  markers.forEach(
    ({ marker }) =>
      (marker.getElement().style.display = filteredSet.has(marker)
        ? "block"
        : "none"),
  );
  return filtered;
};
