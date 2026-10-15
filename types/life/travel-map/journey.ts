export interface Journey {
  id: string;
  title: string;
  status: "visited" | "wishlist";
  color: string;
  darkColor: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  cover?: string;
  placeIds: string[];
  tags?: string[];
}
