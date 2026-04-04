import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Clock, Map as MapIcon, Loader2 } from 'lucide-react';

export default function RouteMap({ results, activeDayIndex, focusedActivityIndex }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const routeLayer = useRef(null);
  const markersLayer = useRef(null);
  const markerRefs = useRef([]); // Store marker instances to trigger popups
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0, loading: false });

  // 1. Initialize the Leaflet Map once
  useEffect(() => {
    if (!window.L || mapInstance.current) return;

    // Use destination coordinates if available, otherwise fallback to a generic center
    const center = results.destinationCoordinates || { lat: 0, lng: 0 };
    
    mapInstance.current = window.L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: false // We'll add our own custom or repositioned control later
    });

    // Use a premium Dark Mode tile layer that matches our LuxeVoyage aesthetic
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(mapInstance.current);

    // Initial layer groups
    routeLayer.current = window.L.featureGroup().addTo(mapInstance.current);
    markersLayer.current = window.L.featureGroup().addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 2. Fetch and Draw Route whenever activeDayIndex changes
  useEffect(() => {
    if (!mapInstance.current || !results.itinerary[activeDayIndex]) return;

    const day = results.itinerary[activeDayIndex];
    const coords = day.activities
      .map(act => act.coordinates)
      .filter(c => c && c.lat !== 0 && c.lng !== 0);

    if (coords.length < 1) return;

    drawRoute(coords);
  }, [activeDayIndex, results]);

  async function drawRoute(coords) {
    if (!window.L) return;
    
    // Clear previous routes/markers
    routeLayer.current.clearLayers();
    markersLayer.current.clearLayers();
    markerRefs.current = [];
    setRouteInfo(prev => ({ ...prev, loading: true }));

    try {
      // 1. Add Markers for each activity
      const bounds = window.L.latLngBounds();
      coords.forEach((coord, i) => {
        const markerIcon = window.L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background: var(--primary); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid #fff; box-shadow: 0 0 10px rgba(212,175,55,0.5)">${i + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = window.L.marker([coord.lat, coord.lng], { icon: markerIcon })
          .bindPopup(`<b>Stop ${i + 1}</b><br>${results.itinerary[activeDayIndex].activities[i].place}`)
          .addTo(markersLayer.current);
        
        markerRefs.current[i] = marker;
        bounds.extend([coord.lat, coord.lng]);
      });

      // 2. Fetch Route from OSRM if there are at least 2 points
      if (coords.length >= 2) {
        // OSRM expects lon,lat format
        const coordString = coords.map(c => `${c.lng},${c.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Draw the polyline with a glowing LuxeVoyage Gold style
          window.L.geoJSON(route.geometry, {
            style: {
              color: 'var(--primary)',
              weight: 5,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '1, 10' // Subtle dashed look for a "suggested path" feel
            }
          }).addTo(routeLayer.current);

          // Update route info (convert meters to km and seconds to minutes)
          setRouteInfo({
            distance: (route.distance / 1000).toFixed(1),
            duration: Math.round(route.duration / 60),
            loading: false
          });
        }
      } else {
        setRouteInfo({ distance: 0, duration: 0, loading: false });
      }

      // 3. Pan/Zoom to fit all markers
      mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });

    } catch (err) {
      console.error('Routing Error:', err);
      setRouteInfo(prev => ({ ...prev, loading: false }));
    }
  }

  // 3. Handle specific activity focus (Fly-To)
  useEffect(() => {
    if (!mapInstance.current || focusedActivityIndex === null) return;
    
    const day = results.itinerary[activeDayIndex];
    if (!day || !day.activities[focusedActivityIndex]) return;

    const activity = day.activities[focusedActivityIndex];
    const coords = activity.coordinates;

    if (coords && coords.lat !== 0) {
      mapInstance.current.flyTo([coords.lat, coords.lng], 16, {
        animate: true,
        duration: 1.5
      });

      // Auto-open the popup for this marker
      const marker = markerRefs.current[focusedActivityIndex];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1500);
      }
    }
  }, [focusedActivityIndex, activeDayIndex, results]);

  if (!results || !results.itinerary || !Array.isArray(results.itinerary)) {
    return (
      <div className="glass" style={{ height: "400px", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: 'var(--text-muted)' }}>
        <Loader2 className="spin" size={24} />
      </div>
    );
  }

  const day = results.itinerary[activeDayIndex];
  const hasValidCoords = day && day.activities.some(act => act.coordinates && act.coordinates.lat !== 0);

  return (
    <div className="glass" style={{ height: "400px", marginBottom: "40px", padding: "8px", position: "relative", overflow: 'hidden' }}>
      {(!hasValidCoords && (!coords || coords.length === 0)) && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 2000, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', borderRadius: '12px', padding: '20px' }}>
          <MapIcon size={32} color="var(--primary)" style={{ opacity: 0.5 }} />
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>Mapping Limited</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coordinates for this day were not provided.</p>
          </div>
        </div>
      )}
      
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
      
      {/* Route Info Overlay */}
      {hasValidCoords && (
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          zIndex: 1000, 
          background: 'rgba(15, 23, 42, 0.85)', 
          backdropFilter: 'blur(10px)', 
          padding: '12px 20px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '160px'
        }}>
          {routeInfo.loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <Loader2 className="spin" size={16} />
              <span style={{ fontSize: '0.85rem' }}>Calculating Routes...</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', color: '#fff' }}><b>{routeInfo.distance} km</b> Total</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#a5b4fc" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>~{routeInfo.duration} mins driving</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Map Badge */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, background: 'var(--primary)', color: '#000', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapIcon size={12} />
        {hasValidCoords ? 'LIVE SMART ROUTING' : 'STATIC LOCATION VIEW'}
      </div>
    </div>
  );
}
