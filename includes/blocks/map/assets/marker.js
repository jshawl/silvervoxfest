export const createElement = ({ type, emoji }) => {
  const element = document.createElement("div");
  element.classList.add(`svf-marker-${type}`);
  element.innerHTML = emoji;
  return element;
};

let markers = [];

export const createMarkers = ({ locations }) => {
  locations.forEach((location) => {
    markers.push({ marker: createMarker(location), location });
  });
  return markers;
};

export const ICON_MAP = {
  coffee: { emoji: "☕️", label: "Coffee Shops" },
  alcohol: { emoji: "🍻", label: "Bars" },
  food: { emoji: "🍽️", label: "Restaurants" },
  hotel: { emoji: "🏨", label: "Hotels" },
  venue: { emoji: "🎭", label: "Venues" },
};

export const createMarker = (location) => {
  const options = {
    element: createElement({
      type: location.type,
      emoji: ICON_MAP[location.type].emoji,
    }),
  };

  const marker = new mapboxgl.Marker(options)
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
    );
  marker.getElement().addEventListener("click", (e) => {
    e.stopPropagation();
    markers.forEach(({ marker }) => {
      marker.getPopup()?.remove();
    });
    marker.togglePopup();
  });
  return marker;
};

export const filterMarkers = ({ type }) => {
  markers.forEach(({ marker }) => {
    marker.getElement().style.display = "none";
  });
  const filteredMarkers = markers.filter(
    ({ location }) => location.type === type,
  );
  filteredMarkers.forEach(({ marker }) => {
    marker.getElement().style.display = "block";
  });
  return filteredMarkers;
};
