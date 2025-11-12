'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserInDB, getUserByFirebaseUid } from '../app/services/users';
import type { User as AppUser } from '../models/user';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const ensureUserInDB = useCallback(async (firebaseUser: User) => {
        try {
            await getUserByFirebaseUid(firebaseUser.uid);
        } catch (err) {
            console.log(err,'Usuario no encontrado en DB, creando...');
            const userData: Partial<AppUser> = {
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
                email: firebaseUser.email || '',
                profile_picture: 1,
                firebase_uid: firebaseUser.uid,
            };
            await createUserInDB(userData as Omit<AppUser, 'password'>);
            
        }
    }, []);

    const loginWithEmail = useCallback(async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            await ensureUserInDB(cred.user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                throw err;
            }
            throw new Error('An unknown error occurred during email login.');
        } finally {
            setLoading(false);
        }
    }, [ensureUserInDB]);

    const registerWithEmail = useCallback(async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await ensureUserInDB(cred.user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                throw err;
            }
            throw new Error('An unknown error occurred during email registration.');
        } finally {
            setLoading(false);
        }
    }, [ensureUserInDB]);

    const loginWithGoogle = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(auth, provider);
            await ensureUserInDB(cred.user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
            throw new Error('An unknown error occurred during Google login.');
        } finally {
            setLoading(false);
        }
    }, [ensureUserInDB]);

    const logout = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            await signOut(auth);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { user, loading, error, login: loginWithEmail, loginWithGoogle, logout, registerWithEmail };
}