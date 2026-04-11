(async () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYW1ibGVhcHAiLCJhIjoiY21ucTViOTQyMDQyNzJxb2J6ODB4bWFwdiJ9.mfpPxQJXotqvIpUxXSZXjw";
  let map;

  const initializeMap = () => {
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
    const customMarkerBuilder = (type) => (emoji) => {
      const element = document.createElement("div");
      element.classList.add(`svf-marker-${type}`);
      element.innerHTML = emoji;
      return element;
    };
    map.on("load", async () => {
      const response = await fetch(
        "https://stage-silvervoxfest.wordpress.n4m.net/wp-json/wp/v2/place?per_page=100",
      );
      const locations = await response.json();
      locations.forEach((location) => {
        const options = {};

        const customMarker = customMarkerBuilder(location.type);
        if (location.type === "coffee") {
          options.element = customMarker("☕️");
        }
        if (location.type === "alcohol") {
          options.element = customMarker("🍻");
        }
        if (location.type === "food") {
          options.element = customMarker("🍽️");
        }
        if (location.type === "hotel") {
          options.element = customMarker("🏨");
        }
        if (location.type === "venue") {
          options.element = customMarker("🎭");
        }

        new mapboxgl.Marker(options)
          .setLngLat([location.lng, location.lat])
          .setPopup(
            new mapboxgl.Popup({ focusAfterOpen: false }).setHTML(
              `<h3>${location.title.rendered}</h3>
               ${location.content.rendered ?? ""}
               <p>
                <a href='https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}' target='_blank'>${location.address}</a>
               </p>
               <p><a href='${location.url}' target='_blank'>${location.url}</a></p>`,
            ),
          )
          .addTo(map);
      });
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
    });
  };

  initializeMap();
})();
