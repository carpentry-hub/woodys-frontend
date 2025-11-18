'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Filter, Clock, Loader2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ResponsiveHeader } from '@/components/responsive-header';
import { ProjectWithUser } from '@/models/project-with-user';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import SaveToListModal from '@/components/save-to-list-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoginModal from '@/components/login-modal';
import { useRouter } from 'next/navigation';
import { getUser, getUserProfilePictureUrl } from '@/app/services/users';
import { getProjectRatings } from '@/app/services/ratings';
import { Rating } from '@/models/rating';
import { Project } from '@/models/project';

const capitalize = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const ProjectCard = ({ 
    project, 
    onSaveClick 
}: { 
    project: ProjectWithUser, 
    onSaveClick?: (projectId: number) => void 
}) => {

    const displayRating = (project.average_rating ?? 0) > 0
        ? project.average_rating.toFixed(1)
        : '-';

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSaveClick) {
            onSaveClick(project.id);
        }
    };

    return (
        <Link href={`/project/${project.id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col relative">
                <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                        src={project.portrait || (project.images && project.images[0]) || 'https://placehold.co/400x300/f2f0eb/3b3535?text=Woody\'s'}
                        alt={project.title}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {onSaveClick && (
                        <button
                            onClick={handleSave}
                            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 z-10 transition-colors hover:bg-white hover:text-[#c1835a]"
                            title="Guardar en favoritos"
                        >
                            <Bookmark className="w-4 h-4 text-[#3b3535] group-hover:text-[#c1835a]" />
                        </button>
                    )}
                    
                    {project.time_to_build > 0 && (
                        <div className="absolute bottom-3 left-3">
                            <Badge className="text-xs bg-[#f3f0eb] text-[#c89c6b]">
                                {project.time_to_build} hs
                            </Badge>
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-wrap gap-1">
                            {project.style && project.style[0] && (
                                <Badge className="text-xs bg-[#656b48]/20 text-[#3b3535] border border-[#656b48]/30">
                                    {project.style[0]}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <Clock className="w-3 h-3" />
                            <span>{project.time_to_build} hs</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-[#3b3535] mb-2 text-md group-hover:text-[#c1835a] transition-colors flex-grow">
                        {project.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={project.owner.profile_picture_url || undefined} />
                                <AvatarFallback className="text-xs bg-[#f6f6f6]">
                                    {project.owner.username?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500">{project.owner.username || 'Anónimo'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Star className={`w-4 h-4 text-[#c1835a] ${ (project.average_rating ?? 0) > 0 ? 'fill-[#c1835a]' : 'fill-none' }`} />
                            <span>{displayRating} ({project.rating_count || 0})</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default function ExplorerPage() {
    const {
        projects,
        loading: loadingProjects,
        error,
        searchTerm,
        setSearchTerm,
        activeFilters,
        handleFilterChange,
        filterOptions,
    } = useProjects();

    const { appUser, user } = useAuth();
    const router = useRouter();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const [enrichedProjects, setEnrichedProjects] = useState<ProjectWithUser[]>([]);
    const [enriching, setEnriching] = useState(false);

    useEffect(() => {
        const enrichData = async () => {
            if (projects.length === 0) {
                setEnrichedProjects([]);
                return;
            }

            setEnriching(true);

            try {
                const projectsWithData = await Promise.all(
                    projects.map(async (project: ProjectWithUser | Project) => {
                        const userId = typeof project.owner === 'object' ? project.owner.id : project.owner;
                        const userData = await getUser(userId);
                        
                        const ratings = await getProjectRatings(project.id);
                        const avg = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0);
                        const averageRating = ratings.length > 0 ? avg / ratings.length : 0;
                        const ratingCount = ratings.length;

                        let profilePicUrl: string | null = null;
                        if (userData.profile_picture && userData.profile_picture > 1) {
                            profilePicUrl = await getUserProfilePictureUrl(userData.profile_picture);
                        }
                        
                        const ownerWithPic = { ...userData, profile_picture_url: profilePicUrl };

                        return { 
                            ...project, 
                            owner: ownerWithPic, 
                            average_rating: averageRating, 
                            rating_count: ratingCount 
                        } as ProjectWithUser;
                    })
                );
                setEnrichedProjects(projectsWithData);
            } catch (err) {
                console.error('Error fetching additional data:', err);
                setEnrichedProjects(projects as ProjectWithUser[]);
            } finally {
                setEnriching(false);
            }
        };

        if (!loadingProjects) {
            enrichData();
        }
    }, [projects, loadingProjects]);

    const handleSaveClick = (projectId: number) => {
        if (!appUser) {
            setLoginModalOpen(true);
            return;
        }
        setSelectedProjectId(projectId);
        setIsSaveModalOpen(true);
    };

    const handleCreateProjectClick = () => {
        if (user) {
            router.push('/create-project');
        } else {
            setLoginModalOpen(true);
        }
    };

    const isLoading = loadingProjects || enriching;

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader onCreateProject={handleCreateProjectClick} />
            <div className="pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-[#3b3535] mb-4">Descubre tu próximo proyecto</h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Explora miles de proyectos creados por nuestra comunidad de makers.
                        </p>
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="¿Qué quieres construir hoy? Mesa, silla, biblioteca..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-full text-lg border-transparent focus:outline-none focus:ring-2 focus:ring-[#c1835a] shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-10 p-4 bg-white/50 rounded-lg">
                        <h2 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center"><Filter className="w-5 h-5 mr-2 text-[#c1835a]"/>Filtra tu búsqueda</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estilo</label>
                                <select onChange={(e) => handleFilterChange('style', e.target.value)} value={activeFilters.style || ''} className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c1835a]">
                                    <option value="">Todos</option>
                                    {filterOptions.styles.map(style => (
                                        <option key={style} value={style}>{capitalize(style)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                <select onChange={(e) => handleFilterChange('material', e.target.value)} value={activeFilters.material || ''} className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c1835a]">
                                    <option value="">Todos</option>
                                    {filterOptions.materials.map(mat => (
                                        <option key={mat} value={mat}>{capitalize(mat)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-3xl font-bold text-[#3b3535] mb-8">
                            Proyectos Encontrados ({enrichedProjects.length})
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-red-50 rounded-lg">
                                <h3 className="text-2xl font-semibold text-red-700">¡Ups! Algo salió mal</h3>
                                <p className="text-red-600 mt-2">{error}</p>
                            </div>
                        ) : enrichedProjects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {enrichedProjects.map(project => (
                                    <ProjectCard 
                                        key={project.id} 
                                        project={project} 
                                        onSaveClick={appUser ? handleSaveClick : undefined}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg">
                                <h3 className="text-2xl font-semibold text-[#3b3535]">No se encontraron proyectos</h3>
                                <p className="text-gray-600 mt-2">Intenta cambiar tu búsqueda o ajustar los filtros.</p>
                            </div>
                        )}
                    </section>

                    <section className="my-20 bg-gradient-to-r from-[#656b48] to-[#3b3535] rounded-2xl p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">¿Tienes una idea en mente?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Únete a nuestra comunidad y comparte tu próximo proyecto con miles de makers.
                        </p>
                        
                        <Button onClick={handleCreateProjectClick} className="bg-white text-[#656b48] hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full">
                            Publicar mi proyecto
                        </Button>
                    
                    </section>
                </div>
            </div>

            {isSaveModalOpen && selectedProjectId && (
                <SaveToListModal
                    projectId={selectedProjectId}
                    onClose={() => setIsSaveModalOpen(false)}
                />
            )}
            
            {loginModalOpen && (
                <LoginModal
                    open={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                />
            )}
        </div>
    );
}