"use client";

import React, { useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { silverMapStyle } from "@/utils/mapStyles";

const libraries: ("places")[] = ["places"];

export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  label?: string;
}

interface MultiMarkerMapProps {
  markers: MapMarker[];
  selectedMarkerId?: string;
  center?: { lat: number; lng: number };
  onMarkerClick?: (markerId: string) => void;
  minHeight?: string;
  className?: string;
  defaultZoom?: number;
  selectedZoom?: number;
}

const DEFAULT_CENTER = { lat: 6.3017314, lng: -75.5743796 };

export const MultiMarkerMap: React.FC<MultiMarkerMapProps> = ({
  markers,
  selectedMarkerId,
  center,
  onMarkerClick,
  minHeight = "200px",
  className = "",
  defaultZoom = 13,
  selectedZoom = 15,
}) => {
  console.log("Markers en MultiMarkerMap:", markers);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const handleMarkerClick = useCallback(
    (markerId: string) => {
      onMarkerClick?.(markerId);
    },
    [onMarkerClick]
  );

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ minHeight }}
      >
        <span className="text-gray-500">Cargando mapa...</span>
      </div>
    );
  }

  const mapCenter = center || (markers.length > 0 ? markers[0].position : DEFAULT_CENTER);
  const zoom = selectedMarkerId ? selectedZoom : defaultZoom;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
        minHeight,
      }}
      mapContainerClassName={className}
      center={mapCenter}
      zoom={zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: silverMapStyle,
      }}
    >
      {markers.map((marker) => {
        const isSelected = marker.id === selectedMarkerId;
        return (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker.id)}
            icon={{
              url: "/Pin.png",
              scaledSize: new google.maps.Size(
                isSelected ? 70 : 50,
                isSelected ? 80 : 58
              ),
              anchor: new google.maps.Point(
                isSelected ? 35 : 25,
                isSelected ? 80 : 58
              ),
            }}
            opacity={isSelected ? 1 : 0.6}
            title={marker.label}
          />
        );
      })}
    </GoogleMap>
  );
};

export default MultiMarkerMap;
