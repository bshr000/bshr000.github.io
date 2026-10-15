import type { Journey } from '@/types/life/travel-map/journey';
import type { Place } from '@/types/life/travel-map/place';
import { journeyPlaces } from '@/lib/life/travel-map/geo';
import JourneyCard from './JourneyCard';
import s from './PlaceSidebar.module.css';
export default function JourneyList({ journeys, places, selectedJourneyId, selectedPlaceId, onJourney, onPlace }: { journeys: Journey[]; places: Place[]; selectedJourneyId: string | null; selectedPlaceId: string | null; onJourney: (id: string) => void; onPlace: (id: string) => void }) {
  return <div className={s.journeys}>{journeys.map(j => <div key={j.id}>
    <JourneyCard journey={j} selected={selectedJourneyId === j.id} onSelect={onJourney} />
    <ol id={`journey-stops-${j.id}`} hidden={selectedJourneyId !== j.id} className={s.stops} aria-label={`${j.title}站点`}>{selectedJourneyId === j.id && journeyPlaces(j, places).map((p, index) => <li key={`${p.id}-${index}`}><button type="button" data-place-id={p.id} aria-pressed={p.id === selectedPlaceId} onClick={() => onPlace(p.id)}><span className={s.stopNumber}>{String(index + 1).padStart(2, '0')}</span><span className={s.stopName}>{p.name}{p.nameEn && <small>{p.nameEn}</small>}</span></button></li>)}</ol>
  </div>)}</div>;
}
