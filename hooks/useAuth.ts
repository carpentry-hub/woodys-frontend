import { useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserInDB } from '../app/services/users';
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


  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerWithEmail = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Crear usuario en la base de datos del proyecto
      const firebaseUser = cred.user;
      const userData: Partial<AppUser> = {
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
        email: firebaseUser.email || '',
        phone_number: firebaseUser.phoneNumber || '',
        profile_picture: 1
      };
      await createUserInDB(userData as Omit<AppUser, 'password'>);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const firebaseUser = cred.user;
      // Verificar si el usuario ya existe en la base de datos
      try {
        // Suponiendo que el email es único
        // Si tu API usa otro identificador, ajusta aquí
        // Si el usuario no existe, lanzará error y lo creamos
        await createUserInDB({
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          email: firebaseUser.email || '',
          phone_number: firebaseUser.phoneNumber || '',
          profile_picture: 1,
          firebase_uid: firebaseUser.uid,
        });
      } catch (e) {
        // Si el usuario ya existe, ignoramos el error
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, loginWithGoogle, logout, loginWithEmail, registerWithEmail };
}
