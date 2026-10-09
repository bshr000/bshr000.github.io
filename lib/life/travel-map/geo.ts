import type { Place } from '@/types/life/travel-map/place';
import type { Journey } from '@/types/life/travel-map/journey';
import type { Feature, LineString } from 'geojson';

export function journeyPlaces(journey: Journey, places: Place[]): Place[] {
  const index = new Map(places.map((place) => [place.id, place]));
  return journey.placeIds.map((id) => {
    const place = index.get(id);
    if (!place) throw new Error(`Journey "${journey.id}" references missing place "${id}"`);
    return place;
  });
}

export function getBounds(places: Place[]): [[number, number], [number, number]] | undefined {
  if (!places.length) return undefined;
  return [
    [Math.min(...places.map(p => p.longitude)), Math.min(...places.map(p => p.latitude))],
    [Math.max(...places.map(p => p.longitude)), Math.max(...places.map(p => p.latitude))],
  ];
}

export function routeFeature(places: Place[]): Feature<LineString> {
  return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: places.map(p => [p.longitude, p.latitude]) } };
}
