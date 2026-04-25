globalThis.mapboxgl ??= {};
globalThis.SFMF ??= {};
mapboxgl.accessToken = globalThis.SFMF.mapboxAccessToken;
let map;

const fitBoundsOptions = { padding: 200 };

export const initializeMap = ({ onMapLoad }) => {
  if (!mapboxgl.accessToken) {
    throw new Error(
      "mapbox access token is undefined. Add one in the places plugin settings.",
    );
  }
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
