import { useState, type CSSProperties } from 'react';
import type { Journey } from '@/types/life/travel-map/journey';
import type { Place } from '@/types/life/travel-map/place';
import { journeyPlaces } from '@/lib/life/travel-map/geo';
import s from './PlaceSidebar.module.css';
export type JourneyFilter = 'all' | 'visited' | 'wishlist';
export const routeStyle = (j: Journey) => ({ '--route-color': j.color, '--route-dark': j.darkColor }) as CSSProperties;
export default function JourneyPanel({ journeys, places, filter, visibleIds, onFilter, onToggle, onAll, onLocate, onPlace, onHover, onPlay }: {
  journeys: Journey[]; places: Place[]; filter: JourneyFilter; visibleIds: string[];
  onFilter: (v: JourneyFilter) => void; onToggle: (id: string) => void; onAll: (show: boolean) => void;
  onPlay: (id: string) => void;
  onLocate: (id: string) => void; onPlace: (id: string) => void; onHover: (id: string | null) => void;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  return <aside className={s.sidebar} aria-label="行程">
    <div className={s.routeFilters} role="group" aria-label="行程状态">{(['all', 'visited', 'wishlist'] as const).map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => onFilter(value)}>{{ all: '全部', visited: '已走过', wishlist: '想去' }[value]}</button>)}</div>
    <div className={s.routeBulk}><span>{journeys.length} 条行程</span><button type="button" disabled={!journeys.length} onClick={() => onAll(true)}>显示全部</button><button type="button" disabled={!journeys.length} onClick={() => onAll(false)}>隐藏全部</button></div>
    <div className={s.list}><div className={s.journeys}>
      {!journeys.length && <p className={s.description}>暂无这类行程，可以在行程文件中添加。</p>}
      {journeys.map(j => <article key={j.id} className={`${s.routeCard} ${visibleIds.includes(j.id) ? s.routeVisible : ''}`} style={routeStyle(j)} onMouseEnter={() => onHover(j.id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(j.id)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onHover(null); }}>
        <h2><span className={s.routeSwatch} data-status={j.status} />{j.title}</h2>
        <p className={s.routeMeta}>{j.status === 'visited' ? '已走过' : '想去'} · {j.placeIds.length} 站{j.startDate && ` · ${j.startDate.slice(0, 4)}`}</p>
        <div className={s.routeActions}>
          <button type="button" aria-pressed={visibleIds.includes(j.id)} onClick={() => onToggle(j.id)}>{visibleIds.includes(j.id) ? '隐藏路线' : '显示路线'}</button>
          <button type="button" onClick={() => onLocate(j.id)}>定位路线</button>
          <button type="button" disabled={!j.placeIds.length} onClick={() => onPlay(j.id)}>跟随 BadMo</button>
          <button type="button" aria-expanded={expanded.includes(j.id)} aria-controls={`stops-${j.id}`} onClick={() => setExpanded(ids => ids.includes(j.id) ? ids.filter(id => id !== j.id) : [...ids, j.id])}>{expanded.includes(j.id) ? '收起站点 ↑' : '展开站点 ↓'}</button>
        </div>
        <ol id={`stops-${j.id}`} hidden={!expanded.includes(j.id)} className={s.stops} aria-label={`${j.title}站点`}>{expanded.includes(j.id) && journeyPlaces(j, places).map((place, index) => <li key={`${place.id}-${index}`}><button type="button" data-place-id={place.id} onClick={() => onPlace(place.id)}><span className={s.stopNumber}>{String(index + 1).padStart(2, '0')}</span><span className={s.stopName}>{place.name}<small>{place.nameEn}</small></span></button></li>)}</ol>
      </article>)}
    </div></div>
    <div className={s.footer}>实线：已走过 · 虚线：想去<br />路线为站点连接示意</div>
  </aside>;
}
