'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Calendar, Loader2, X } from 'lucide-react';
import { ResponsiveHeader } from '@/components/responsive-header';
import { useAuth } from '../../hooks/useAuth';
import { getUserProjects, updateUser } from '../services/users';
import { getProjectRatings } from '../services/ratings';
import ProfilePictureSelector from '@/components/profile-picture-selector';
import { Project } from '@/models/project';
import { Rating } from '@/models/rating';
import ProjectCard from '@/components/project-card';

export default function ProfilePage() {
    const { 
        user: firebaseUser, 
        appUser, 
        profilePictureUrl, 
        loading: authLoading,
        fetchAppUserData 
    } = useAuth();
    
    const [showSelector, setShowSelector] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

    useEffect(() => {
        if (appUser?.username) {
            setNewUsername(appUser.username);
        } else if (appUser && !appUser.username) {
            setNewUsername('');
        }
    }, [appUser]);

    useEffect(() => {
        if (appUser?.id) {
            setProjectsLoading(true);
            getUserProjects(appUser.id)
                .then(async (fetchedProjects) => {
                    if (!fetchedProjects || fetchedProjects.length === 0) {
                        setProjects([]);
                        return;
                    }
                    
                    const enrichedProjects = await Promise.all(
                        fetchedProjects.map(async (project : Project) => {
                            try {
                                const ratings: Rating[] = await getProjectRatings(project.id);
                                const avg = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length : 0;
                                return { 
                                    ...project, 
                                    average_rating: avg,
                                    rating_count: ratings.length
                                };
                            } catch (err) {
                                console.error(`Failed to get ratings for project ${project.id}`, err);
                                return { ...project, average_rating: 0, rating_count: 0 };
                            }
                        })
                    );

                    const sortedProjects = enrichedProjects.sort((a, b) => 
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                    
                    setProjects(sortedProjects.slice(0, 10));

                })
                .catch((err) => {
                    console.error('❌ Error al cargar proyectos:', err);
                    setProjects([]);
                })
                .finally(() => {
                    setProjectsLoading(false);
                });
        } else if (!authLoading) {
            setProjectsLoading(false);
            setProjects([]);
        }
    }, [appUser, authLoading]);
    
    const handleUsernameUpdate = async () => {
        if (!appUser || !newUsername.trim()) {
            setUpdateError('El nombre no puede estar vacío.');
            return;
        }
        setUpdateError(null);
        setIsUpdatingUsername(true);
        
        try {
            const userToUpdate = {
                ...appUser,
                username: newUsername.trim()
            };

            await updateUser(appUser.id, userToUpdate);
            
            if (firebaseUser) {
                await fetchAppUserData(firebaseUser);
            }
            setIsEditingUsername(false);
        } catch (err) {
            console.error('Error updating username:', err);
            setUpdateError('No se pudo guardar el nombre. Inténtalo de nuevo.');
        } finally {
            setIsUpdatingUsername(false);
        }
    };
    
    const handleProfilePictureSelect = async (selectedId: number) => {
        if (!appUser) return;
        
        setShowSelector(false);
        
        try {
            const userToUpdate = {
                ...appUser,
                profile_picture: selectedId
            };
            
            await updateUser(appUser.id, userToUpdate);
            
            if (firebaseUser) {
                await fetchAppUserData(firebaseUser);
            }
            console.log('✅ Foto de perfil guardada');
        } catch (err) {
            console.error('Error al guardar foto', err);
            alert('No se pudo actualizar la imagen de perfil. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="pt-4 sm:pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm mb-6 sm:mb-8">
                        {authLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-[#c1835a]" />
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                                    <div
                                        className="relative group w-24 h-24 cursor-pointer"
                                        onClick={() => setShowSelector(true)}
                                    >
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={profilePictureUrl || undefined} />
                                            <AvatarFallback className="text-2xl">
                                                {appUser?.username?.[0]?.toUpperCase() || 
                                                 firebaseUser?.displayName?.[0]?.toUpperCase() || 
                                                 firebaseUser?.email?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit className="text-white w-6 h-6" />
                                        </div>
                                    </div>

                                    <div>
                                        {isEditingUsername ? (
                                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                                <Input
                                                    type="text"
                                                    value={newUsername}
                                                    onChange={(e) => setNewUsername(e.target.value)}
                                                    placeholder="Tu nombre de usuario"
                                                    className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                                                    disabled={isUpdatingUsername}
                                                />
                                                <div className='flex gap-2 mt-2 sm:mt-0'>
                                                    <Button 
                                                        onClick={handleUsernameUpdate} 
                                                        className="bg-[#656b48] hover:bg-[#3b3535] text-white px-3 h-9" 
                                                        size="sm"
                                                        disabled={isUpdatingUsername}
                                                    >
                                                        {isUpdatingUsername ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            'Guardar'
                                                        )}
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="px-3 h-9" 
                                                        onClick={() => { 
                                                            setIsEditingUsername(false); 
                                                            setUpdateError(null); 
                                                            setNewUsername(appUser?.username || '');
                                                        }}
                                                        disabled={isUpdatingUsername}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h1 className="text-3xl font-bold text-[#3b3535]">
                                                        {appUser?.username ? (
                                                            appUser.username
                                                        ) : (
                                                            <span className="text-gray-400 italic">Sin nombre de usuario</span>
                                                        )}
                                                    </h1>
                                                    
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-gray-500 hover:text-[#3b3535]"
                                                        onClick={() => {
                                                            setNewUsername(appUser?.username || '');
                                                            setIsEditingUsername(true);
                                                        }}
                                                    >
                                                        {appUser?.username ? (
                                                            <Edit className="w-4 h-4" />
                                                        ) : (
                                                            <span className="text-xs font-medium text-[#c1835a] hover:underline">Añadir</span>
                                                        )}
                                                    </Button>
                                                </div>
                                                <p className="text-md text-[#676765] mt-1">{appUser?.email || firebaseUser?.email}</p>
                                            </div>
                                        )}
                                        {updateError && <p className="text-red-500 text-sm mt-2">{updateError}</p>}
                                        
                                        <div className="flex items-center space-x-4 text-[#676765] mt-2">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm">
                                                    Se unió en {appUser?.created_at ? new Date(appUser.created_at).toLocaleDateString() : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showSelector && (
                            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
                                    <h3 className="text-lg font-bold mb-4 text-[#3b3535]">Selecciona tu foto de perfil</h3>
                                    <div className="max-h-[300px] overflow-y-auto pr-2">
                                        <ProfilePictureSelector
                                            currentPictureId={appUser?.profile_picture || undefined}
                                            onSelect={handleProfilePictureSelect}
                                        />
                                    </div>
                                    <Button className="mt-4 w-full" variant="outline" onClick={() => setShowSelector(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-[#3b3535] mb-6">Proyectos recientes</h2>
                            {projectsLoading ? (
                                <div className="flex justify-center items-center min-h-[200px]">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#c1835a]" />
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center text-[#676765] min-h-[200px] flex items-center justify-center">
                                    Aún no tiene proyectos publicados.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {projects.map((project) => (
                                        <ProjectCard 
                                            key={project.id} 
                                            project={project} 
                                            author={appUser}
                                            authorImage={profilePictureUrl}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="text-center mt-6">
                                <Link href="/my-projects" className="text-[#c1835a] font-medium hover:underline">
                                    Ver todos los proyectos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}