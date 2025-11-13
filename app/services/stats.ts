import { API_BASE_URL } from './api-routes';

export interface SiteStats {
  projects_count: number;
  users_count: number;
  total_ratings: number;
  average_rating: number;
}

export async function getSiteStats(): Promise<SiteStats> {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) {
        throw new Error('Error al obtener las estadísticas del sitio');
    }
    return res.json();
}