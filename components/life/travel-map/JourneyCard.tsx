import Image from 'next/image';
import { withBasePath } from '@/lib/site';
import type { Journey } from '@/types/life/travel-map/journey';
import s from './PlaceSidebar.module.css';
export default function JourneyCard({ journey, selected, onSelect }: { journey: Journey; selected: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className={`${s.journeyCard} ${selected ? s.selected : ''}`} onClick={() => onSelect(journey.id)} aria-expanded={selected} aria-controls={`journey-stops-${journey.id}`}>
    {journey.cover && !journey.cover.endsWith("/placeholder.jpg") && <Image src={withBasePath(journey.cover)} alt={`${journey.title}旅行照片`} width={600} height={360} className={s.journeyCover} />}
    <span className={s.journeyMeta}>{journey.startDate?.slice(0, 4) ?? ''} <span>{journey.placeIds.length} 站</span></span>
    <strong>{journey.title}</strong>{journey.subtitle && <span className={s.subtitle}>{journey.subtitle}</span>}
    {journey.description && <span className={s.journeyDescription}>{journey.description}</span>}
    <span className={s.routeAction}>{selected ? '收起路线' : '展开路线'} <span aria-hidden="true">{selected ? '↑' : '↓'}</span></span>
  </button>;
}
