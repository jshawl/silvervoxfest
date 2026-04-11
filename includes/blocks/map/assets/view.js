import { initializeMap, fitBounds } from "@places/map";
import { createMarker } from "@places/marker";

initializeMap({
  onMapLoad: async (map) => {
    const response = await fetch("/wp-json/wp/v2/place?per_page=100");
    const locations = await response.json();
    locations.forEach((location) => {
      createMarker(location).addTo(map);
    });
    fitBounds({ map, locations });
  },
});
