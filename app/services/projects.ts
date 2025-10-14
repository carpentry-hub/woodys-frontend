
import { API_BASE_URL } from './api-routes';
import { Project } from '@/models/project';

// Objeto para tipar los filtros que podemos enviar al backend
export interface ProjectSearchFilters {
  [key: string]: string;
}

/**
 * Busca proyectos en el backend utilizando un término de búsqueda y filtros.
 */
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

    // NOTA: Tu backend en Go no usa el prefijo /api, así que lo quitamos.
    const res = await fetch(`${API_BASE_URL}/projects/search?${queryString}`);

    if (!res.ok) {
        console.error('[searchProjects] Error del servidor en la búsqueda.');
        throw new Error('No se pudieron buscar los proyectos');
    }

    const projects = await res.json();
    return projects;
}

/**
 * ✅ FUNCIÓN AÑADIDA
 * Busca un único proyecto por su ID.
 * @param id El ID numérico del proyecto.
 * @returns Una promesa que resuelve a un objeto Project.
 */
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
