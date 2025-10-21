
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Star, Clock, Box, Wrench, Loader2 } from 'lucide-react';
import { ProductGallery } from '@/components/product-gallery';
import { ResponsiveHeader } from '@/components/responsive-header';
import { Project } from '@/models/project';
import { User } from '@/models/user';
import { getProject } from '../../services/projects';
import { getUser } from '../../services/users';
import DOMPurify from 'dompurify';

export default function ProjectPage() {
    const params = useParams();
    const projectId = Number(params?.id);
    const [project, setProject] = useState<Project | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        async function fetchData() {
            setLoading(true);
            try {
                const proj = await getProject(projectId);
                const allImages = [proj.portrait, ...proj.images].filter(Boolean);
                setProject({ ...proj, images: allImages });

                if (proj.owner) {
                    const user = await getUser(proj.owner);
                    setAuthor(user);
                }
            } catch (error) {
                console.error('Error cargando datos del proyecto:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [projectId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f2f0eb]">
                <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#f2f0eb] p-6 text-center">
                <ResponsiveHeader />
                <h1 className="text-2xl font-bold mt-10">Proyecto no encontrado</h1>
                <p>El proyecto que buscas no existe o fue eliminado.</p>
            </div>
        );
    }
    const cleanDescriptionHtml = typeof window !== 'undefined' && project?.description
        ? DOMPurify.sanitize(project.description)
        : '';

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Columna Izquierda (Galería y Título) */}
                        <div className="lg:col-span-2 space-y-4">
                            <ProductGallery images={project.images} productName={project.title} />
                            <div>
                                <h1 className="text-3xl font-bold text-[#3b3535]">{project.title}</h1>
                                <div className="flex items-center p-4 mt-2 border border-gray-200 rounded-xl bg-white/50">
                                    <span className="text-xl font-bold text-[#3b3535]">{project.average_rating?.toFixed(1)}</span>
                                    <div className="flex gap-1 ml-2 mr-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className={`w-5 h-5 ${i <= Math.round(project.average_rating) ? 'fill-[#c1835a] text-[#c1835a]' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <span className="text-gray-500 text-sm">({project.rating_count} valoraciones)</span>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha (Detalles) */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Autor */}
                            {author && (
                                <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-3">Autor</h3>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={author.profile_picture || '/placeholder.svg'} />
                                            <AvatarFallback>{author.username[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-md text-[#3b3535]">{author.username}</p>
                                            <span className="text-sm text-gray-500">Reputación: {author.reputation || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detalles del Proyecto */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Detalles del Proyecto</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-[#c1835a]"/> Tiempo: <strong className="ml-1">{project.time_to_build} hs</strong></div>
                                    <div className="flex items-start"><Wrench className="w-4 h-4 mr-2 text-[#c1835a] shrink-0 mt-1"/> Herramientas: <strong className="ml-1">{project.tools.join(', ')}</strong></div>
                                    <div className="flex items-start col-span-full"><Box className="w-4 h-4 mr-2 text-[#c1835a] shrink-0 mt-1"/> Materiales: <strong className="ml-1">{project.materials.join(', ')}</strong></div>
                                </div>
                                <hr className="my-4"/>
                                <div className="flex flex-wrap gap-2">
                                    {project.style.map((s, i) => (
                                        <Badge key={i} variant="secondary" className="bg-[#e4d5c5] text-[#9a6a49] text-sm font-medium px-3 py-1">{s}</Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-2">Descripción</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: cleanDescriptionHtml }}
                                />
                            </div>

                            <Button className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-6 text-md font-semibold rounded-xl">
                                <Download className="w-5 h-5 mr-2" />
                                Descargar Planos
                            </Button>
                        </div>
                    </div>

                    {/* Sección de Comentarios (Placeholder) */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-[#3b3535] mb-4">Comentarios</h3>
                        <div className="p-6 bg-white/50 rounded-xl text-center text-gray-500">
                            <p>La sección de comentarios estará disponible próximamente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
