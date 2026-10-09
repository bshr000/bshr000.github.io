import type { StyleSpecification } from 'maplibre-gl';

// A local style avoids sequential remote style, TileJSON, sprite and glyph requests.
// Only basemap image tiles need a network connection. Journey overlays stay vector.
export const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'basemap', type: 'raster', source: 'osm', paint: { 'raster-saturation': -0.55, 'raster-contrast': -0.12 } }],
};

// Remap only raster pixels. Markers, route overlays and controls retain their
// own theme colors, and the unchanged source keeps tiles and camera state.
export function getMapStyle(dark: boolean): StyleSpecification {
  if (!dark) return mapStyle;
  return {
    ...mapStyle,
    layers: [{ id: 'basemap', type: 'raster', source: 'osm', paint: {
      'raster-saturation': -0.9,
      'raster-contrast': 0.1,
      'raster-brightness-min': 0.5,
      'raster-brightness-max': 0.04,
    } }],
  };
}
