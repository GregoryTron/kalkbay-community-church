import React, { useState, useRef, useEffect } from 'react';
import { LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import { toast } from 'sonner';
import { CHURCH_LOCATION } from '../config/maps';
import { MapControls } from './map/MapControls';
import { ZoomControls } from './map/ZoomControls';
import { MapContainer } from './map/MapContainer';
import type { TravelMode } from './map/types';

const libraries: ("places" | "geometry")[] = ["places", "geometry"];
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const DirectionsMap: React.FC = () => {
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<TravelMode>('DRIVING');
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const originRef = useRef<google.maps.places.Autocomplete | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
    setIsLoaded(true);
  };

  const handleLoadError = (error: Error) => {
    console.error('Error loading Google Maps:', error);
    setMapError('Failed to load Google Maps. Please try again later.');
    toast.error('Failed to load Google Maps');
  };

  useEffect(() => {
    if (!MAPS_API_KEY) {
      setMapError('Google Maps API key is not configured');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          if (window.google && isLoaded) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location }, (results, status) => {
              if (status === 'OK' && results && results[0] && autocompleteInputRef.current) {
                autocompleteInputRef.current.value = results[0].formatted_address;
              }
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            toast.error('Location access denied. Please enable location services to use this feature.');
          } else if (error.code === error.TIMEOUT) {
            toast.error('Location request timed out. Please try again.');
          } else {
            toast.error('Unable to retrieve your location. Please enter it manually.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, [isLoaded]);

  const calculateRoute = async () => {
    if (!originRef.current) {
      toast.error('Please enter your starting point');
      return;
    }

    const place = (originRef.current as any).getPlace();
    if (!place || !place.geometry) {
      toast.error('Please select a valid location from the dropdown');
      return;
    }

    setIsCalculating(true);
    const directionsService = new window.google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: place.geometry.location,
        destination: CHURCH_LOCATION,
        travelMode: window.google.maps.TravelMode[selectedMode],
        optimizeWaypoints: true
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance?.text || '');
      setDuration(results.routes[0].legs[0].duration?.text || '');
    } catch (error) {
      console.error('Directions error:', error);
      toast.error('Unable to calculate route. Please try a different location or travel mode.');
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    if (autocompleteInputRef.current) {
      autocompleteInputRef.current.value = '';
    }
  };

  if (mapError) {
    return (
      <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 dark:text-red-400 font-medium">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={libraries} onError={handleLoadError}>
        <MapContainer
          showInfoWindow={showInfoWindow}
          onInfoWindowClose={() => setShowInfoWindow(false)}
          userLocation={userLocation}
          onLoad={handleMapLoad}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 6,
                  strokeOpacity: 0.8,
                }
              }}
            />
          )}
        </MapContainer>

        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm w-full">
          <Autocomplete
            onLoad={(autocomplete) => {
              originRef.current = autocomplete;
            }}
            options={{
              componentRestrictions: { country: 'za' },
              fields: ['geometry', 'formatted_address'],
              strictBounds: false,
              types: ['geocode', 'establishment']
            }}
          >
            <input
              ref={autocompleteInputRef}
              type="text"
              placeholder="Enter your location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
        </div>

        <MapControls
          onCalculateRoute={calculateRoute}
          onClearRoute={clearRoute}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          distance={distance}
          duration={duration}
          isCalculating={isCalculating}
        />

        <ZoomControls
          onZoomIn={() => map?.setZoom((map.getZoom() || 0) + 1)}
          onZoomOut={() => map?.setZoom((map.getZoom() || 0) - 1)}
        />
      </LoadScript>
    </div>
  );
};

export default DirectionsMap;