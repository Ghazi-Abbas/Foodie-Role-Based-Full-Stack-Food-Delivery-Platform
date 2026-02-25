import React, { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";

export default function UserLocationMap() {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState("");

  // Get user location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        loadMap(latitude, longitude);
        getAddress(latitude, longitude);
      },
      () => alert("Location Permission Denied")
    );
  };

  // Show Map
  const loadMap = (latitude, longitude) => {
    let createdMap = map;

    if (!createdMap) {
      createdMap = L.map("map").setView([latitude, longitude], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(createdMap);

      setMap(createdMap);
    }

    if (marker) {
      marker.setLatLng([latitude, longitude]);
    } else {
      const newMarker = L.marker([latitude, longitude]).addTo(createdMap);
      setMarker(newMarker);
    }

    createdMap.setView([latitude, longitude], 14);
  };

  // Get Address (Reverse Geocoding)
  const getAddress = async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      setAddress(res.data?.display_name || "Address not found");
    } catch {
      setAddress("Address fetch error");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📍 Free Maps (OpenStreetMap + Leaflet)</h2>

      <button
        onClick={getLocation}
        style={{
          padding: "12px 22px",
          background: "#ff4b2b",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Get My Location
      </button>

      {lat && lng && (
        <>
          <p><b>Latitude:</b> {lat}</p>
          <p><b>Longitude:</b> {lng}</p>
          <p><b>Address:</b> {address}</p>

          <div
            id="map"
            style={{
              height: "400px",
              width: "100%",
              marginTop: "10px",
              borderRadius: "12px",
              border: "2px solid #ccc"
            }}
          ></div>
        </>
      )}
    </div>
  );
}
