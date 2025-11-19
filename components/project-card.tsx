'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 1. Importamos useRouter
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2, Bookmark, Eye, EyeOff, Clock } from 'lucide-react';
import { Project } from '@/models/project';
import { User } from '@/models/user';
import { getUser, getUserProfilePictureUrl } from '@/app/services/users';
import { ProjectWithUser } from '@/models/project-with-user';

interface ProjectCardProps {
    project: Project | ProjectWithUser;
    href?: string;
    isOwner?: boolean;
    onVisibilityChange?: (projectId: number, isPublic: boolean) => void;
    isChangingVisibility?: boolean;
    onSaveClick?: (projectId: number) => void;
    author?: User | null;
    authorImage?: string | null;
}

export default function ProjectCard({ 
    project, 
    href, 
    isOwner = false, 
    onVisibilityChange,
    isChangingVisibility = false,
    onSaveClick,
}: ProjectCardProps) {

    const router = useRouter(); // 2. Inicializamos el router
    const [author, setAuthor] = useState<User | null>(null);
    const [authorImage, setAuthorImage] = useState<string | null>(null);
    const [authorLoading, setAuthorLoading] = useState(true);

    useEffect(() => {
        setAuthorLoading(true);
        setAuthor(null);
        setAuthorImage(null);

        const fetchAuthorData = async (ownerId: number) => {
            try {
                const userData = await getUser(ownerId);
                setAuthor(userData);
                if (userData.profile_picture && userData.profile_picture > 1) {
                    const imageUrl = await getUserProfilePictureUrl(userData.profile_picture);
                    setAuthorImage(imageUrl);
                }
            } catch (err) {
                console.error('[ProjectCard] Error cargando autor:', err);
                setAuthor(null);
            } finally {
                setAuthorLoading(false);
            }
        };

        if (project.owner) {
            if (typeof project.owner === 'number') {
                fetchAuthorData(project.owner);
            } else if (typeof project.owner === 'object' && 'id' in project.owner) {
                const user = project.owner as User;
                setAuthor(user);
                if (user.profile_picture && user.profile_picture > 1) {
                    getUserProfilePictureUrl(user.profile_picture)
                        .then(url => setAuthorImage(url))
                        .finally(() => setAuthorLoading(false));
                } else {
                    setAuthorLoading(false);
                }
            }
        } else {
            setAuthorLoading(false);
        }
    }, [project.owner]);

    const displayRating = (project.average_rating ?? 0) > 0
        ? project.average_rating.toFixed(1)
        : '-';

    const handleToggleVisibility = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onVisibilityChange) {
            onVisibilityChange(project.id, !project.is_public);
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSaveClick) {
            onSaveClick(project.id);
        }
    };

    // 3. Nueva función para manejar el clic en el autor
    const handleAuthorClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Evita abrir el proyecto
        e.stopPropagation(); // Evita burbujeo del evento
        
        // Navegamos manualmente al perfil si tenemos el autor
        if (author && author.id) {
            router.push(`/profile/${author.id}`);
        }
    };

    return (
        <Link
            key={project.id}
            href={href || `/project/${project.id}`}
            className="group"
        >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col relative">
                
                {isOwner && (
                    <button
                        onClick={handleToggleVisibility}
                        disabled={isChangingVisibility}
                        className="absolute top-3 left-3 bg-black/50 text-white rounded-full p-2 z-10 opacity-70 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        title={project.is_public ? 'Cambiar a Privado' : 'Cambiar a Público'}
                    >
                        {isChangingVisibility ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : project.is_public ? (
                            <Eye className="w-4 h-4" />
                        ) : (
                            <EyeOff className="w-4 h-4" />
                        )}
                    </button>
                )}

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
                        {/* 4. Asignamos el evento onClick al contenedor del autor */}
                        <div 
                            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity z-10"
                            onClick={handleAuthorClick}
                            title="Ver perfil del autor"
                        >
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={authorImage || undefined} />
                                <AvatarFallback className="text-xs bg-[#f6f6f6]">
                                    {authorLoading 
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : (author?.username?.[0]?.toUpperCase() || 'U')
                                    }
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500 hover:text-[#c1835a] hover:underline">
                                {authorLoading 
                                    ? 'Cargando...'
                                    : (author?.username || 'Anónimo')
                                }
                            </span>
                        </div>

                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Star className={`w-4 h-4 text-[#c1835a] ${ (project.average_rating ?? 0) > 0 ? 'fill-[#c1835a]' : 'fill-none' }`} />
                            <span>{displayRating} ({project.rating_count})</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}