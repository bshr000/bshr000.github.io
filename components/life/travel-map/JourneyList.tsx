import type { Journey } from '@/types/life/travel-map/journey';
import type { Place } from '@/types/life/travel-map/place';
import { journeyPlaces } from '@/lib/life/travel-map/geo';
import JourneyCard from './JourneyCard';
import s from './PlaceSidebar.module.css';
export default function JourneyList({ journeys, places, selectedJourneyId, selectedPlaceId, onJourney, onPlace }: { journeys: Journey[]; places: Place[]; selectedJourneyId: string | null; selectedPlaceId: string | null; onJourney: (id: string) => void; onPlace: (id: string) => void }) {
  return <div className={s.journeys}>{journeys.map(j => <div key={j.id}>
    <JourneyCard journey={j} selected={selectedJourneyId === j.id} onSelect={onJourney} />
    {selectedJourneyId === j.id && <ol className={s.stops} aria-label="Journey stops">{journeyPlaces(j, places).map(p => <li key={p.id}><button type="button" data-place-id={p.id} aria-pressed={p.id === selectedPlaceId} onClick={() => onPlace(p.id)}>{p.name}<span>{p.nameEn}</span></button></li>)}</ol>}
  </div>)}</div>;
}
