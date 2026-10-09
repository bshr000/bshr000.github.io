import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { Place } from '@/types/life/travel-map/place';
import { routeFeature } from '@/lib/life/travel-map/geo';
export default function JourneyRoute({ places, dark = false }: { places: Place[]; dark?: boolean }) {
  const data = useMemo(() => routeFeature(places), [places]);
  if (places.length < 2) return null;
  return <Source id="journey-route" type="geojson" data={data}>
    <Layer id="journey-line" type="line" layout={{ 'line-join': 'round', 'line-cap': 'round' }} paint={{ 'line-color': dark ? '#b8d9b8' : '#34453e', 'line-width': 2.5, 'line-opacity': dark ? 0.9 : 0.62, 'line-dasharray': [2, 2] }} />
  </Source>;
}
