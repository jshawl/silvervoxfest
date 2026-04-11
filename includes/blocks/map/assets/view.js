import { initializeMap, fitBounds } from "@places/map";
import { createMarkers, filterMarkers } from "@places/marker";
import { initializeFilter, collapseFilter } from "@places/filter";

let markers = [];
let locations;
initializeMap({
  onMapLoad: async (map) => {
    const response = await fetch(
      "https://stage-silvervoxfest.wordpress.n4m.net/wp-json/wp/v2/place?per_page=100",
    );
    locations = await response.json();
    markers = createMarkers({ locations });
    markers.forEach(({ marker }) => marker.addTo(map));
    fitBounds({ map, locations });
    initializeFilter({
      locations,
      onSelect: (type) => {
        const filteredMarkers = filterMarkers({ type });
        const filteredLocations = filteredMarkers.map(
          ({ location }) => location,
        );
        fitBounds({ map, locations: filteredLocations });
      },
    });
  },
  onMapClick: (map) => {
    collapseFilter();
    markers.forEach(({ marker }) => {
      marker.getElement().style.display = "block";
    });
    fitBounds({ map, locations });
  },
});
