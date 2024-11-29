import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { CHURCH_LOCATION, DEFAULT_ZOOM, MAP_STYLES } from '../../config/maps';

interface MapContainerProps {
  showInfoWindow: boolean;
  onInfoWindowClose: () => void;
  userLocation: google.maps.LatLngLiteral | null;
  children?: React.ReactNode;
  onLoad: (map: google.maps.Map) => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  showInfoWindow,
  onInfoWindowClose,
  userLocation,
  children,
  onLoad
}) => {
  return (
    <GoogleMap
      center={CHURCH_LOCATION}
      zoom={DEFAULT_ZOOM}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      options={{
        ...MAP_STYLES.default,
        gestureHandling: 'cooperative',
        scrollwheel: false,
      }}
      onLoad={onLoad}
    >
      <Marker
        position={CHURCH_LOCATION}
        icon={{
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }}
      >
        {showInfoWindow && (
          <InfoWindow onCloseClick={onInfoWindowClose}>
            <div>
              <h3 className="font-semibold">Kalk Bay Community Church</h3>
              <p className="text-sm">Join us for worship!</p>
            </div>
          </InfoWindow>
        )}
      </Marker>

      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }}
        />
      )}

      {children}
    </GoogleMap>
  );
}