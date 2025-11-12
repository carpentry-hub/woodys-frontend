'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
// Modal clásico centrado con overlay y blur
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const { loginWithGoogle, registerWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await registerWithEmail(email, password);
            }
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

    // Usar portal para renderizar el modal fuera del header
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Overlay con blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[8px] transition-opacity"
                onClick={onClose}
            />
            {/* Modal centrado */}
            <div className="relative bg-white rounded-2xl p-8 max-w-xs w-full mx-auto shadow-2xl flex flex-col items-center z-10 animate-fadein">
                <h2 className="text-xl font-bold mb-4 text-[#3b3535]">Iniciar sesión</h2>
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
                    {error && <div className="text-red-500 text-xs text-center">{error}</div>}
                    <Button type="submit" className="bg-[#c1835a] text-white rounded-full mt-2" disabled={loading}>
                        {isRegister ? 'Registrarme' : 'Ingresar'}
                    </Button>
                </form>
                <div className="my-4 text-xs text-[#676765]">o</div>
                <Button onClick={loginWithGoogle} className="w-full bg-[#c1835a] text-white rounded-full mb-2" disabled={loading}>
          Continuar con Google
                </Button>
                <button
                    className="text-xs text-[#c1835a] mt-2 hover:underline"
                    onClick={() => setIsRegister(r => !r)}
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

