import type { Journey } from '@/types/life/travel-map/journey';

export const journeys: Journey[] = [{
  id: 'northeast-autumn', title: '东北秋日旅行', subtitle: 'An autumn across the northeast',
  startDate: '2026-10-01', endDate: '2026-10-18',
  description: '从城市到森林，从江畔到草原。一路向北，拾起十三个地方的秋天。',
  cover: '/images/life/travel-map/placeholder.jpg', tags: ['Autumn', '示例行程'],
  placeIds: ['beijing', 'shenyang', 'changchun', 'changbaishan', 'yanji', 'harbin', 'mohe', 'genhe', 'mordaga', 'ergun', 'manzhouli', 'hailar', 'arxan'],
}];
