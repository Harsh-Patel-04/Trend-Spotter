import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GeoMap = ({ data }) => {
  useEffect(() => {
    const map = L.map("map", {
      center: [20, 0],
      zoom: 2,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    data.forEach(({ lat, lng, intensity }) => {
      L.circleMarker([lat, lng], {
        color: "#3B82F6",
        fillColor: "#2563EB",
        fillOpacity: 0.5,
        radius: intensity * 2,
      }).addTo(map);
    });

    return () => map.remove();
  }, [data]);

  return <div id="map" className="h-96 w-full rounded-lg" />;
};

export default GeoMap;
