import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useFileUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (file: File, path: string): Promise<string> => {
        setError(null);
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const uploadMultipleFiles = async (files: File[], basePath: string): Promise<string[]> => {
        setUploading(true);
        setError(null);
    
        try {
            const uploadPromises = files.map((file, index) => {
                const fileName = `${Date.now()}_${index}_${file.name}`;
                const filePath = `${basePath}/${fileName}`;
                return uploadFile(file, filePath);
            });
      
            const urls = await Promise.all(uploadPromises);
            return urls;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploadMultipleFiles, uploading, error };
}
