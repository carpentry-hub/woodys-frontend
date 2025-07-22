// Users Services
import { User } from '../../models/user';
import { Project } from '../../models/project';
import { ProjectList } from '../../models/project-list';

export async function getUser(id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/users/${id}`);
  if (!res.ok) throw new Error('Usuario no encontrado');
  return res.json();
}

export async function getUserProjects(id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/users/${id}/projects`);
  if (!res.ok) throw new Error('Error obteniendo proyectos del usuario');
  return res.json();
}

export async function getUserProjectLists(id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/users/${id}/project-lists`);
  if (!res.ok) throw new Error('Error obteniendo listas públicas del usuario');
  return res.json();
}
