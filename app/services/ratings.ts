// Ratings Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { Rating } from '../../models/rating';

export async function rateProject(id: number, data: Rating) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    // Send only the required fields for creating a new rating
    // Backend expects: value (int8), user_id (int8), project_id (int8)
    // GORM will auto-handle CreatedAt and UpdatedAt timestamps
    const ratingData = {
        value: Math.max(1, Math.min(5, Number(data.value))), // Clamp between 1-5
        user_id: Number(data.user_id),
        project_id: Number(data.project_id)
    };
    
    if (!ratingData.user_id || !ratingData.project_id || !ratingData.value || ratingData.value < 1 || ratingData.value > 5) {
        throw new Error('Invalid rating data');
    }
    
    console.log('Creating rating with data:', ratingData);
    console.log('URL:', `${API_BASE_URL}/projects/${id}/ratings`);
    
    const res = await fetch(`${API_BASE_URL}/projects/${id}/ratings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(ratingData),
    });
    if (!res.ok) {
        // If rating already exists (409), we'll handle it in the calling function
        if (res.status === 409) {
            throw new Error('RATING_EXISTS');
        }
        const errorText = await res.text();
        console.error('Error creating rating:', res.status, errorText);
        console.error('Request data sent:', ratingData);
        console.error('Headers:', headers);
        
        // Provide more specific error message based on status code
        if (res.status === 500) {
            throw new Error('Error del servidor al crear la calificación. Por favor, intenta más tarde o contacta al administrador.');
        } else if (res.status === 400) {
            throw new Error('Datos inválidos para la calificación.');
        } else {
            throw new Error('Error calificando proyecto');
        }
    }
    return res.json();
}

export async function updateRating(projectId: number, ratingId: number, data: Partial<Rating>) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    // Backend PutRating has a bug: it looks for rating by params["id"] (project ID) 
    // but should find by user_id + project_id. We send rating ID in body but backend
    // uses params["id"] to find existing rating first, then updates it.
    // Since backend finds by wrong ID, we need to work around this.
    // The backend expects: id, value, updated_id in the body
    const res = await fetch(`${API_BASE_URL}/projects/${ratingId}/ratings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
            id: ratingId,
            value: data.value,
            updated_id: data.updated_id || new Date().toISOString(),
            project_id: projectId,
            user_id: data.user_id
        }),
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('Error updating rating:', res.status, errorText);
        throw new Error('Error actualizando calificación');
    }
    return res.json();
}

export async function getProjectRatings(id: number): Promise<Rating[]> {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/ratings`);
    if (!res.ok) throw new Error('Error obteniendo calificaciones del proyecto');
    return res.json();
}
