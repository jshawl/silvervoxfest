import { initializeMap, fitBounds } from "@places/map";
import { createMarker } from "@places/marker";

let locations;

initializeMap({
  onMapLoad: async (map) => {
    const response = await fetch("/wp-json/wp/v2/place?per_page=100");
    locations = await response.json();
    locations.forEach((location) => {
      createMarker(location).addTo(map);
    });
    fitBounds({ map, locations });
  },
  onMapClick: () => {
    // TODO collapse filter
  },
});
