import { API_BASE_URL } from './api-routes';
import { User } from '@/models/user';
import { auth } from '@/lib/firebase';
import { getIdTokenHeader } from '../../lib/auth-headers';
import { ProfilePicture } from '@/models/profile-picture';

export async function getUser(id: number): Promise<User> {
    console.log(`[getUser] Buscando usuario con ID: ${id}`);
    const headers = await getIdTokenHeader(); 
    const res = await fetch(`${API_BASE_URL}/users/${id}`, { headers });
    if (!res.ok) {
        throw new Error('No se pudo cargar la información del autor');
    }
    return res.json();
}

export async function createUserInDB(userData: Omit<User, 'password'>) {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Error creando usuario en la base de datos');
    return res.json();
}

export async function getUserProjects(id: number) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/users/${id}/projects`, { headers });
    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error('Error obteniendo proyectos del usuario');
    }
    return res.json();
}

export async function getUserByFirebaseUid(uid: string): Promise<User> {
    const headers = await getIdTokenHeader();
    
    const resId = await fetch(`${API_BASE_URL}/users/uid/${uid}`, { headers });
    if (!resId.ok) {
        if (resId.status === 404) {
            throw new Error('Usuario no encontrado');
        }
        throw new Error('Error obteniendo ID de usuario desde UID');
    }

    const partialUser: { id: number } = await resId.json();

    if (!partialUser || typeof partialUser.id !== 'number') {
        throw new Error('Respuesta de UID inválida, no se encontró ID');
    }

    return await getUser(partialUser.id);
}

export const getCurrentUserId = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');
    return user.uid;
};

export const getCurrentUserFromDB = async () => {
    const firebaseUid = await getCurrentUserId();
    return await getUserByFirebaseUid(firebaseUid);
};

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
    const headers = { 'Content-Type': 'application/json', ...(await getIdTokenHeader()) };
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error actualizando usuario');
    return res.json();
}

export async function getProfilePictures(): Promise<ProfilePicture[]> {
    const res = await fetch(`${API_BASE_URL}/profile-pictures`);
    if (!res.ok) throw new Error('Error obteniendo imágenes de perfil');
    return res.json();
}

export async function getUserProfilePictureUrl(profilePictureId: number): Promise<string | null> {
    const headers = await getIdTokenHeader(); 
    const res = await fetch(`${API_BASE_URL}/profile-picture/${profilePictureId}`, { headers });

    if (!res.ok) {
        if (res.status === 404 || res.status === 204) {
            return null;
        }
        throw new Error(`Error obteniendo la URL de la imagen de perfil: ${res.statusText}`);
    }

    const url = await res.text();
    return url || null;
}