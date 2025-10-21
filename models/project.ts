

// Esta interfaz ahora es un reflejo fiel del struct de Go del backend.
export interface Project {
  id: number;
  owner: number;
  title: string;
  description: string;
  portrait: string; // ✅ Esta es la imagen de portada que usaremos
  images: string[];
  materials: string[];
  tools: string[];
  style: string[]; // Es un array de strings
  time_to_build: number; // En minutos o horas, como un número
  is_public: boolean;
  tutorial: string;
  average_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}
