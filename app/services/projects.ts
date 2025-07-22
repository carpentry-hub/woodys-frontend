// Projects Services

import { API_BASE_URL } from './api-routes';
import { Project } from '../../models/project';

export async function createProject(data: Project) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creando proyecto');
  return res.json();
}

export async function getProject(id: number) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`);
  if (!res.ok) throw new Error('Proyecto no encontrado');
  return res.json();
}

export async function updateProject(id: number, data: Project) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}` , {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando proyecto');
  return res.json();
}

export async function deleteProject(id: number) {
  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error eliminando proyecto');
}

export async function searchProjects(params: Record<string, string | number>) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE_URL}/projects/search?${query}`);
  if (!res.ok) throw new Error('Error buscando proyectos');
  return res.json();
}
