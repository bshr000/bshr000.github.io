import { Marker } from 'react-map-gl/maplibre';
import type { Place } from '@/types/life/travel-map/place';
import s from './PlacesMap.module.css';
export default function PlaceMarker({ place, selected, hovered, inJourney, onSelect, onHover }: { place: Place; selected: boolean; hovered: boolean; inJourney: boolean; onSelect: (id: string) => void; onHover: (id: string | null) => void }) {
  return <Marker longitude={place.longitude} latitude={place.latitude} anchor="center" style={{ zIndex: selected ? 3 : hovered ? 2 : 1 }}>
    <button type="button" className={[s.marker, selected ? s.selected : '', hovered ? s.hovered : '', inJourney ? s.inJourney : ''].join(' ')} aria-label={'在地图上选择' + place.name} aria-pressed={selected} onClick={() => onSelect(place.id)} onMouseEnter={() => onHover(place.id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(place.id)} onBlur={() => onHover(null)}>
      <span className={s.dot} />{(selected || hovered) && <span className={s.markerLabel}>{place.name}</span>}
    </button>
  </Marker>;
}