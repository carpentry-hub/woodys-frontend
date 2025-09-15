// ProjectLists Services

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { ProjectList } from '../../models/project-list';

export async function createProjectList(data: ProjectList) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/project-lists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creando lista de proyectos');
    return res.json();
}

export async function getProjectList(id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/project-lists/${id}`, { headers });
    if (!res.ok) throw new Error('Lista de proyectos no encontrada');
    return res.json();
}

export async function updateProjectList(id: number, data: ProjectList) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/project-lists/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error actualizando lista de proyectos');
    return res.json();
}

export async function deleteProjectList(id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/project-lists/${id}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) throw new Error('Error eliminando lista de proyectos');
}

export async function addProjectToList(id: number, project_id: number) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/project-lists/${id}/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ project_id }),
    });
    if (!res.ok) throw new Error('Error añadiendo proyecto a la lista');
    return res.json();
}

export async function removeProjectFromList(list_id: number, project_id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/project-lists/${list_id}/projects/${project_id}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) throw new Error('Error eliminando proyecto de la lista');
}
