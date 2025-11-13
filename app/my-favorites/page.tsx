'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponsiveHeader } from '@/components/responsive-header';
import { useAuth } from '../../hooks/useAuth';
import { ProjectList } from '@/models/project-list';
import { getUsersProjectLists, createProjectList, deleteProjectList, updateProjectList } from '@/app/services/project-lists';
import { Loader2, Plus, Trash2, Heart, Edit, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function MyFavoritesPage() {
    const { appUser, loading: authLoading } = useAuth();
    const [lists, setLists] = useState<ProjectList[]>([]);
    const [loading, setLoading] = useState(true);
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const [editingListId, setEditingListId] = useState<number | null>(null);
    const [editingListName, setEditingListName] = useState('');
    const [updatingListId, setUpdatingListId] = useState<number | null>(null);

    const fetchLists = async () => {
        if (!appUser) return;
        setLoading(true);
        try {
            const userLists = await getUsersProjectLists(appUser.id);
            setLists(userLists);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && appUser) {
            fetchLists();
        }
    }, [appUser, authLoading]);

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim() || !appUser) return;
        
        setIsCreating(true);
        try {
            await createProjectList({
                name: newListName,
                user_id: appUser.id,
                is_public: false,
            });
            setNewListName('');
            await fetchLists();
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteList = async (listId: number) => {
        if (window.confirm('¿Seguro que quieres eliminar esta lista? (Los proyectos no se borrarán)')) {
            try {
                await deleteProjectList(listId);
                await fetchLists();
            } catch (err) {
                console.error(err);
                alert('No se pudo eliminar la lista.');
            }
        }
    };

    const handleEditClick = (list: ProjectList) => {
        setEditingListId(list.id!);
        setEditingListName(list.name);
    };

    const handleCancelEdit = () => {
        setEditingListId(null);
        setEditingListName('');
    };

    const handleUpdateList = async (listId: number) => {
        if (!editingListName.trim() || !appUser) return;
        
        const originalList = lists.find(l => l.id === listId);
        if (!originalList) return;

        setUpdatingListId(listId);
        try {
            const updatedListData = {
                ...originalList,
                name: editingListName,
            };
            
            await updateProjectList(listId, updatedListData);
            setEditingListId(null);
            await fetchLists();
        } catch (err) {
            console.error(err);
            alert('No se pudo actualizar el nombre de la lista.');
        } finally {
            setUpdatingListId(null);
        }
    };

    const handleToggleVisibility = async (list: ProjectList) => {
        setUpdatingListId(list.id!);
        try {
            const updatedListData = {
                ...list,
                is_public: !list.is_public,
            };
            await updateProjectList(list.id!, updatedListData);
            await fetchLists();
        } catch (err) {
            console.error(err);
            alert('No se pudo cambiar la visibilidad.');
        } finally {
            setUpdatingListId(null);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f2f0eb]">
                <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-2">Mis Favoritos</h1>
                        <p className="text-[#676765] text-base sm:text-lg">
                            Organiza tus proyectos guardados en colecciones.
                        </p>
                    </div>
                </div>
                
                <form onSubmit={handleCreateList} className="mb-8 p-4 bg-white/50 rounded-lg shadow-sm flex flex-col sm:flex-row gap-2">
                    <Input
                        type="text"
                        placeholder="Nombre de tu nueva lista (ej: Muebles de Jardín)"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                        disabled={isCreating}
                    />
                    <Button
                        type="submit"
                        className="bg-[#656b48] hover:bg-[#3b3535] text-white rounded-lg flex items-center space-x-2"
                        disabled={isCreating || !newListName.trim()}
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>Crear Lista</span>
                    </Button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {lists.map((list) => (
                        <div key={list.id} className="bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md flex flex-col">
                            {editingListId === list.id ? (
                                <div className="p-6 h-full flex flex-col justify-between flex-grow">
                                    <Input
                                        type="text"
                                        value={editingListName}
                                        onChange={(e) => setEditingListName(e.target.value)}
                                        className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                                        disabled={updatingListId === list.id}
                                    />
                                </div>
                            ) : (
                                <Link href={`/my-favorites/${list.id}`} className="flex-grow">
                                    <div className="p-6 h-full flex flex-col justify-between">
                                        <div>
                                            <Heart className="w-8 h-8 text-[#c1835a] mb-3" />
                                            <h3 className="font-semibold text-xl text-[#3b3535] group-hover:text-[#c1835a] transition-colors">
                                                {list.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {list.project_count ?? 0} {list.project_count === 1 ? 'proyecto' : 'proyectos'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-2">
                                            {list.is_public ? 'Pública' : 'Privada'}
                                        </span>
                                    </div>
                                </Link>
                            )}
                            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                                {editingListId === list.id ? (
                                    <>
                                        <Button 
                                            size="sm" 
                                            className="text-xs bg-[#656b48] hover:bg-[#3b3535] text-white" 
                                            onClick={() => handleUpdateList(list.id!)}
                                            disabled={updatingListId === list.id || !editingListName.trim()}
                                        >
                                            {updatingListId === list.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-xs" 
                                            onClick={handleCancelEdit}
                                            disabled={updatingListId === list.id}
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-xs" 
                                            onClick={() => handleEditClick(list)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => handleToggleVisibility(list)}
                                            disabled={updatingListId === list.id}
                                        >
                                            {updatingListId === list.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : list.is_public ? (
                                                <EyeOff className="w-4 h-4 mr-1" />
                                            ) : (
                                                <Eye className="w-4 h-4 mr-1" />
                                            )}
                                            {list.is_public ? 'Hacer Privada' : 'Hacer Pública'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleDeleteList(list.id!)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {lists.length === 0 && !loading && (
                    <div className="text-center text-[#676765] py-16 bg-white/50 rounded-lg">
                        <Heart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="font-semibold text-lg text-[#3b3535]">Aún no tienes listas</h3>
                        <p>Usa el formulario de arriba para crear tu primera lista de favoritos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}