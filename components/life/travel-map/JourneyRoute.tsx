import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { Place } from '@/types/life/travel-map/place';
import type { Journey } from '@/types/life/travel-map/journey';
import { routeFeature } from '@/lib/life/travel-map/geo';
export default function JourneyRoute({ places, journey, dark, dimmed }: { places: Place[]; journey: Journey; dark: boolean; dimmed: boolean }) {
  const data = useMemo(() => routeFeature(places), [places]);
  if (places.length < 2) return null;
  return <Source id={`route-${journey.id}`} type="geojson" data={data}>
    <Layer id={`line-${journey.id}`} type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': dark ? journey.darkColor : journey.color, 'line-width': dimmed ? 2 : 3, 'line-opacity': dimmed ? 0.22 : 0.85, ...(journey.status === 'wishlist' ? { 'line-dasharray': [2, 2] } : {}) }} />
  </Source>;
}
