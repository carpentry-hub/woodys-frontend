'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Grid3X3, List, Filter, Eye, Target } from 'lucide-react';
import { ResponsiveHeader } from '@/components/responsive-header';
import { useAuth } from '../../hooks/useAuth';
import { getUserByFirebaseUid, getUser, getUserProjects } from '../services/users';
import { Project } from '@/models/project';
import ProjectCard from '@/components/project-card';

export default function MyProjectsPage() {
    const { user } = useAuth();
    const [, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [publicProjects, setPublicProjects] = useState<Project[]>([]);
    const [privateProjects, setPrivateProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.uid) return;

        let isMounted = true; // para evitar race conditions si desmonta
        setLoading(true);

        getUserByFirebaseUid(user.uid)
            .then((firebaseUserData) => getUser(firebaseUserData.id))
            .then((userData) => getUserProjects(userData.id))
            .then((data) => {
                if (!isMounted) return;

                const publics = data.filter(
                    (p: { is_public:boolean; }) => p.is_public || p.is_public === null
                );
                const privates = data.filter((p: { is_public: boolean; }) => !p.is_public);

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
    }, [user?.uid]);

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader onCreateProject={() => setIsCreateModalOpen(true)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-2">Mis proyectos</h1>
                        <p className="text-[#676765] text-base sm:text-lg">
                            Gestiona y comparte tus creaciones con la comunidad
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#656b48] hover:bg-[#3b3535] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2 w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span>Crear nuevo proyecto</span>
                    </Button>
                </div>

                {/* Controls */}
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

                {/* Tabs */}
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

                    {/* Public Projects */}
                    <TabsContent value="public">
                        {loading ? (
                            <div className="text-center text-[#676765]">Cargando proyectos...</div>
                        ) : publicProjects.length === 0 ? (
                            <div className="text-center text-[#676765]">Aún no tienes proyectos públicos.</div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'grid lg:grid-cols-5 gap-4' : 'space-y-4'}>
                                {publicProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Private Projects */}
                    <TabsContent value="private">
                        {loading ? (
                            <div className="text-center text-[#676765]">Cargando proyectos...</div>
                        ) : privateProjects.length === 0 ? (
                            <div className="text-center text-[#676765]">Aún no tienes proyectos privados.</div>
                        ) : (
                            <div className={viewMode === 'grid' ? 'grid lg:grid-cols-5 gap-4' : 'space-y-4'}>
                                {privateProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
