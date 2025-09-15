import { API_BASE_URL } from './api-routes';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { Project } from '../../models/project';

export async function createProject(data: Omit<Project, 'id' | 'average_rating' | 'rating_count'>) {
    console.log('[createProject] Iniciando creación de proyecto con los siguientes datos:', data);
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };

    try {
        const res = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        console.log('[createProject] Respuesta del servidor:', res.status, res.statusText);

        if (!res.ok) {
            const errorBody = await res.text();
            console.error('[createProject] Error del servidor:', errorBody);
            throw new Error('Error del servidor al crear el proyecto');
        }

        const newProject = await res.json();
        console.log('[createProject] Proyecto creado exitosamente en la BD:', newProject);
        return newProject;
    } catch (error) {
        console.error('[createProject] Falló la llamada fetch:', error);
        throw error;
    }
}

export async function getProject(id: number) {
    console.log(`[getProject] Buscando proyecto con ID: ${id}`);
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, { headers });

    if (!res.ok) {
        console.error(`[getProject] Proyecto con ID ${id} no encontrado.`);
        throw new Error('Proyecto no encontrado');
    }

    const project = await res.json();
    console.log(`[getProject] Proyecto encontrado:`, project);
    return project;
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

// TODO: Revisar despues