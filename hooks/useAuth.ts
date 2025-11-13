'use client';

import { useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserInDB, getUserByFirebaseUid, getUserProfilePictureUrl } from '../app/services/users';
import type { User as AppUser } from '../models/user';

const APP_USER_KEY = 'appUser';
const PROFILE_PIC_URL_KEY = 'profilePictureUrl';

export function useAuth() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

    const clearUserData = useCallback(() => {
        localStorage.removeItem(APP_USER_KEY);
        localStorage.removeItem(PROFILE_PIC_URL_KEY);
        setAppUser(null);
        setProfilePictureUrl(null);
    }, []);

    const fetchAppUserData = useCallback(async (firebaseUser: FirebaseUser) => {
        setLoading(true);
        try {
            const userFromDb = await getUserByFirebaseUid(firebaseUser.uid);
            setAppUser(userFromDb);
            localStorage.setItem(APP_USER_KEY, JSON.stringify(userFromDb));

            let finalPicUrl: string | null = null;
            if (userFromDb.profile_picture && userFromDb.profile_picture > 1) {
                const dbPicUrl = await getUserProfilePictureUrl(userFromDb.profile_picture);
                if (dbPicUrl) finalPicUrl = dbPicUrl;
            } else if (userFromDb.profile_picture === 1) {
                finalPicUrl = firebaseUser.photoURL || null;
            }

            setProfilePictureUrl(finalPicUrl);
            if (finalPicUrl) {
                localStorage.setItem(PROFILE_PIC_URL_KEY, finalPicUrl);
            } else {
                localStorage.removeItem(PROFILE_PIC_URL_KEY);
            }
            return userFromDb;
        } catch (err) {
            console.error('Error fetching app user data:', err);
            clearUserData();
            throw err;
        } finally {
            setLoading(false);
        }
    }, [clearUserData]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                setLoading(true);
                const storedUser = localStorage.getItem(APP_USER_KEY);
                const storedPicUrl = localStorage.getItem(PROFILE_PIC_URL_KEY);
                let isCacheValid = false;

                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser) as AppUser;
                        if (parsedUser.firebase_uid === firebaseUser.uid) {
                            setAppUser(parsedUser);
                            if (storedPicUrl) setProfilePictureUrl(storedPicUrl);
                            isCacheValid = true;
                        }
                    } catch (e) {
                        console.error('Error parsing cached user', e);
                        clearUserData();
                    }
                }
                
                fetchAppUserData(firebaseUser)
                    .catch(err => {
                        console.error('Failed to re-fetch user data:', err);
                        if (!isCacheValid) setLoading(false);
                    })
                    .finally(() => {
                        setLoading(false);
                    });

            } else {
                clearUserData();
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [fetchAppUserData, clearUserData]);

    const ensureUserInDB = useCallback(async (firebaseUser: FirebaseUser) => {
        try {
            return await fetchAppUserData(firebaseUser);
        } catch (err) {
            console.log(err,'Usuario no encontrado en DB, creando...');
            const userData: Partial<AppUser> = {
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Nuevo Usuario',
                email: firebaseUser.email || '',
                profile_picture: 1, 
                firebase_uid: firebaseUser.uid,
            };
            const newUser = await createUserInDB(userData as Omit<AppUser, 'password'>);
            
            setAppUser(newUser);
            localStorage.setItem(APP_USER_KEY, JSON.stringify(newUser));
            
            if (newUser.profile_picture === 1 && firebaseUser.photoURL) {
                setProfilePictureUrl(firebaseUser.photoURL);
                localStorage.setItem(PROFILE_PIC_URL_KEY, firebaseUser.photoURL);
            }
            return newUser;
        }
    }, [fetchAppUserData]);

    const loginWithEmail = useCallback(async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            await ensureUserInDB(cred.user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                setLoading(false);
                throw err;
            }
            throw new Error('An unknown error occurred during email login.');
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
                setLoading(false);
                throw err;
            }
            throw new Error('An unknown error occurred during email registration.');
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
            setLoading(false);
            throw new Error('An unknown error occurred during Google login.');
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
            setLoading(false);
        }
    }, []);

    return { 
        user, 
        appUser, 
        profilePictureUrl, 
        loading, 
        error, 
        login: loginWithEmail, 
        loginWithGoogle, 
        logout, 
        registerWithEmail,
        fetchAppUserData
    };
}