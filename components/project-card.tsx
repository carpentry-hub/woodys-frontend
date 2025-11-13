'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Heart, Loader2, Eye, EyeOff } from 'lucide-react';
import { Project } from '@/models/project';
import { User } from '@/models/user';

interface ProjectCardProps {
  project: Project;
  author: User | null;
  authorImage?: string | null;
  href?: string;
  isOwner?: boolean;
  onVisibilityChange?: (projectId: number, isPublic: boolean) => void;
  isChangingVisibility?: boolean;
}

export default function ProjectCard({ 
    project, 
    author, 
    authorImage, 
    href, 
    isOwner = false, 
    onVisibilityChange,
    isChangingVisibility = false 
}: ProjectCardProps) {

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

    return (
        <Link
            key={project.id}
            href={href || `/project/${project.id}`}
            className="group"
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
                
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

                <div className="aspect-square relative overflow-hidden">
                    <Image
                        src={project.portrait || '/placeholder.svg'}
                        alt={project.title}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-[#c1835a]" />
                    </div>
                    {project.time_to_build > 0 && (
                        <div className="absolute bottom-3 left-3">
                            <Badge className="text-xs bg-[#f3f0eb] text-[#c89c6b]">
                                {project.time_to_build} horas
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-[#3b3535] mb-2 text-sm group-hover:text-[#c1835a] transition-colors truncate">
                        {project.title}
                    </h3>

                    <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-[#3b3535]">
                            {displayRating}
                        </span>
                        <Star className={`w-4 h-4 text-[#c1835a] ${
                            (project.average_rating ?? 0) > 0
                                ? 'fill-[#c1835a]'
                                : 'fill-none'
                        }`} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                                <AvatarImage src={authorImage || undefined} />
                                <AvatarFallback className="text-xs bg-[#f6f6f6]">
                                    {author?.username?.[0]?.toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-xs text-[#676765]">
                                <div className="font-medium">
                                    {author?.username || 'Anónimo'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}