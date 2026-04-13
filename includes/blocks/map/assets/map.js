mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1ibGVhcHAiLCJhIjoiY21ucTViOTQyMDQyNzJxb2J6ODB4bWFwdiJ9.mfpPxQJXotqvIpUxXSZXjw";
let map;

const fitBoundsOptions = { padding: 200 };

export const initializeMap = ({ onMapClick, onMapLoad }) => {
  // TODO why is map.js rendered in place edit?
  map = new mapboxgl.Map({
    container: "map",
    center: [-77.41054, 39.41427],
    fitBoundsOptions,
    zoom: 15,
    maxZoom: 17,
    style: "mapbox://styles/mapbox/standard",
    config: {
      basemap: {
        showPointOfInterestLabels: false,
        showTransitLabels: true,
      },
    },
  });

  map.on("load", async () => onMapLoad(map));
  map.on("click", () => onMapClick(map));
};

export const fitBounds = ({ map, locations }) => {
  const bounds = locations.reduce(
    (bounds, location) => {
      return bounds.extend([location.lng, location.lat]);
    },
    new mapboxgl.LngLatBounds(
      [locations[0].lng, locations[0].lat],
      [locations[0].lng, locations[0].lat],
    ),
  );
  map.fitBounds(bounds, fitBoundsOptions);
};
