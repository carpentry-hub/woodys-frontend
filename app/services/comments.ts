// Comments Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { Comment, CommentLike, CommentLikeCounts, NewComment } from '../../models/comment';

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

export async function createCommentLike(commentId: number, userId: number, value: 'like' | 'dislike') {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}/likes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: userId, value }),
    });
    if (!res.ok) throw new Error('Error valorando comentario');
    return res.json();
}

export async function getCommentLikes(commentId: number): Promise<CommentLikeCounts> {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}/likes`, { headers });
    if (!res.ok) throw new Error('Error obteniendo valoraciones del comentario');
    return res.json();
}

export async function getUserCommentLike(commentId: number, userId: number): Promise<CommentLike | null> {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}/likes/${userId}`, { headers });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Error obteniendo tu valoración del comentario');
    return res.json();
}

export async function updateCommentLike(likeId: number, value: 'like' | 'dislike') {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/comment-likes/${likeId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Error actualizando valoración');
    return res.json();
}

export async function deleteCommentLike(likeId: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/comment-likes/${likeId}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) throw new Error('Error eliminando valoración');
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
