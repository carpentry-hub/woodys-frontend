// Comments Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { Comment, NewComment } from '../../models/comment';

export async function listProjectComments(id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/projects/${id}/comments`, { headers });
    if (!res.ok) throw new Error('Error obteniendo comentarios');
    return res.json();
}

export async function commentProject(id: number, data: NewComment) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/projects/${id}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error comentando proyecto');
    return res.json();
}

export async function deleteComment(id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) throw new Error('Error eliminando comentario');
}

export async function getCommentReplies(id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/comments/${id}/replies`, { headers });
    if (!res.ok) throw new Error('Error obteniendo respuestas');
    return res.json();
}

export async function replyToComment(id: number, data: NewComment) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/comments/${id}/reply`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error respondiendo comentario');
    return res.json();
}
