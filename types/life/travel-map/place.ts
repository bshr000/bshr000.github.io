export interface Place {
  id: string;
  name: string;
  nameEn?: string;
  province?: string;
  country: string;
  latitude: number;
  longitude: number;
  visited: boolean;
  firstVisit?: string;
  lastVisit?: string;
  cover?: string;
  description?: string;
  tags?: string[];
  journeyIds?: string[];
}
