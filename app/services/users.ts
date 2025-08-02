// Users Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { User } from '../../models/user';

// Crear usuario en la base de datos del proyecto (sin contraseña)
export async function createUserInDB(userData: Omit<User, 'password'>) {
  const headers = await getIdTokenHeader();
  console.log('[createUserInDB] Enviando datos del usuario:', userData);

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  console.log('[createUserInDB] Respuesta del servidor:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[createUserInDB] Error al crear usuario:', errorText);
    throw new Error('Error creando usuario en la base de datos');
  }

  const data = await res.json();
  console.log('[createUserInDB] Usuario creado correctamente:', data);
  return data;
}

export async function getUser(id: number) {
  const headers = await getIdTokenHeader();
  console.log(`[getUser] Buscando usuario con ID ${id}`);

  const res = await fetch(`${API_BASE_URL}/users/${id}`, { headers });

  console.log('[getUser] Respuesta del servidor:', res.status);

  if (!res.ok) {
    console.error('[getUser] Usuario no encontrado');
    throw new Error('Usuario no encontrado');
  }

  const data = await res.json();
  console.log('[getUser] Usuario obtenido:', data);
  return data;
}

export async function getUserProjects(id: number) {
  const headers = await getIdTokenHeader();
  console.log(`[getUserProjects] Obteniendo proyectos para usuario ID ${id}`);

  const res = await fetch(`${API_BASE_URL}/users/${id}/projects`, { headers });

  console.log('[getUserProjects] Respuesta del servidor:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[getUserProjects] Error:', errorText);
    throw new Error('Error obteniendo proyectos del usuario');
  }

  const data = await res.json();
  console.log('[getUserProjects] Proyectos obtenidos:', data);
  return data;
}

export async function getUserProjectLists(id: number) {
  const headers = await getIdTokenHeader();
  console.log(`[getUserProjectLists] Obteniendo listas públicas para usuario ID ${id}`);

  const res = await fetch(`${API_BASE_URL}/users/${id}/project-lists`, { headers });

  console.log('[getUserProjectLists] Respuesta del servidor:', res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[getUserProjectLists] Error:', errorText);
    throw new Error('Error obteniendo listas públicas del usuario');
  }

  const data = await res.json();
  console.log('[getUserProjectLists] Listas públicas obtenidas:', data);
  return data;
}
