import Image from 'next/image';
import { withBasePath } from '@/lib/site';
import type { Journey } from '@/types/life/travel-map/journey';
import s from './PlaceSidebar.module.css';
export default function JourneyCard({ journey, selected, onSelect }: { journey: Journey; selected: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className={`${s.journeyCard} ${selected ? s.selected : ''}`} onClick={() => onSelect(journey.id)} aria-pressed={selected}>
    <Image src={withBasePath(journey.cover || '/images/life/travel-map/placeholder.jpg')} alt="旅行风景占位图" width={600} height={360} className={s.journeyCover} />
    <span className={s.journeyMeta}>{journey.startDate.slice(0, 4)} <span>{journey.placeIds.length} Stops</span></span>
    <strong>{journey.title}</strong><span className={s.subtitle}>{journey.subtitle}</span>
    <span className={s.journeyDescription}>{journey.description}</span>
    <span className={s.routeAction}>{selected ? '路线已展开' : 'Explore this journey'} <span>↗</span></span>
  </button>;
}
