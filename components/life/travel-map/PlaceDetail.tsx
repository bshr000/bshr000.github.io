import type { Place } from '@/types/life/travel-map/place';
import { useEffect, useRef } from 'react';
import type { Journey } from '@/types/life/travel-map/journey';
import s from './PlaceSidebar.module.css';
export default function PlaceDetail({ place, journeys, onJourney, onClose }: { place: Place; journeys: Journey[]; onJourney: (id: string) => void; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeButton.current?.focus({ preventScroll: true }); }, [place.id]);
  return <section className={s.detail} aria-label="Selected place" aria-live="polite">
    <button ref={closeButton} type="button" className={s.close} onClick={onClose} aria-label="关闭地点详情，返回列表">← 返回列表</button>
    <div className={s.detailEyebrow}>A PLACE TO REMEMBER</div>
    <h2>{place.name} <span>{place.nameEn}</span></h2><p className={s.region}>{place.province} · {place.country}</p>
    <p className={s.description}>{place.description}</p>
    {place.firstVisit && <small>{place.firstVisit.slice(0, 4)}</small>}
    {journeys.map(j => <button type="button" className={s.journeyLink} key={j.id} onClick={() => onJourney(j.id)}>{j.startDate.slice(0, 4)} · {j.title} <span>↗</span></button>)}
  </section>;
}
