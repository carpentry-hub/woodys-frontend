// Ratings Services
import { Rating } from '../../models/rating';

export async function rateProject(id: number, data: Rating) {
  const res = await fetch(`https://api.carpinteria.com/v1/projects/${id}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error calificando proyecto');
  return res.json();
}

export async function updateRating(id: number, data: Rating) {
  const res = await fetch(`https://api.carpinteria.com/v1/projects/${id}/ratings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando calificación');
  return res.json();
}
