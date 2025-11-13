'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResponsiveHeader } from '@/components/responsive-header';
import { useAuth } from '@/hooks/useAuth';
import { Project } from '@/models/project';
import { ProjectList } from '@/models/project-list';
import { getProjectList, getProjectsInList, removeProjectFromList } from '@/app/services/project-lists';
import ProjectCard from '@/components/project-card';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FavoriteListPage() {
    const { appUser, loading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const listId = Number(params.listId);
    
    const [listInfo, setListInfo] = useState<ProjectList | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchListDetails = async () => {
        if (!appUser || !listId) return;
        setLoading(true);
        try {
            const infoPromise = getProjectList(listId);
            const projectsPromise = getProjectsInList(listId);
            
            const [info, projectsData] = await Promise.all([infoPromise, projectsPromise]);

            // Verificar que el usuario sea el dueño de la lista
            if (info.user_id !== appUser.id) {
                router.push('/my-favorites');
                return;
            }

            setListInfo(info);
            setProjects(projectsData);
        } catch (err) {
            console.error(err);
            router.push('/my-favorites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && appUser) {
            fetchListDetails();
        }
    }, [appUser, authLoading, listId]);
    
    const handleRemoveProject = async (projectId: number) => {
        if (window.confirm('¿Seguro que quieres quitar este proyecto de la lista?')) {
            try {
                await removeProjectFromList(listId, projectId);
                await fetchListDetails(); // Recargar
            } catch (err) {
                console.error(err);
                alert('No se pudo quitar el proyecto.');
            }
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
                
                <Link href="/my-favorites" className="flex items-center text-sm text-[#656b48] hover:text-[#3b3535] font-medium mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Volver a mis listas
                </Link>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-2">{listInfo?.name}</h1>
                <p className="text-[#676765] text-base sm:text-lg mb-8">
                    {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} en esta lista.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="relative group/card">
                            <ProjectCard 
                                project={project}
                                author={null} // Dejamos que la card busque su autor
                                authorImage={null} // Dejamos que la card busque la imagen
                            />
                            <button
                                onClick={() => handleRemoveProject(project.id)}
                                className="absolute top-2 right-2 z-20 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-700"
                                title="Quitar de la lista"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                
                {projects.length === 0 && !loading && (
                    <div className="text-center text-[#676765] py-16 bg-white/50 rounded-lg">
                        <h3 className="font-semibold text-lg text-[#3b3535]">Esta lista está vacía</h3>
                        <p>Ve a un proyecto y guárdalo en esta lista para empezar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}