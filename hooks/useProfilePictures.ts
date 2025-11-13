import { useEffect, useState } from 'react';
import { getProfilePictures } from '@/app/services/users';
import { ProfilePicture } from '@/models/profile-picture';

export function useProfilePictures() {
    const [pictures, setPictures] = useState<ProfilePicture[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function fetchPictures() {
            setLoading(true);
            setError('');
            try {
                const pics = await getProfilePictures();
                setPictures(pics);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || 'Error al cargar imágenes');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchPictures();
    }, []);

    return { pictures, loading, error };
}