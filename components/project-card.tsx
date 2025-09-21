'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Heart } from 'lucide-react';
import { Project } from '@/models/project';
import { User } from '@/models/user';
import { getUser } from '@/app/services/users';

interface ProjectCardProps {
  project: Project;
  href?: string; // opcional
}

export default function ProjectCard({ project, href }: ProjectCardProps) {
    const [author, setAuthor] = useState<User | null>(null);

    useEffect(() => {
        if (project.owner) {
            getUser(project.owner)
                .then((userData) => {
                    setAuthor(userData);
                })
                .catch((err) => {
                    console.error('[ProjectCard] Error cargando autor:', err);
                    setAuthor(null);
                });
        }
    }, [project.owner]);

    return (
        <Link
            key={project.id}
            href={href || `/project/${project.id}`}
            className="group"
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                {/* Imagen */}
                <div className="aspect-square relative overflow-hidden">
                    <Image
                        src={project.portrait || '/placeholder.svg'}
                        alt={project.title}
                        width={300}
                        height={300}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Botón favorito */}
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-[#c1835a]" />
                    </div>
                    {/* Tiempo de armado */}
                    {project.time_to_build && (
                        <div className="absolute bottom-3 left-3">
                            <Badge className="text-xs bg-[#f3f0eb] text-[#c89c6b]">
                                {project.time_to_build} horas
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-[#3b3535] mb-2 text-sm group-hover:text-[#c1835a] transition-colors">
                        {project.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-[#3b3535]">
                            {project.average_rating || '-'}
                        </span>
                        <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                    </div>

                    {/* Autor */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs bg-[#f6f6f6]">
                                    {author?.username?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-xs text-[#676765]">
                                <div className="font-medium">{author?.username || 'Anónimo'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
