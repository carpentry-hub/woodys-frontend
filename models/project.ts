export interface Project {
  id: number;
  owner: number;
  title: string;
  average_rating: number;
  rating_count: number;
  materials: string[];
  tools: string[];
  style: string[];
  portrait: string;
  images: string[];
  tutorial: string;
  description: string;
  time_to_build: number;
}
