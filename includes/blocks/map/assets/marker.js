export const createElement = ({ type, emoji }) => {
  const element = document.createElement("div");
  element.classList.add(`svf-marker-${type}`);
  element.innerHTML = emoji;
  return element;
};

export const createMarker = (location) => {
  const options = {};

  if (location.type === "coffee") {
    options.element = createElement({ type: location.type, emoji: "☕️" });
  }
  if (location.type === "alcohol") {
    options.element = createElement({ type: location.type, emoji: "🍻" });
  }
  if (location.type === "food") {
    options.element = createElement({ type: location.type, emoji: "🍽️" });
  }
  if (location.type === "hotel") {
    options.element = createElement({ type: location.type, emoji: "🏨" });
  }
  if (location.type === "venue") {
    options.element = createElement({ type: location.type, emoji: "🎭" });
  }

  return new mapboxgl.Marker(options)
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
};
