export interface Journey {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  cover?: string;
  placeIds: string[];
  tags?: string[];
}
