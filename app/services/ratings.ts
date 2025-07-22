// Ratings Services

import { API_BASE_URL } from './api-routes';
import { Rating } from '../../models/rating';

export async function rateProject(id: number, data: Rating) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error calificando proyecto');
  return res.json();
}

export async function updateRating(id: number, data: Rating) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}/ratings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando calificación');
  return res.json();
}
