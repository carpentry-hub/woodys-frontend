'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid3X3, List, Filter, Eye, Target, Loader2 } from 'lucide-react';
import { ResponsiveHeader } from '@/components/responsive-header';
import { useAuth } from '../../hooks/useAuth';
import { getUserProjects } from '../services/users';
import { Project } from '@/models/project';
import ProjectCard from '@/components/project-card';
import { useRouter } from 'next/navigation';
import { updateProject } from '../services/projects';

export default function MyProjectsPage() {
    const { user, appUser, profilePictureUrl, loading: authLoading } = useAuth();
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [publicProjects, setPublicProjects] = useState<Project[]>([]);
    const [privateProjects, setPrivateProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingProjectId, setUpdatingProjectId] = useState<number | null>(null);

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }
        if (!user || !appUser) {
            router.push('/');
            return;
        }

        let isMounted = true;
        setLoading(true);

        getUserProjects(appUser.id)
            .then((data) => {
                if (!isMounted) return;

                const publics = data.filter(
                    (p: { is_public:boolean; }) => p.is_public === true || p.is_public === null
                );
                const privates = data.filter((p: { is_public: boolean; }) => p.is_public === false);

                setPublicProjects(publics);
                setPrivateProjects(privates);
            })
            .catch((err) => {
                console.error('❌ Error al cargar proyectos:', err);
                setPublicProjects([]);
                setPrivateProjects([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [user, appUser, authLoading, router]);

    const handleVisibilityChange = async (projectId: number, newIsPublic: boolean) => {
        setUpdatingProjectId(projectId);
        
        const projectToMove = newIsPublic 
            ? privateProjects.find(p => p.id === projectId)
            : publicProjects.find(p => p.id === projectId);

        if (!projectToMove) return;

        try {
            const updatedProjectData = { ...projectToMove, is_public: newIsPublic };
            
            await updateProject(projectToMove.id, updatedProjectData);

            if (newIsPublic) {
                setPrivateProjects(prev => prev.filter(p => p.id !== projectId));
                setPublicProjects(prev => [updatedProjectData, ...prev]);
            } else {
                setPublicProjects(prev => prev.filter(p => p.id !== projectId));
                setPrivateProjects(prev => [updatedProjectData, ...prev]);
            }
        } catch (err) {
            console.error('Error al cambiar la visibilidad:', err);
            alert('No se pudo actualizar la visibilidad del proyecto.');
        } finally {
            setUpdatingProjectId(null);
        }
    };

    const renderProjectList = (projects: Project[]) => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Loader2 className="w-8 h-8 text-[#c1835a] animate-spin" />
                </div>
            );
        }
        if (projects.length === 0) {
            return (
                <div className="text-center text-[#676765]">
                    No se encontraron proyectos.
                </div>
            );
        }
        return (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4' : 'space-y-4'}>
                {projects.map((project) => (
                    <ProjectCard 
                        key={project.id} 
                        project={project}
                        author={appUser}
                        authorImage={profilePictureUrl}
                        isOwner={true}
                        onVisibilityChange={handleVisibilityChange}
                        isChangingVisibility={updatingProjectId === project.id}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader onCreateProject={() => router.push('/create-project')} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-2">Mis proyectos</h1>
                        <p className="text-[#676765] text-base sm:text-lg">
                            Gestiona y comparte tus creaciones con la comunidad
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/create-project')}
                        className="bg-[#656b48] hover:bg-[#3b3535] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2 w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span>Crear nuevo proyecto</span>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
                            <Filter className="w-4 h-4" />
                            <span>Filtrar</span>
                        </Button>
                        <select className="px-3 py-2 bg-white border border-[#f6f6f6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c1835a]">
                            <option>Más recientes</option>
                            <option>Más populares</option>
                            <option>Mejor valorados</option>
                            <option>Más descargados</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#656b48] text-white' : 'bg-white text-[#676765]'}`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#656b48] text-white' : 'bg-white text-[#676765]'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <Tabs defaultValue="public" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
                        <TabsTrigger value="public" className="flex items-center space-x-2 text-sm">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Proyectos públicos</span>
                            <span className="sm:hidden">Públicos</span>
                            <span>({publicProjects.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="private" className="flex items-center space-x-2 text-sm">
                            <Target className="w-4 h-4" />
                            <span className="hidden sm:inline">Proyectos privados</span>
                            <span className="sm:hidden">Privados</span>
                            <span>({privateProjects.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="public">
                        {renderProjectList(publicProjects)}
                    </TabsContent>

                    <TabsContent value="private">
                        {renderProjectList(privateProjects)}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}