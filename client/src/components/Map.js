// client/src/components/Map.js
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 19.2183,
  lng: 72.9781,
};

const Map = ({ properties = [] }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDZAgA0xEVpYRPkWHV_FDkefjF44GfDtTg">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {properties.map((property, index) => (
          <Marker
            key={index}
            position={{ lat: property.lat, lng: property.lng }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
