import { useEffect, useMemo, useState } from 'react';
import { Marker, Popup, Source, Layer, useMap } from 'react-map-gl/maplibre';
import type { Journey } from '@/types/life/travel-map/journey';
import type { Place } from '@/types/life/travel-map/place';
import { getBounds, journeyPlaces } from '@/lib/life/travel-map/geo';
import { advanceTour, initialTour, tourPosition } from '@/lib/life/travel-map/tour';
import { withBasePath } from '@/lib/site';
import s from './BadMoTour.module.css';
export default function BadMoTour({ journey, places, dark, onExit }: { journey: Journey; places: Place[]; dark: boolean; onExit: () => void }) {
  const { current: map } = useMap();
  const stops = useMemo(() => journeyPlaces(journey, places), [journey, places]);
  const [state, setState] = useState(initialTour);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [follow, setFollow] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    document.documentElement.dataset.badmoTour = 'true';
    const hide = () => { if (document.hidden) setPaused(true); };
    document.addEventListener('visibilitychange', hide);
    return () => { media.removeEventListener('change', update); document.removeEventListener('visibilitychange', hide); delete document.documentElement.dataset.badmoTour; };
  }, []);
  useEffect(() => {
    if (paused || !stops.length || state.phase === 'done') return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const delta = Math.min(now - last, 100); last = now;
      setState(previous => advanceTour(previous, delta, stops, reduced));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused, stops, reduced, state.phase]);
  useEffect(() => {
    if (!map) return;
    const interact = (event: { originalEvent?: unknown }) => { if (event.originalEvent) setFollow(false); };
    map.on('movestart', interact);
    return () => { map.off('movestart', interact); map.stop(); };
  }, [map]);
  const position = stops.length ? tourPosition(state, stops) : [0, 0];
  const [longitude, latitude] = position;
  useEffect(() => {
    if (!map || !follow || !stops.length) return;
    // Frame each leg once. The pet travels across the viewport instead of
    // repeatedly restarting camera animations at every position update.
    const leg = stops.slice(state.index, state.index + 2);
    const bounds = getBounds(leg);
    if (bounds) map.fitBounds(bounds, { padding: { top: 110, bottom: 210, left: 65, right: 65 }, maxZoom: 7, duration: reduced ? 0 : 900 });
  }, [map, follow, state.index, reduced, stops]);
  if (!stops.length) return null;
  const place = stops[state.index];
  const moving = state.phase === 'move';
  const done = state.phase === 'done';
  const runningFrame = Math.floor(state.elapsed / 110) % 8;
  const runningRow = stops[Math.min(state.index + 1, stops.length - 1)].longitude < place.longitude ? 2 : 1;
  const progress = stops.slice(0, state.index + 1).map(p => [p.longitude, p.latitude]);
  if (moving) progress.push([longitude, latitude]);
  const info = <><strong>{String(state.index + 1).padStart(2, '0')} · {place.name}</strong>{place.nameEn && <small>{place.nameEn}</small>}{place.description && <p>{place.description}</p>}</>;
  const jump = (index: number) => { setState({ index: Math.max(0, Math.min(index, stops.length - 1)), phase: 'stop', elapsed: 0 }); setFollow(true); };
  return <>
    {progress.length > 1 && <Source id="badmo-tour-progress" type="geojson" data={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: progress } }}><Layer id="badmo-tour-progress-line" type="line" paint={{ 'line-color': dark ? journey.darkColor : journey.color, 'line-width': 5, 'line-opacity': 1 }} /></Source>}
    <Marker longitude={longitude} latitude={latitude} anchor="bottom" style={{ zIndex: 6 }}>
      <div className={s.pet} role="img" aria-label="旅行中的 BadMo" data-moving={moving && !paused && !reduced} data-done={done && !reduced} style={{ backgroundImage: `url(${withBasePath('/images/badmo/spritesheet.webp')})`, backgroundPosition: moving && !reduced ? `${runningFrame * 100 / 7}% ${runningRow * 10}%` : undefined }} />
    </Marker>
    {!moving && <Popup longitude={longitude} latitude={latitude} anchor="bottom" offset={85} closeButton={false} closeOnClick={false} focusAfterOpen={false} maxWidth="280px" className={s.popup}><div className={s.info}>{info}</div></Popup>}
    <section className={s.controls} aria-label="BadMo 行程播放器">
      <div className={s.heading}><strong>{journey.title}</strong><span role="status">{done ? '本次旅程结束' : moving ? `前往 ${stops[state.index + 1].name}` : `第 ${state.index + 1} / ${stops.length} 站 · ${place.name}`}</span></div>
      {!moving && <div className={s.mobileInfo}>{info}</div>}
      <div className={s.buttons}>
        <button type="button" disabled={state.index === 0 && !moving} onClick={() => jump(moving ? state.index : state.index - 1)}>上一站</button>
        <button type="button" disabled={done} onClick={() => setPaused(value => !value)}>{paused ? '继续' : '暂停'}</button>
        <button type="button" disabled={state.index === stops.length - 1} onClick={() => jump(state.index + 1)}>下一站</button>
        <button type="button" onClick={() => { jump(0); setPaused(false); }}>重新开始</button>
        {!follow && <button type="button" onClick={() => setFollow(true)}>回到 BadMo</button>}
        <button type="button" onClick={onExit}>退出</button>
      </div>
    </section>
  </>;
}
