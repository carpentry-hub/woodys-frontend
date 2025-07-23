// Projects Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { Project } from '../../models/project';

export async function createProject(data: Project) {
  const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creando proyecto');
  return res.json();
}

export async function getProject(id: number) {
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, { headers });
  if (!res.ok) throw new Error('Proyecto no encontrado');
  return res.json();
}

export async function updateProject(id: number, data: Project) {
  const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
  const res = await fetch(`${API_BASE_URL}/projects/${id}` , {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando proyecto');
  return res.json();
}

export async function deleteProject(id: number) {
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Error eliminando proyecto');
}

export async function searchProjects(params: Record<string, string | number>) {
  const query = new URLSearchParams(params as any).toString();
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/projects/search?${query}`, { headers });
  if (!res.ok) throw new Error('Error buscando proyectos');
  return res.json();
}
