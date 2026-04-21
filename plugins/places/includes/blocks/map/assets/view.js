import { initializeMap, fitBounds } from "@places/map";
import { createMarkers, closePopups, ICON_MAP } from "@places/marker";
import { initializeFilter } from "@places/filter";

export const getLocationTypes = (locations) => [
  ...new Set(locations.map((l) => l.type)),
];

const getLabelForType = (type) => ICON_MAP[type.toLowerCase()]?.label;

export const buildTree = ({ locations, markers }) =>
  getLocationTypes(locations)
    .map((type) => ({
      id: type,
      label: `${ICON_MAP[type.toLowerCase()]?.emoji} ${getLabelForType(type)}`,
      children: markers
        .filter(({ location }) => location.type === type)
        .map(({ marker, location }) => ({
          id: location.id,
          label: location.title.rendered,
          marker,
          location,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => getLabelForType(a.id).localeCompare(getLabelForType(b.id)));

const onMapLoad = async (map) => {
  const response = await fetch("/wp-json/wp/v2/place?per_page=100");
  const locations = await response.json();
  const markers = createMarkers({ locations });
  markers.forEach(({ marker }) => marker.addTo(map));
  fitBounds({ map, locations });
  // TODO set state from url
  const tree = buildTree({ locations, markers });
  initializeFilter({
    tree,
    onSelect: (places) => {
      closePopups();
      markers.forEach(({ marker }) => {
        marker.getElement().style.display = "none";
      });
      places.forEach(({ marker }) => {
        marker.getElement().style.display = "block";
      });

      if (places.length === 1) {
        const popup = places[0].marker.getPopup();
        if (!popup.isOpen()) {
          places[0].marker.togglePopup();
        }
      }

      const locations = places.map(({ location }) => location);
      fitBounds({ map, locations });
      // TODO update url hashstate
    },
  });
};

if (!("process" in globalThis)) {
  initializeMap({
    onMapLoad,
  });
}
