// En: app/services/project-lists.ts

import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { ProjectList } from '../../models/project-list';
import { Project } from '@/models/project';

export async function createProjectList(data: Partial<ProjectList>) {
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

export async function updateProjectList(id: number, data: Partial<ProjectList>) {
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

export async function addProjectToList(listId: number, projectId: number) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/project-lists/${listId}/projects`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ project_id: projectId, project_list_id: listId }),
    });
    if (!res.ok) {
        if (res.status === 409) {
            throw new Error('DUPLICATE: El proyecto ya está en esta lista.');
        }
        throw new Error('Error añadiendo proyecto a la lista');
    }
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

export async function getUsersProjectLists(userId: number): Promise<ProjectList[]> {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/users/${userId}/project-lists`, { headers });
    if (!res.ok) throw new Error('Error obteniendo las listas del usuario');
    return res.json();
}

export async function getProjectsInList(listId: number): Promise<Project[]> {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/project-lists/${listId}/projects`, { headers });
    if (!res.ok) throw new Error('Error obteniendo los proyectos de la lista');
    return res.json();
}