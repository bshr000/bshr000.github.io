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
import JourneyPanel, { routeStyle, type JourneyFilter } from './JourneyPanel';
import sidebarStyles from './PlaceSidebar.module.css';
import s from './Places.module.css';
const PlacesMap = dynamic(() => import('./PlacesMap'), { ssr: false, loading: () => <div className={s.mapLoading} role="status">正在打开地图…</div> });
export default function PlacesPage() {
  const [tourId, setTourId] = useState<string | null>(null);
  const [tourRun, setTourRun] = useState(0);
  const tourJourney = journeys.find(j => j.id === tourId) ?? null;
  const [mode, setMode] = useState<Mode>('cities');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<string[]>(() => journeys.filter(j => j.status === 'visited').map(j => j.id));
  const [filter, setFilter] = useState<JourneyFilter>('all');
  const [focusedJourneyId, setFocusedJourneyId] = useState<string | null>(null);
  const [hoveredJourneyId, setHoveredJourneyId] = useState<string | null>(null);
  const [viewRequest, setViewRequest] = useState(0);
  const mapArea = useRef<HTMLElement>(null);
  const selectedPlace = places.find(p => p.id === selectedPlaceId);
  const filteredJourneys = journeys.filter(j => filter === 'all' || j.status === filter);
  const activeRoutes = useMemo(() => mode === 'journeys' ? journeys.filter(j => j.id === tourId || (visibleIds.includes(j.id) && (filter === 'all' || j.status === filter))) : [], [mode, visibleIds, filter, tourId]);
  const visiblePlaces = useMemo(() => {
    if (!activeRoutes.length) return places;
    const routePlaces = activeRoutes.flatMap(j => journeyPlaces(j, places));
    const selected = places.find(p => p.id === selectedPlaceId);
    if (selected) routePlaces.push(selected);
    return Array.from(new Map(routePlaces.map(p => [p.id, p])).values());
  }, [activeRoutes, selectedPlaceId]);
  const focusPlaces = useMemo(() => {
    const j = activeRoutes.find(j => j.id === focusedJourneyId);
    return j ? journeyPlaces(j, places) : null;
  }, [activeRoutes, focusedJourneyId]);
  function clearFocus() { setTourId(null); setFocusedJourneyId(null); setSelectedPlaceId(null); setHoveredPlaceId(null); setHoveredJourneyId(null); setViewRequest(n => n + 1); }
  function startTour(id: string) { clearFocus(); setMode('journeys'); setTourId(id); setTourRun(n => n + 1); mapArea.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }
  function exitTour() { clearFocus(); }
  function changeFilter(value: JourneyFilter) { setFilter(value); clearFocus(); }
  function toggleRoute(id: string) { setVisibleIds(ids => ids.includes(id) ? ids.filter(v => v !== id) : [...ids, id]); clearFocus(); }
  function showAll(show: boolean) { const ids = filteredJourneys.map(j => j.id); setVisibleIds(current => show ? [...new Set([...current, ...ids])] : current.filter(id => !ids.includes(id))); clearFocus(); }
  function selectPlace(id: string) {
    setTourId(null);
    setSelectedPlaceId(id);
    setViewRequest(n => n + 1);
    if (window.innerWidth < 768) mapArea.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function selectJourney(id: string) {
    setMode('journeys');
    const journey = journeys.find(j => j.id === id);
    if (filter !== 'all' && journey?.status !== filter) setFilter('all');
    setVisibleIds(ids => [...new Set([...ids, id])]);
    clearFocus(); setFocusedJourneyId(id);
  }
  function changeMode(next: Mode) { setMode(next); clearFocus(); }
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
      <section ref={mapArea} className={s.mapArea} data-tour={!!tourJourney} aria-label="Travel map">
        <PlacesMap places={visiblePlaces} selectedPlaceId={selectedPlaceId} hoveredPlaceId={hoveredPlaceId} onSelect={selectPlace} onHover={setHoveredPlaceId} routes={activeRoutes} focusPlaces={focusPlaces} hoveredJourneyId={hoveredJourneyId} viewRequest={viewRequest} tourJourney={tourJourney} tourRun={tourRun} onExitTour={exitTour} />
        <div className={s.mapCaption}><span className={s.liveDot} />{activeRoutes.length ? `${activeRoutes.length} 条路线` : '旅行足迹'}<span className={s.captionDivider}>/</span>{new Set(visiblePlaces.map(place => place.id)).size} 个地点</div>
        {!tourJourney && activeRoutes.length > 0 && <details className={s.routeLegend}><summary>路线图例 · {activeRoutes.length}</summary><ul>{activeRoutes.map(j => <li key={j.id} style={routeStyle(j)}><button type="button" onClick={() => selectJourney(j.id)} onMouseEnter={() => setHoveredJourneyId(j.id)} onMouseLeave={() => setHoveredJourneyId(null)}><span className={sidebarStyles.routeSwatch} data-status={j.status} />{j.title} · {j.status === 'visited' ? '已走过' : '想去'}</button></li>)}</ul><p>站点连接示意 · 非实际轨迹</p></details>}
      </section>
      <div className={s.sidebarColumn} data-detail={Boolean(selectedPlace)}>
        {selectedPlace ? <PlaceDetail place={selectedPlace} journeys={journeys.filter(j => j.placeIds.includes(selectedPlace.id))} onJourney={selectJourney} onClose={closePlace} /> :
        mode === 'journeys' ? <JourneyPanel journeys={filteredJourneys} places={places} filter={filter} visibleIds={visibleIds} onFilter={changeFilter} onToggle={toggleRoute} onAll={showAll} onLocate={selectJourney} onPlace={selectPlace} onHover={setHoveredJourneyId} onPlay={startTour} /> : <PlaceSidebar places={places} journeys={journeys} mode={mode} selectedPlaceId={selectedPlaceId} hoveredPlaceId={hoveredPlaceId} selectedJourneyId={null} onSelect={selectPlace} onHover={setHoveredPlaceId} onJourney={selectJourney} />}
      </div>
    </div>
  </div>;
}
