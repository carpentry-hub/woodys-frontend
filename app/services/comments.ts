// Comments Services

import { API_BASE_URL } from './api-routes';
import { Comment } from '../../models/comment';

export async function listProjectComments(id: number) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}/comments`);
  if (!res.ok) throw new Error('Error obteniendo comentarios');
  return res.json();
}

export async function commentProject(id: number, data: Partial<Comment>) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error comentando proyecto');
  return res.json();
}

export async function deleteComment(id: number) {
  const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error eliminando comentario');
}

export async function getCommentReplies(id: number) {
  const res = await fetch(`${API_BASE_URL}/comments/${id}/replies`);
  if (!res.ok) throw new Error('Error obteniendo respuestas');
  return res.json();
}

export async function replyToComment(id: number, data: Partial<Comment>) {
  const res = await fetch(`${API_BASE_URL}/comments/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error respondiendo comentario');
  return res.json();
}
