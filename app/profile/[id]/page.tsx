'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar, Package, List as ListIcon, Star, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ResponsiveHeader } from '@/components/responsive-header';

// Servicios
import { getUser, getUserProjects, getUserProfilePictureUrl } from '@/app/services/users';
import { getUsersProjectLists } from '@/app/services/project-lists';
import { getProjectRatings } from '@/app/services/ratings';

// Modelos
import { User } from '@/models/user';
import { ProjectWithUser } from '@/models/project-with-user';
import { ProjectList } from '@/models/project-list';
import { Project } from '@/models/project';

// --- Componente Reutilizable de ProjectCard (Versión Simplificada para Perfil) ---
const PublicProjectCard = ({ project }: { project: ProjectWithUser }) => {
    const displayRating = (project.average_rating ?? 0) > 0 ? project.average_rating.toFixed(1) : '-';

    return (
        <Link href={`/project/${project.id}`} className="group block h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-100">
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    <Image
                        src={project.portrait || (project.images && project.images[0]) || 'https://placehold.co/400x300/f2f0eb/3b3535?text=Project'}
                        alt={project.title}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.time_to_build > 0 && (
                        <div className="absolute bottom-2 left-2">
                            <Badge className="text-[10px] bg-white/90 text-[#c89c6b] hover:bg-white shadow-sm backdrop-blur-sm">
                                {project.time_to_build} hs
                            </Badge>
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap gap-1">
                            {project.style && project.style[0] && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#656b48]/10 text-[#656b48]">
                                    {project.style[0]}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center text-xs font-medium text-gray-500">
                            <Star className={`w-3 h-3 mr-1 ${ (project.average_rating ?? 0) > 0 ? 'text-[#c1835a] fill-[#c1835a]' : 'text-gray-300' }`} />
                            {displayRating}
                        </div>
                    </div>
                    <h3 className="font-bold text-[#3b3535] text-base mb-1 line-clamp-2 group-hover:text-[#c1835a] transition-colors">
                        {project.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default function PublicProfilePage() {
    const params = useParams();
    const userId = Number(params?.id);

    // Extendemos el tipo User localmente para incluir la URL de la foto
    const [profileUser, setProfileUser] = useState<(User & { profile_picture_url?: string | null }) | null>(null);
    const [projects, setProjects] = useState<ProjectWithUser[]>([]);
    const [lists, setLists] = useState<ProjectList[]>([]);
    const [loading, setLoading] = useState(true);
    const [calculatedReputation, setCalculatedReputation] = useState<number | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // 1. Obtener Datos del Usuario
                const userData = await getUser(userId);
                
                // Cargar foto de perfil
                let profilePicUrl: string | null = null;
                if (userData.profile_picture && userData.profile_picture > 1) {
                    try {
                        profilePicUrl = await getUserProfilePictureUrl(userData.profile_picture);
                    } catch (e) {
                        console.error('Error loading profile pic', e);
                    }
                }
                const userWithPic = { ...userData, profile_picture_url: profilePicUrl };
                setProfileUser(userWithPic);

                // 2. Obtener Proyectos Públicos
                const rawProjects = await getUserProjects(userId);
                const publicProjects = rawProjects.filter((p: { is_public: boolean | number }) => p.is_public);

                // Enriquecer proyectos con ratings
                const enrichedProjects = await Promise.all(publicProjects.map(async (p: Project) => {
                    const ratings = await getProjectRatings(p.id);
                    const avg = ratings.reduce((acc, r) => acc + r.value, 0);
                    const averageRating = ratings.length > 0 ? avg / ratings.length : 0;
                    
                    return {
                        ...p,
                        owner: userWithPic,
                        average_rating: averageRating,
                        rating_count: ratings.length
                    } as ProjectWithUser;
                }));

                setProjects(enrichedProjects);

                // Calcular reputación basada en proyectos
                if (enrichedProjects.length > 0) {
                    const totalAvg = enrichedProjects.reduce((acc, p) => acc + (p.average_rating || 0), 0);
                    setCalculatedReputation(totalAvg / enrichedProjects.length);
                }

                // 3. Obtener Listas Públicas
                const userLists = await getUsersProjectLists(userId);
                const publicLists = userLists.filter(l => l.is_public);
                setLists(publicLists);

            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f2f0eb]">
                <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen bg-[#f2f0eb] flex flex-col">
                <ResponsiveHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#3b3535]">Usuario no encontrado</h1>
                        <Link href="/explorer">
                            <Button variant="link" className="text-[#c1835a]">Volver a explorar</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            
            {/* Header del Perfil */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <Avatar className="w-32 h-32 border-4 border-[#f2f0eb] shadow-lg">
                            {/* AQUI ESTABA EL ERROR: Faltaba el src */}
                            <AvatarImage 
                                src={profileUser.profile_picture_url || undefined} 
                                className="object-cover" 
                            />
                            <AvatarFallback className="text-4xl bg-[#c1835a] text-white">
                                {profileUser.username[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#3b3535]">
                                {profileUser.username}
                            </h1>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 mt-2">
                                <div className="flex items-center bg-[#f2f0eb] px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 mr-1 text-[#c1835a] fill-[#c1835a]" />
                                    <span className="font-medium text-[#3b3535]">
                                        {calculatedReputation ? calculatedReputation.toFixed(1) : (profileUser.reputation || 0).toFixed(1)} Reputación
                                    </span>
                                </div>
                                <div className="flex items-center bg-[#f2f0eb] px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                    <span>Miembro desde {new Date(profileUser.created_at).getFullYear()}</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 max-w-md mx-auto md:mx-0 mt-4">
                                {`¡Hola! Soy ${profileUser.username} y me encanta crear proyectos de carpintería.`}
                            </p>
                        </div>
                        
                        <div className="md:ml-auto flex gap-4 text-center">
                            <div className="bg-[#f2f0eb]/50 p-4 rounded-xl min-w-[100px]">
                                <div className="text-2xl font-bold text-[#3b3535]">{projects.length}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Proyectos</div>
                            </div>
                            <div className="bg-[#f2f0eb]/50 p-4 rounded-xl min-w-[100px]">
                                <div className="text-2xl font-bold text-[#3b3535]">{lists.length}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Listas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <Tabs defaultValue="projects" className="w-full">
                    <TabsList className="w-full sm:w-auto bg-white/50 p-1 rounded-lg mb-8 border border-gray-200">
                        <TabsTrigger 
                            value="projects" 
                            className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-[#656b48] data-[state=active]:text-white rounded-md transition-all"
                        >
                            <Package className="w-4 h-4 mr-2" /> Proyectos ({projects.length})
                        </TabsTrigger>
                        <TabsTrigger 
                            value="lists" 
                            className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-[#656b48] data-[state=active]:text-white rounded-md transition-all"
                        >
                            <ListIcon className="w-4 h-4 mr-2" /> Listas ({lists.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="mt-0">
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {projects.map(project => (
                                    <PublicProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">Sin proyectos públicos</h3>
                                <p className="text-gray-500">Este usuario aún no ha publicado proyectos.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="lists" className="mt-0">
                        {lists.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {lists.map(list => (
                                    <div key={list.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-[#f2f0eb] rounded-lg">
                                                <Heart className="w-6 h-6 text-[#c1835a]" />
                                            </div>
                                            <Badge variant="outline" className="bg-gray-50">
                                                {list.project_count} items
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-lg text-[#3b3535] mb-1">{list.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4">Creada el {new Date(list.created_at).toLocaleDateString()}</p>
                                        
                                        <Link href={`/my-favorites/${list.id}`}>
                                            <Button variant="ghost" className="w-full justify-between text-[#c1835a] hover:text-[#a06d4b] hover:bg-[#f2f0eb]/50 group">
                                                Ver lista <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                                <ListIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">Sin listas públicas</h3>
                                <p className="text-gray-500">Este usuario no tiene listas visibles.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}