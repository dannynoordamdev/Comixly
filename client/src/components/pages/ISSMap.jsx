import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import satelliteIconImg from "../../../public/satellite.png";

const satelliteIcon = L.icon({
  iconUrl: satelliteIconImg,
  iconSize: [40, 40], 
  iconAnchor: [20, 20], 
  popupAnchor: [0, -20], 
});

function ISSMap() {
  const [issPosition, setIssPosition] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/iss");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data.error) {
        setIssPosition({ lat: data.lat, lon: data.lon });
      }
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  return (
    <div style={{ width: "600px", height: "400px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 0 30px #00ffe0" }}>
      <MapContainer
        center={[issPosition.lat, issPosition.lon]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />
        <Marker position={[issPosition.lat, issPosition.lon]} icon={satelliteIcon}>
          <Popup>
            <div style={{ color: "#00ffe0", fontWeight: "bold" }}>
              🚀 ISS Current Position<br />
              Lat: {issPosition.lat.toFixed(2)}<br />
              Lon: {issPosition.lon.toFixed(2)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default ISSMap;
