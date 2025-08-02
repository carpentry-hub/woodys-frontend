// Users Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { User } from '../../models/user';
import { Project } from '../../models/project';
import { ProjectList } from '../../models/project-list';

// Crear usuario en la base de datos del proyecto (sin contraseña)
export async function createUserInDB(userData: Omit<User, 'password'>) {
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Error creando usuario en la base de datos');
  return res.json();
}

export async function getUser(id: number) {
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/users/${id}`, { headers });
  if (!res.ok) throw new Error('Usuario no encontrado');
  return res.json();
}

export async function getUserProjects(id: number) {
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/users/${id}/projects`, { headers });
  if (!res.ok) throw new Error('Error obteniendo proyectos del usuario');
  return res.json();
}

export async function getUserProjectLists(id: number) {
  const headers = await getIdTokenHeader();
  const res = await fetch(`${API_BASE_URL}/users/${id}/project-lists`, { headers });
  if (!res.ok) throw new Error('Error obteniendo listas públicas del usuario');
  return res.json();
}
