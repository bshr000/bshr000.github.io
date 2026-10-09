'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { NavigationControl, ScaleControl, type MapRef } from 'react-map-gl/maplibre';
import type { Place } from '@/types/life/travel-map/place';
import { getBounds } from '@/lib/life/travel-map/geo';
import { getMapStyle } from '@/lib/life/travel-map/map-style';
import { useMapTheme } from './useMapTheme';
import PlaceMarker from './PlaceMarker';
import JourneyRoute from './JourneyRoute';
import s from './PlacesMap.module.css';
export default function PlacesMap({ places, selectedPlaceId, hoveredPlaceId, onSelect, onHover, showRoute, viewRequest }: { places: Place[]; selectedPlaceId: string | null; hoveredPlaceId: string | null; onSelect: (id: string) => void; onHover: (id: string | null) => void; showRoute: boolean; viewRequest: number }) {
  const mapRef = useRef<MapRef>(null);
  const dark = useMapTheme();
  const mapStyle = useMemo(() => getMapStyle(dark), [dark]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const duration = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000;
  const resetView = useCallback(() => {
    const bounds = getBounds(places);
    if (bounds) mapRef.current?.fitBounds(bounds, { padding: { top: 64, bottom: 65, left: 48, right: 48 }, maxZoom: 8, duration: duration() });
  }, [places]);
  useEffect(() => {
    if (!ready) return;
    const place = places.find(p => p.id === selectedPlaceId);
    if (place) mapRef.current?.flyTo({ center: [place.longitude, place.latitude], zoom: 7.5, duration: duration() });
    else resetView();
  }, [ready, selectedPlaceId, places, resetView, viewRequest]);
  useEffect(() => {
    if (ready) return;
    const timeout = window.setTimeout(() => setError(true), 18000);
    return () => window.clearTimeout(timeout);
  }, [ready, retry]);
  return <div className={s.container}>
    <Map key={retry} ref={mapRef} initialViewState={{ longitude: 123, latitude: 46.5, zoom: 4.1, bounds: getBounds(places), fitBoundsOptions: { padding: 64 } }} mapStyle={mapStyle} minZoom={2} maxZoom={15} onLoad={() => { setReady(true); setError(false); }} onError={() => setError(true)} onIdle={() => { if (mapRef.current?.areTilesLoaded()) setError(false); }} attributionControl={{ compact: true }}>
      <NavigationControl position="top-left" visualizePitch={false} />
      <ScaleControl position="bottom-left" unit="metric" />
      {showRoute && <JourneyRoute places={places} dark={dark} />}
      {places.map(place => <PlaceMarker key={place.id} place={place} selected={place.id === selectedPlaceId} hovered={place.id === hoveredPlaceId} inJourney={showRoute} onSelect={onSelect} onHover={onHover} />)}
    </Map>
    <button className={s.reset} type="button" onClick={resetView} aria-label="Reset map view">↗ <span>Reset view</span></button>
    {!ready && !error && <div className={s.status} role="status">Loading the map…</div>}
    {error && <div className={s.error} role="alert">底图暂时无法完整加载，请检查网络。<button type="button" onClick={() => { setReady(false); setError(false); setRetry(n => n + 1); }}>重新加载</button></div>}
  </div>;
}


