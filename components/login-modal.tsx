'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const { loginWithGoogle, login, registerWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setLoading(true);
        try {
            if (isRegister) {
                await registerWithEmail(email, password);
            } else {
                await login(email, password);
            }
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('auth/invalid-credential')) {
                    setSubmitError('Email o contraseña incorrectos.');
                } else if (error.message.includes('auth/email-already-in-use')) {
                    setSubmitError('Este email ya está registrado.');
                } else {
                    setSubmitError('Ocurrió un error. Inténtalo de nuevo.');
                }
                console.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setSubmitError(null);
        try {
            await loginWithGoogle();
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[8px] transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl p-8 max-w-xs w-full mx-auto shadow-2xl flex flex-col items-center z-10 animate-fadein">
                <h2 className="text-xl font-bold mb-4 text-[#3b3535]">
                    {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                    <Input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" className="bg-[#c1835a] text-white rounded-full mt-2" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegister ? 'Registrarme' : 'Ingresar')}
                    </Button>
                </form>
                <div className="my-4 text-xs text-[#676765]">o</div>
                <Button onClick={handleGoogleLogin} className="w-full bg-[#c1835a] text-white rounded-full mb-2" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continuar con Google'}
                </Button>
                <button
                    className="text-xs text-[#c1835a] mt-2 hover:underline"
                    onClick={() => {
                        setIsRegister(r => !r);
                        setSubmitError(null);
                    }}
                    type="button"
                >
                    {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </button>
                {submitError && <div className="text-red-500 text-xs text-center mt-2">{submitError}</div>}
            </div>
        </div>,
        typeof window !== 'undefined' ? document.body : document.createElement('div')
    );
}