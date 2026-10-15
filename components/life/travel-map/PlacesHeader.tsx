import s from './Places.module.css';
export type Mode = 'cities' | 'journeys';
export default function PlacesHeader({ count, journeyCount, mode, onMode }: { count: number; journeyCount: number; mode: Mode; onMode: (mode: Mode) => void }) {
  return <header className={s.header}>
    <div className={s.heading}><h1>Places I&apos;ve Been<span>.</span></h1><p>A map of places, journeys, and memories.</p></div>
    <div className={s.headerBottom}>
      <div className={s.tabs} role="group" aria-label="地图模式">
        <button type="button" aria-pressed={mode === 'cities'} onClick={() => onMode('cities')} className={mode === 'cities' ? s.activeTab : ''}>地点 <span>{count}</span></button>
        <button type="button" aria-pressed={mode === 'journeys'} onClick={() => onMode('journeys')} className={mode === 'journeys' ? s.activeTab : ''}>行程 <span>{journeyCount}</span></button>
      </div>
      <div className={s.stats}><strong>{count}</strong> 个地点 <span>·</span> <strong>{journeyCount}</strong> 条行程</div>
    </div>
  </header>;
}
