// ProjectLists Services
import { ProjectList } from '../../models/project-list';
import { ProjectListWithItems } from '../../models/project-list-with-items';

export async function createProjectList(data: ProjectList) {
  const res = await fetch('https://api.carpinteria.com/v1/project-lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creando lista de proyectos');
  return res.json();
}

export async function getProjectList(id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/project-lists/${id}`);
  if (!res.ok) throw new Error('Lista de proyectos no encontrada');
  return res.json();
}

export async function updateProjectList(id: number, data: ProjectList) {
  const res = await fetch(`https://api.carpinteria.com/v1/project-lists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando lista de proyectos');
  return res.json();
}

export async function deleteProjectList(id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/project-lists/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error eliminando lista de proyectos');
}

export async function addProjectToList(id: number, project_id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/project-lists/${id}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_id }),
  });
  if (!res.ok) throw new Error('Error añadiendo proyecto a la lista');
  return res.json();
}

export async function removeProjectFromList(list_id: number, project_id: number) {
  const res = await fetch(`https://api.carpinteria.com/v1/project-lists/${list_id}/projects/${project_id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error eliminando proyecto de la lista');
}
