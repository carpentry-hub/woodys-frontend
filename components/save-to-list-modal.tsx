'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { ProjectList } from '@/models/project-list';
import { getUsersProjectLists, createProjectList, addProjectToList } from '@/app/services/project-lists';
import { Loader2, Plus, Check, X, Bookmark, Lock, Globe } from 'lucide-react';

interface SaveToListModalProps {
    projectId: number;
    onClose: () => void;
}

// Definimos un tipo para el estado de cada botón
type ListSaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function SaveToListModal({ projectId, onClose }: SaveToListModalProps) {
    const { appUser } = useAuth();
    const [lists, setLists] = useState<ProjectList[]>([]);
    const [loadingLists, setLoadingLists] = useState(true);
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    // Estado para manejar el feedback visual individual de cada lista
    const [listStates, setListStates] = useState<Record<number, ListSaveState>>({});

    const fetchLists = async () => {
        if (!appUser) return;
        setLoadingLists(true);
        try {
            const userLists = await getUsersProjectLists(appUser.id);
            setLists(userLists);
        } catch (err) {
            console.error('Error cargando listas:', err);
        } finally {
            setLoadingLists(false);
        }
    };

    useEffect(() => {
        fetchLists();
    }, [appUser]);

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim() || !appUser) return;
        
        setIsCreating(true);
        try {
            // Corrección: Usualmente la API espera 'user_id' en lugar de 'user'
            const newList = await createProjectList({
                name: newListName,
                user_id: appUser.id, 
                is_public: false,
            });
            
            setNewListName('');
            setLists(prevLists => [newList, ...prevLists]); // Actualización optimista de la UI
            
            // Si la lista se creó bien, intentamos guardar el proyecto en ella automáticamente
            if (newList.id) {
                await handleSaveToList(newList.id);
            }
        } catch (err) {
            console.error('Error creando lista:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveToList = async (listId: number) => {
        setListStates(prev => ({ ...prev, [listId]: 'saving' }));
        
        try {
            await addProjectToList(listId, projectId);
            setListStates(prev => ({ ...prev, [listId]: 'saved' }));
            
            // Opcional: Cerrar el modal después de un éxito, o dejarlo abierto para guardar en más listas
            // setTimeout(onClose, 1000); 
        } catch (err: unknown) {
            // Manejo de errores tipado
            let isDuplicate = false;
            
            if (err instanceof Error) {
                // Ajusta este string según lo que devuelva tu backend realmente
                if (err.message.includes('DUPLICATE') || err.message.includes('unique constraint')) {
                    isDuplicate = true;
                }
                console.error(err.message);
            }

            setListStates(prev => ({ 
                ...prev, 
                [listId]: isDuplicate ? 'saved' : 'error' // Si ya existe, visualmente lo mostramos como guardado
            }));
        }
    };

    const getButtonContent = (listId: number) => {
        const state = listStates[listId];
        switch (state) {
        case 'saving':
            return <Loader2 className="w-4 h-4 animate-spin text-[#c1835a]" />;
        case 'saved':
            return <Check className="w-4 h-4 text-green-600" />;
        case 'error':
            return <X className="w-4 h-4 text-red-500" />;
        default:
            return <Bookmark className="w-4 h-4 text-gray-500 group-hover:text-[#c1835a]" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-[#f2f0eb] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <h3 className="text-lg font-bold text-[#3b3535]">Guardar proyecto</h3>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onClose} 
                        className="rounded-full hover:bg-gray-100 h-8 w-8"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>
                
                {/* Lista de colecciones */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white/50">
                    {loadingLists ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-[#c1835a]" />
                        </div>
                    ) : lists.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <Bookmark className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">No tienes listas creadas.</p>
                            <p className="text-xs text-gray-400 mt-1">Crea una abajo para empezar.</p>
                        </div>
                    ) : (
                        lists.map((list) => (
                            <div 
                                key={list.id} 
                                className="flex items-center justify-between p-3 rounded-xl bg-white border border-transparent hover:border-[#c89c6b]/30 hover:shadow-sm transition-all group"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-[#f2f0eb] p-2 rounded-lg shrink-0">
                                        {list.is_public ? (
                                            <Globe className="w-4 h-4 text-[#656b48]" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-[#656b48]" />
                                        )}
                                    </div>
                                    <div className="truncate">
                                        <span className="font-medium text-[#3b3535] block truncate">{list.name}</span>
                                        <span className="text-xs text-gray-400 block">
                                            {list.project_count ?? 0} proyectos
                                        </span>
                                    </div>
                                </div>
                                
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9 p-0 rounded-full hover:bg-[#f2f0eb]"
                                    onClick={() => list.id && handleSaveToList(list.id)}
                                    disabled={listStates[list.id!] === 'saving' || listStates[list.id!] === 'saved'}
                                    title={listStates[list.id!] === 'error' ? 'Error al guardar' : 'Guardar en esta lista'}
                                >
                                    {getButtonContent(list.id!)}
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer con formulario de creación */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleCreateList} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Nueva lista (ej: Inspiración)..."
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="flex-1 bg-white border-gray-200 focus:ring-[#656b48] focus:border-[#656b48]"
                            disabled={isCreating}
                        />
                        <Button
                            type="submit"
                            className="bg-[#656b48] hover:bg-[#3b3535] text-white transition-colors"
                            size="icon"
                            disabled={isCreating || !newListName.trim()}
                            title="Crear nueva lista"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}