export interface Project {
  id: number;
  owner: number;
  title: string;
  description: string;
  portrait: string;
  images: string[];
  materials: string[];
  tools: string[];
  style: string[];
  time_to_build: number;
  is_public: boolean;
  tutorial: string;
  average_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  height: number;
  length: number;
  width: number;
  main_material: string;
  environment: string | string[];
}