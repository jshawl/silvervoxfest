import { initializeMap, fitBounds } from "@places/map";
import { createMarkers, closePopups, ICON_MAP } from "@places/marker";
import { initializeFilter, collapseFilter } from "@places/filter";

export const getLocationTypes = (locations) =>
  [...new Set(locations.map((l) => l.type))].sort((a, b) => a.localeCompare(b));

let markers = [];
let locations;
initializeMap({
  onMapLoad: async (map) => {
    const response = await fetch("/wp-json/wp/v2/place?per_page=100");
    locations = await response.json();
    markers = createMarkers({ locations });
    markers.forEach(({ marker }) => marker.addTo(map));
    fitBounds({ map, locations });
    const tree = getLocationTypes(locations).map((type) => ({
      // TODO this is not alphabetically sorted because the emoji is in the label
      label: `${ICON_MAP[type].emoji} ${ICON_MAP[type].label}`,
      children: markers
        .filter(({ location }) => location.type === type)
        .map(({ marker, location }) => ({
          label: location.title.rendered,
          marker,
          location,
        })),
    }));
    initializeFilter({
      tree,
      onSelect: (places) => {
        const locations = places.map(({ location }) => location);
        fitBounds({ map, locations });

        markers.forEach(({ marker }) => {
          marker.getElement().style.display = "none";
        });
        places.forEach(({ marker }) => {
          marker.getElement().style.display = "block";
        });

        closePopups();
        if (places.length === 1) {
          const popup = places[0].marker.getPopup();
          if (!popup.isOpen()) {
            places[0].marker.togglePopup();
          }
        }
      },
    });
  },
  onMapClick: (map) => {
    collapseFilter();
    closePopups();
    markers.forEach(({ marker }) => {
      marker.getElement().style.display = "block";
    });
    fitBounds({ map, locations });
  },
});
