'use client';
import 'maplibre-gl/dist/maplibre-gl.css';
import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import { places } from '@/lib/life/travel-map/data/places';
import { journeys } from '@/lib/life/travel-map/data/journeys';
import { journeyPlaces } from '@/lib/life/travel-map/geo';
import PlacesHeader, { type Mode } from './PlacesHeader';
import PlaceSidebar from './PlaceSidebar';
import PlaceDetail from './PlaceDetail';
import s from './Places.module.css';
const PlacesMap = dynamic(() => import('./PlacesMap'), { ssr: false, loading: () => <div className={s.mapLoading} role="status">Opening your atlas…</div> });
export default function PlacesPage() {
  const [mode, setMode] = useState<Mode>('cities');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [viewRequest, setViewRequest] = useState(0);
  const mapArea = useRef<HTMLElement>(null);
  const selectedPlace = places.find(p => p.id === selectedPlaceId);
  const selectedJourney = journeys.find(j => j.id === selectedJourneyId);
  const visiblePlaces = useMemo(() => mode === 'journeys' && selectedJourney ? journeyPlaces(selectedJourney, places) : places, [mode, selectedJourney]);
  function selectPlace(id: string) {
    setSelectedPlaceId(id);
    setViewRequest(n => n + 1);
    if (window.innerWidth < 768) mapArea.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function selectJourney(id: string) { setMode('journeys'); setSelectedJourneyId(id); setSelectedPlaceId(null); setHoveredPlaceId(null); setViewRequest(n => n + 1); }
  function changeMode(next: Mode) { setMode(next); setSelectedPlaceId(null); setHoveredPlaceId(null); setViewRequest(n => n + 1); }
  function closePlace() {
    const previousId = selectedPlaceId;
    setSelectedPlaceId(null);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`button[data-place-id="${previousId}"]`)?.focus({ preventScroll: true });
    });
  }
  return <div className={s.page}>
    <PlacesHeader count={places.length} journeyCount={journeys.length} mode={mode} onMode={changeMode} />
    <div className={s.workspace}>
      <section ref={mapArea} className={s.mapArea} aria-label="Travel map">
        <PlacesMap places={visiblePlaces} selectedPlaceId={selectedPlaceId} hoveredPlaceId={hoveredPlaceId} onSelect={selectPlace} onHover={setHoveredPlaceId} showRoute={mode === 'journeys' && !!selectedJourney} viewRequest={viewRequest} />
        <div className={s.mapCaption}><span className={s.liveDot} />{mode === 'journeys' && selectedJourney ? selectedJourney.title : 'Northeast China'}<span className={s.captionDivider}>/</span>{visiblePlaces.length} places</div>
      </section>
      <div className={s.sidebarColumn} data-detail={Boolean(selectedPlace)}>
        {selectedPlace ? <PlaceDetail place={selectedPlace} journeys={journeys.filter(j => j.placeIds.includes(selectedPlace.id))} onJourney={selectJourney} onClose={closePlace} /> :
        <PlaceSidebar places={visiblePlaces} journeys={journeys} mode={mode} selectedPlaceId={selectedPlaceId} hoveredPlaceId={hoveredPlaceId} selectedJourneyId={selectedJourneyId} onSelect={selectPlace} onHover={setHoveredPlaceId} onJourney={selectJourney} />}
      </div>
    </div>
  </div>;
}
