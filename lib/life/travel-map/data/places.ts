import type { Place } from '@/types/life/travel-map/place';

// WGS84 [longitude, latitude]. City/town centres; Changbaishan uses Tianchi.
// Rounded reference locations, not addresses or navigation destinations.
export const places: Place[] = [
  { id: 'beijing', name: '北京', nameEn: 'Beijing', province: 'Beijing', longitude: 116.3972, latitude: 39.9097, description: '从胡同的晨光出发，向北方走去。' },
  { id: 'shenyang', name: '沈阳', nameEn: 'Shenyang', province: 'Liaoning', longitude: 123.4315, latitude: 41.8057, description: '红墙、老街，还有一碗热气腾腾的日常。' },
  { id: 'changchun', name: '长春', nameEn: 'Changchun', province: 'Jilin', longitude: 125.3235, latitude: 43.8171, description: '沿着宽阔的街道，慢慢走进北国秋天。' },
  { id: 'changbaishan', name: '长白山', nameEn: 'Changbai Mountain', province: 'Jilin', longitude: 128.057, latitude: 42.006, description: '云雾散去，天池留下一片安静的蓝。' },
  { id: 'yanji', name: '延吉', nameEn: 'Yanji', province: 'Jilin', longitude: 129.5089, latitude: 42.8913, description: '双语街牌下，收藏一座小城的烟火气。' },
  { id: 'harbin', name: '哈尔滨', nameEn: 'Harbin', province: 'Heilongjiang', longitude: 126.6424, latitude: 45.756, description: '松花江的晚风，和中央大街渐亮的灯。' },
  { id: 'mohe', name: '漠河', nameEn: 'Mohe', province: 'Heilongjiang', longitude: 122.5375, latitude: 52.9721, description: '一路向北，在边陲小城等待漫长的星夜。' },
  { id: 'genhe', name: '根河', nameEn: 'Genhe', province: 'Inner Mongolia', longitude: 121.5167, latitude: 50.7833, description: '穿过白桦林，听见大兴安岭的呼吸。' },
  { id: 'mordaga', name: '莫尔道嘎', nameEn: 'Mordaga', province: 'Inner Mongolia', longitude: 120.7833, latitude: 51.2833, description: '林间小镇被金黄包围，时间也慢了下来。' },
  { id: 'ergun', name: '额尔古纳', nameEn: 'Ergun', province: 'Inner Mongolia', longitude: 120.1808, latitude: 50.2431, description: '河流在湿地上转弯，秋色一直铺到天边。' },
  { id: 'manzhouli', name: '满洲里', nameEn: 'Manzhouli', province: 'Inner Mongolia', longitude: 117.4535, latitude: 49.5881, description: '草原尽头的边城，亮起异域风情的夜色。' },
  { id: 'hailar', name: '海拉尔', nameEn: 'Hailar', province: 'Inner Mongolia', longitude: 119.7357, latitude: 49.2122, description: '在呼伦贝尔的风里，留下一次辽阔的停靠。' },
  { id: 'arxan', name: '阿尔山', nameEn: 'Arxan', province: 'Inner Mongolia', longitude: 119.9431, latitude: 47.177, description: '森林、温泉与小火车站，为旅途收一个尾。' },
].map((place) => ({ country: 'China', visited: true, cover: '/images/life/travel-map/placeholder.jpg', ...place }));

