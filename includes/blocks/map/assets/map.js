mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1ibGVhcHAiLCJhIjoiY21ucTViOTQyMDQyNzJxb2J6ODB4bWFwdiJ9.mfpPxQJXotqvIpUxXSZXjw";
let map;

export const initializeMap = ({ onMapClick, onMapLoad }) => {
  map = new mapboxgl.Map({
    container: "map",
    center: [-77.41054, 39.41427],
    zoom: 12,
    fitBoundsOptions: {
      padding: 15, // padding to keep the bounds away from the edge of the map
    },
    style: "mapbox://styles/mapbox/standard",
    config: {
      basemap: {
        showPointOfInterestLabels: false,
        showTransitLabels: true,
      },
    },
  });

  map.on("load", async () => onMapLoad(map));
  map.on("click", onMapClick);
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
  map.fitBounds(bounds, {
    padding: 50, // px of breathing room around the edges
  });
};
