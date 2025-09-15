import { useEffect, useState } from 'react';
import { listAll, getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useProfilePictures() {
    const [pictures, setPictures] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function fetchPictures() {
            setLoading(true);
            setError('');
            try {
                const listRef = ref(storage, 'profile_pictures');
                const res = await listAll(listRef);
                const urls = await Promise.all(
                    res.items.map(itemRef => getDownloadURL(itemRef))
                );
                setPictures(urls);
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
