import s from './Places.module.css';
import Link from 'next/link';
export type Mode = 'cities' | 'journeys';
export default function PlacesHeader({ count, journeyCount, mode, onMode }: { count: number; journeyCount: number; mode: Mode; onMode: (mode: Mode) => void }) {
  return <header className={s.header}>
    <Link href="/life/" className={s.backLink}>← Life</Link>
    <div className={s.heading}><h1>Places I&apos;ve Been<span>.</span></h1><p>A map of places, journeys, and memories.</p></div>
    <div className={s.headerBottom}>
      <div className={s.tabs} role="group" aria-label="Map mode">
        <button type="button" aria-pressed={mode === 'cities'} onClick={() => onMode('cities')} className={mode === 'cities' ? s.activeTab : ''}>Cities <span>{count}</span></button>
        <button type="button" aria-pressed={mode === 'journeys'} onClick={() => onMode('journeys')} className={mode === 'journeys' ? s.activeTab : ''}>Journeys <span>{journeyCount}</span></button>
      </div>
      <div className={s.stats}><strong>{count}</strong> Places <span>·</span> <strong>{journeyCount}</strong> Journey</div>
    </div>
  </header>;
}
