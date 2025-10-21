// Ratings Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { Rating } from '../../models/rating';

export async function rateProject(id: number, data: Rating) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/projects/${id}/ratings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error calificando proyecto');
    return res.json();
}

export async function updateRating(id: number, data: Partial<Rating>) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/ratings/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error actualizando calificación');
    return res.json();
}

export async function getProjectRatings(id: number): Promise<Rating[]> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/ratings`);
    if (!res.ok) throw new Error('Error obteniendo calificaciones del proyecto');
    return res.json();
}
