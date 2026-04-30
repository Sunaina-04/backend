import L from "leaflet";

const createSvgIcon = (color) =>
  L.divIcon({
    className: "",
    html: `
      <svg width="30" height="42" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22s12-13 12-22C24 5.37 18.63 0 12 0z"
          fill="${color}"
        />
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36]
  });

export const priorityIcons = {
  high: createSvgIcon("#e50000ff"),    // red-600
  medium: createSvgIcon("#ff710cff"),  // orange-500
  low: createSvgIcon("#f4c300ff"),     // ✅ light yellow
  default: createSvgIcon("#60A5FA")  // blue-400
};
