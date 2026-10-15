import type { Journey } from '@/types/life/travel-map/journey';

// Dates are optional: add startDate/endDate as YYYY-MM-DD when known.
// placeIds preserves visit order, including return visits.
export const journeys: Journey[] = [
  {
    "id": "yunnan-south-central",
    "status": "visited",
    "color": "#B87345",
    "darkColor": "#E8A578",
    "title": "云南-南中线",
    "placeIds": [
      "kunming",
      "dali",
      "lijiang",
      "shangri-la",
      "yubeng",
      "kunming",
      "changsha",
      "nanchang",
      "wugongshan",
      "lushan",
      "sanqingshan",
      "yandangshan"
    ]
  },
  {
    "id": "northeast",
    "status": "visited",
    "color": "#527664",
    "darkColor": "#91BFA5",
    "title": "东北",
    "placeIds": [
      "shenyang",
      "jilin-city",
      "changbaishan",
      "yanji",
      "harbin",
      "mohe",
      "mangui",
      "shiwei",
      "enhe",
      "heishantou",
      "manzhouli",
      "arxan",
      "hailar"
    ]
  },
  {
    "id": "japan",
    "status": "visited",
    "color": "#5268A6",
    "darkColor": "#9AADE8",
    "title": "日本",
    "placeIds": [
      "osaka",
      "tokyo",
      "fukuoka"
    ]
  },
  {
    "id": "five-sacred-mountains",
    "status": "visited",
    "color": "#87629C",
    "darkColor": "#C7A1DE",
    "title": "五岳",
    "placeIds": [
      "hengshan-shanxi",
      "huashan",
      "songshan",
      "hengshan-hunan",
      "taishan"
    ]
  }
];
