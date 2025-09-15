'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, Star } from 'lucide-react';
import { ResponsiveHeader } from '@/components/responsive-header';
import { useAuth } from '../../hooks/useAuth';
import { getUserByFirebaseUid, getUser, getUserProjects } from '../services/users';
import ProfilePictureSelector from '@/components/profile-picture-selector';
import { User } from '@/models/user';
import { Project } from '@/models/project';

const initialStats = {
    projectsPublished: 0,
    followers: 0,
    following: 0,
    totalLikes: 0,
    reputation: 0,
};

export default function ProfilePage() {
    const { user } = useAuth();
    const [profilePicture, setProfilePicture] = useState('/placeholder.svg?height=96&width=96');
    const [showSelector, setShowSelector] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const [userStats, setUserStats] = useState(initialStats);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            getUserByFirebaseUid(user.uid)
                .then((firebaseUserData) => {
                    console.log('\u{1F511} Usuario obtenido por Firebase UID:', firebaseUserData);
                    return getUser(firebaseUserData.id);
                })
                .then((data) => {
                    setUserData(data);

                    const pic =
            data.profile_picture === 1
                ? user?.photoURL || '/placeholder.svg?height=96&width=96'
                : data.profile_picture_url || '/placeholder.svg?height=96&width=96';
                    setProfilePicture(pic);

                    setUserStats({
                        projectsPublished: data.projects_count || 0,
                        followers: data.followers_count || 0,
                        following: data.following_count || 0,
                        totalLikes: data.total_likes || 0,
                        reputation: data.reputation || 0,
                    });

                    setProjectsLoading(true);
                    return getUserProjects(data.id);
                })
                .then((data) => {
                    setProjects(data);
                })
                .catch((err) => {
                    console.error('\u274C Error al cargar perfil:', err);
                    setProjects([]);
                })
                .finally(() => setProjectsLoading(false));
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="pt-4 sm:pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                                <div
                                    className="relative group w-24 h-24 cursor-pointer"
                                    onClick={() => setShowSelector(true)}
                                >
                                    <Avatar className="w-full h-full">
                                        <AvatarImage src={profilePicture} />
                                        <AvatarFallback className="text-2xl">PV</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit className="text-white w-6 h-6" />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold text-[#3b3535] mb-2">
                                        {userData?.username || user?.displayName || user?.email || 'Usuario'}
                                    </h1>
                                    <div className="flex items-center space-x-4 text-[#676765]">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">
                        Se unió en {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showSelector && (
                            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                                    <h3 className="text-lg font-bold mb-4 text-[#3b3535]">Selecciona tu foto de perfil</h3>
                                    <ProfilePictureSelector
                                        currentPicture={profilePicture}
                                        onSelect={(url) => {
                                            setProfilePicture(url);
                                            setShowSelector(false);
                                        }}
                                    />
                                    <Button className="mt-4" variant="outline" onClick={() => setShowSelector(false)}>
                    Cancelar
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#f6f6f6]">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3b3535]">{userStats.projectsPublished}</div>
                                <div className="text-sm text-[#676765]">Proyectos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3b3535]">{userStats.followers.toLocaleString()}</div>
                                <div className="text-sm text-[#676765]">Seguidores</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3b3535]">{userStats.following}</div>
                                <div className="text-sm text-[#676765]">Siguiendo</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#3b3535]">{userStats.totalLikes.toLocaleString()}</div>
                                <div className="text-sm text-[#676765]">Me gusta</div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="text-2xl font-bold text-[#3b3535]">{userStats.reputation}</span>
                                    <Star className="w-5 h-5 fill-[#c1835a] text-[#c1835a]" />
                                </div>
                                <div className="text-sm text-[#676765]">Reputación</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-[#3b3535] mb-6">Proyectos recientes</h2>
                            {projectsLoading ? (
                                <div className="text-center text-[#676765]">Cargando proyectos...</div>
                            ) : projects.length === 0 ? (
                                <div className="text-center text-[#676765]">Aún no tiene proyectos publicados.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {projects.map((project) => (
                                        <div key={project.id} className="group cursor-pointer">
                                            <div className="aspect-square bg-[#f6f6f6] rounded-lg overflow-hidden mb-3">
                                                <Image
                                                    src={project.image_url || '/placeholder.svg'}
                                                    alt={project.title}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <h3 className="font-medium text-[#3b3535] text-sm mb-1">{project.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3 fill-[#c1835a] text-[#c1835a]" />
                                                    <span className="text-xs text-[#676765]">{project.rating || '-'}</span>
                                                </div>
                                                <Badge variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                                                    {project.category || 'Sin categoría'}
                                                </Badge>
                                            </div>
                                        </div>
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
