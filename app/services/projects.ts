import { getIdTokenHeader } from '@/lib/auth-headers';
import { API_BASE_URL } from './api-routes';
import { Project } from '@/models/project';

export interface ProjectSearchFilters {
  [key: string]: string;
}

export async function searchProjects(searchTerm: string, filters: ProjectSearchFilters): Promise<Project[]> {
    const params = new URLSearchParams();
    if (searchTerm) {
        params.append('q', searchTerm);
    }
    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });
    const queryString = params.toString();

    const res = await fetch(`${API_BASE_URL}/projects/search?${queryString}`);

    if (!res.ok) {
        console.error('[searchProjects] Error del servidor en la búsqueda.');
        throw new Error('No se pudieron buscar los proyectos');
    }

    const projects = await res.json();
    return projects;
}

export async function getProject(id: number): Promise<Project> {
    console.log(`[getProject] Buscando proyecto con ID: ${id}`);
    const res = await fetch(`${API_BASE_URL}/projects/${id}`);

    if (!res.ok) {
        console.error(`[getProject] Proyecto con ID ${id} no encontrado.`);
        throw new Error('Proyecto no encontrado');
    }

    const project = await res.json();
    console.log('[getProject] Datos del proyecto recibidos:', project);
    return project;
}

export async function createProject(data: Omit<Project, 'id' | 'average_rating' | 'rating_count' | 'created_at' | 'updated_at'>) {
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

/**
 * Actualiza un proyecto existente.
 * Tu backend espera el objeto de proyecto COMPLETO, incluyendo el ID.
 * @param id El ID del proyecto a actualizar.
 * @param data El objeto de proyecto COMPLETO con los campos actualizados.
 */
export async function updateProject(id: number, data: Project): Promise<Project> {
    console.log(`[updateProject] Actualizando proyecto con ID: ${id}`, data);
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    
    try {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        console.log('[updateProject] Respuesta del servidor:', res.status, res.statusText);
        if (!res.ok) {
            const errorBody = await res.text();
            console.error('[updateProject] Error del servidor:', errorBody);
            throw new Error('Error del servidor al actualizar el proyecto');
        }
        const updatedProject = await res.json();
        console.log('[updateProject] Proyecto actualizado exitosamente:', updatedProject);
        return updatedProject;
    } catch (error) {
        console.error('[updateProject] Falló la llamada fetch:', error);
        throw error;
    }
}

/**
 * Elimina un proyecto por su ID.
 * @param id El ID del proyecto a eliminar.
 */
export async function deleteProject(id: number): Promise<void> {
    console.log(`[deleteProject] Eliminando proyecto con ID: ${id}`);
    const headers = await getIdTokenHeader();

    try {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers,
        });

        console.log('[deleteProject] Respuesta del servidor:', res.status, res.statusText);
        if (!res.ok) {
            const errorBody = await res.text();
            console.error('[deleteProject] Error del servidor:', errorBody);
            throw new Error('Error del servidor al eliminar el proyecto');
        }
        console.log('[deleteProject] Proyecto eliminado exitosamente.');
        return; 
    } catch (error) {
        console.error('[deleteProject] Falló la llamada fetch:', error);
        throw error;
    }
}