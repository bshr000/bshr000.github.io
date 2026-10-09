import Image from 'next/image';
import { withBasePath } from '@/lib/site';
import type { Place } from '@/types/life/travel-map/place';
import s from './PlaceSidebar.module.css';

export default function PlaceCard({ place, index, selected, hovered, onSelect, onHover }: { place: Place; index: number; selected: boolean; hovered: boolean; onSelect: (id: string) => void; onHover: (id: string | null) => void }) {
  return <button type="button" data-place-id={place.id} className={[s.card, selected ? s.selected : '', hovered ? s.hovered : ''].join(' ')} aria-label={`选择地点 ${place.name}`} aria-pressed={selected} onClick={() => onSelect(place.id)} onMouseEnter={() => onHover(place.id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(place.id)} onBlur={() => onHover(null)}>
    <Image className={s.thumb} src={withBasePath(place.cover || '/images/life/travel-map/placeholder.jpg')} alt="旅行风景占位图" width={60} height={60} />
    <span className={s.cardText}><strong>{place.name}</strong><span>{place.nameEn}</span><small>{place.province} · {place.country}</small></span>
    <span className={s.index}>{selected ? '↗' : String(index + 1).padStart(2, '0')}</span>
  </button>;
}
