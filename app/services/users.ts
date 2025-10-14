
import { API_BASE_URL } from './api-routes';
import { User } from '@/models/user';
import { auth } from '@/lib/firebase';
import { getIdTokenHeader } from '../../lib/auth-headers';


export async function getUser(id: number): Promise<User> {
    console.log(`[getUser] Buscando usuario con ID: ${id}`);
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) {
        throw new Error('No se pudo cargar la información del autor');
    }
    return res.json();
}

// --- Otras funciones de tu servicio (protegidas) ---

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

export async function getUserByFirebaseUid(uid: string) {
    const headers = await getIdTokenHeader();
    const res = await fetch(`${API_BASE_URL}/users/uid/${uid}`, { headers });
    if (!res.ok) throw new Error('Usuario no encontrado');
    return res.json();
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
