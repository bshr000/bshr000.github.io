import type { Place } from '@/types/life/travel-map/place';
export interface TourState { index: number; phase: 'stop' | 'move' | 'done'; elapsed: number }
export const travelDuration = 4500;
export const initialTour: TourState = { index: 0, phase: 'stop', elapsed: 0 };
export const stopDuration = (place: Place) => Math.min(15000, Math.max(4000, (place.description?.length ?? 0) * 180));
export function advanceTour(state: TourState, delta: number, stops: Place[], reduced: boolean): TourState {
  if (!stops.length || state.phase === 'done') return state;
  const elapsed = state.elapsed + delta;
  if (state.phase === 'stop') {
    if (elapsed < stopDuration(stops[state.index])) return { ...state, elapsed };
    if (state.index === stops.length - 1) return { ...state, phase: 'done', elapsed: 0 };
    return reduced ? { index: state.index + 1, phase: 'stop', elapsed: 0 } : { ...state, phase: 'move', elapsed: 0 };
  }
  return elapsed >= travelDuration ? { index: Math.min(state.index + 1, stops.length - 1), phase: 'stop', elapsed: 0 } : { ...state, elapsed };
}
export function tourPosition(state: TourState, stops: Place[]): [number, number] {
  const from = stops[state.index];
  const to = stops[Math.min(state.index + 1, stops.length - 1)];
  const progress = state.phase === 'move' ? Math.min(1, state.elapsed / travelDuration) : 0;
  const t = progress * progress * (3 - 2 * progress);
  // Interpolate in Web Mercator so the pet follows the rendered straight segment.
  const y = (lat: number) => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const lat = (Math.atan(Math.exp(y(from.latitude) + (y(to.latitude) - y(from.latitude)) * t)) * 2 - Math.PI / 2) * 180 / Math.PI;
  return [from.longitude + (to.longitude - from.longitude) * t, lat];
}
