import { useEffect, useRef } from 'react';
import type { Place } from '@/types/life/travel-map/place';
import type { Journey } from '@/types/life/travel-map/journey';
import type { Mode } from './PlacesHeader';
import PlaceCard from './PlaceCard';
import JourneyList from './JourneyList';
import s from './PlaceSidebar.module.css';

export default function PlaceSidebar({ places, journeys, mode, selectedPlaceId, hoveredPlaceId, selectedJourneyId, onSelect, onHover, onJourney }: { places: Place[]; journeys: Journey[]; mode: Mode; selectedPlaceId: string | null; hoveredPlaceId: string | null; selectedJourneyId: string | null; onSelect: (id: string) => void; onHover: (id: string | null) => void; onJourney: (id: string) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list || !selectedPlaceId || window.innerWidth < 768) return;
    const card = Array.from(list.querySelectorAll<HTMLElement>('[data-place-id]')).find(el => el.dataset.placeId === selectedPlaceId);
    if (card) {
      const top = card.getBoundingClientRect().top - list.getBoundingClientRect().top;
      if (top < 0 || top + card.offsetHeight > list.clientHeight) list.scrollTo({ top: list.scrollTop + top - list.clientHeight / 2 + card.offsetHeight / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, [selectedPlaceId, mode]);
  return <aside className={s.sidebar} aria-label={mode === 'cities' ? 'Places' : 'Journeys'}>
    <div className={s.listHeading}><h2>{mode === 'cities' ? '地点' : '行程'}</h2><span>{mode === 'cities' ? `${places.length} 个地点` : `${journeys.length} 条行程`}</span></div>
    <div className={s.list} ref={listRef}>
      {mode === 'cities' ? places.map((place, index) => <PlaceCard key={place.id} place={place} index={index} selected={selectedPlaceId === place.id} hovered={hoveredPlaceId === place.id} onSelect={onSelect} onHover={onHover} />) : <JourneyList journeys={journeys} places={places} selectedJourneyId={selectedJourneyId} selectedPlaceId={selectedPlaceId} onJourney={onJourney} onPlace={onSelect} />}
    </div>
    <div className={s.footer}>Little places. Lasting memories.</div>
  </aside>;
}
