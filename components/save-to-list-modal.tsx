/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth'; // O useAuthContext
import { ProjectList } from '@/models/project-list';
import { getUsersProjectLists, createProjectList, addProjectToList } from '@/app/services/project-lists';
import { Loader2, Plus, Check, X, Bookmark } from 'lucide-react';

interface SaveToListModalProps {
  projectId: number;
  onClose: () => void;
}

// Un tipo para manejar el estado de guardado de cada lista
type ListSaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function SaveToListModal({ projectId, onClose }: SaveToListModalProps) {
    const { appUser } = useAuth(); // O useAuthContext
    const [lists, setLists] = useState<ProjectList[]>([]);
    const [loadingLists, setLoadingLists] = useState(true);
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    // Estado para manejar el feedback de cada botón de la lista
    const [listStates, setListStates] = useState<Record<number, ListSaveState>>({});

    const fetchLists = async () => {
        if (!appUser) return;
        setLoadingLists(true);
        try {
            const userLists = await getUsersProjectLists(appUser.id);
            setLists(userLists);
        } catch (err) {
            console.error(err);
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
            const newList = await createProjectList({
                name: newListName,
                user: appUser.id,
                is_public: false,
            });
            setNewListName('');
            setLists(prevLists => [newList, ...prevLists]); // Añadir a la UI al instante
            await handleSaveToList(newList.id); // Guardar en la nueva lista
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSaveToList = async (listId: number) => {
        setListStates(prev => ({ ...prev, [listId]: 'saving' }));
        try {
            await addProjectToList(listId, projectId);
            setListStates(prev => ({ ...prev, [listId]: 'saved' }));
        } catch (err: any) {
            if (err.message && err.message.includes('DUPLICATE')) {
                setListStates(prev => ({ ...prev, [listId]: 'error' }));
            } else {
                console.error(err);
                setListStates(prev => ({ ...prev, [listId]: 'error' }));
            }
        }
    };

    const getButtonContent = (listId: number) => {
        const state = listStates[listId];
        switch (state) {
        case 'saving':
            return <Loader2 className="w-4 h-4 animate-spin" />;
        case 'saved':
            return <Check className="w-4 h-4 text-green-500" />;
        case 'error':
            return <span className="text-xs text-red-500">Ya existe</span>;
        default:
            return <Bookmark className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-auto z-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#3b3535]">Guardar en...</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                
                <form onSubmit={handleCreateList} className="mb-4 flex gap-2">
                    <Input
                        type="text"
                        placeholder="Crear nueva lista..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                        disabled={isCreating}
                    />
                    <Button
                        type="submit"
                        className="bg-[#656b48] hover:bg-[#3b3535] text-white"
                        size="icon"
                        disabled={isCreating || !newListName.trim()}
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                </form>

                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {loadingLists ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-[#c1835a]" />
                        </div>
                    ) : lists.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No tienes listas. ¡Crea una!</p>
                    ) : (
                        lists.map((list) => (
                            <div 
                                key={list.id!} 
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100"
                            >
                                <span className="font-medium text-[#3b3535]">{list.name}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-3"
                                    onClick={() => handleSaveToList(list.id!)}
                                    disabled={listStates[list.id!] === 'saving' || listStates[list.id!] === 'saved'}
                                >
                                    {getButtonContent(list.id!)}
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}