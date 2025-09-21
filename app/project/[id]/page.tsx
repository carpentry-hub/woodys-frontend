'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Star, Clock, Box, Wrench } from 'lucide-react';
import { ProductGallery } from '@/components/product-gallery';
import { ResponsiveHeader } from '@/components/responsive-header';
import { Project } from '@/models/project';
import { getProject } from '../../services/projects';
import { getUser } from '../../services/users';

export default function ProjectPage() {
    const params = useParams();
    const projectId = Number(params?.id);
    const [project, setProject] = useState<Project | null>(null);
    const [author, setAuthor] = useState<{ name: string; reputation: number; profile_picture?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;
        async function fetchData() {
            try {
                const proj = await getProject(projectId);
                const allImages = [proj.portrait, ...proj.images];
                setProject({ ...proj, images: allImages });
                if (proj.owner) {
                    const user = await getUser(proj.owner);
                    setAuthor({
                        name: user.username,
                        reputation: user.reputation,
                        profile_picture: user.profile_picture,
                    });
                }
            } catch (error) {
                console.error('Error cargando proyecto:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [projectId]);

    if (loading) return <div className="p-6">Cargando proyecto...</div>;
    if (!project) return <div className="p-6">Proyecto no encontrado</div>;

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="pt-4 sm:pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* CAMBIO: Se ajusta la grilla principal. Imagenes 2/5 y detalles 3/5. */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
                        {/* Columna Izquierda (Galería) */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* CAMBIO: Se quita la altura fija para que la imagen se vea completa y se ajusta el radio del borde */}
                            <div className="w-full overflow-hidden">
                                <ProductGallery images={project.images} productName={project.title} />
                            </div>
                            {/* CAMBIO: Título y Puntuación dentro de una tarjeta */}
                            <div className="mb-4">
                                <h1 className="text-2xl font-bold text-[#3b3535]">{project.title}</h1>
                                <div className="flex items-center p-4 mt-2 border border-neutral-900/20 rounded-[22px] ">
                                    <span className="text-xl font-bold text-[#3b3535]">{project.average_rating?.toFixed(1)}</span>
                                    <div className="flex gap-1 ml-2 mr-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className={`w-5 h-5 ${i <= Math.round(project.average_rating) ? 'fill-[#c1835a] text-[#c1835a]' : 'text-[#adadad]'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[#adadad] text-sm">{project.rating_count} votantes</span>
                                </div>
                            </div>
                        </div>
                        

                        {/* Columna Derecha (Detalles) */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Columna 1 de la grilla interna */}
                                <div className="space-y-4">
                                    {/* Autor */}
                                    {author && (
                                        <div className="border border-neutral-900/20 rounded-[22px] p-4 space-y-3">
                                            <h3 className="text-base font-semibold text-[#3b3535]">Autor</h3>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={author.profile_picture || '/placeholder.svg'} />
                                                    <AvatarFallback>{author.name[0]?.toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm text-[#3b3535]">{author.name}</p>
                                                    <a href="#" className="text-xs text-[#c1835a] hover:underline">Ver workshop</a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Especificaciones */}
                                    <div className="border border-neutral-900/20 rounded-[22px] p-4">
                                        <h3 className="text-base font-semibold text-[#3b3535] mb-3">Especificaciones</h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between font-medium text-[#676765]"><span>Alto</span><span className="text-right text-[#3b3535]">100cm</span></div>
                                            <div className="flex justify-between font-medium text-[#676765]"><span>Ancho</span><span className="text-right text-[#3b3535]">100cm</span></div>
                                            <div className="flex justify-between font-medium text-[#676765]"><span>Largo</span><span className="text-right text-[#3b3535]">100cm</span></div>
                                            <div className="flex justify-between font-medium text-[#676765]"><span>Material</span><span className="text-right text-[#3b3535]">100cm</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Columna 2 de la grilla interna */}
                                <div className="space-y-4">
                                    {/* Herramientas, Materiales y Tiempo (Todo en una tarjeta) */}
                                    <div className="border border-neutral-900/20 rounded-[22px] p-4 h-full flex flex-col">
                                        <div>
                                            <h3 className="text-base font-semibold text-[#3b3535] mb-3">Herramientas y materiales</h3>
                                            <div className="space-y-2">
                                                {project.tools.map((tool, i) => (
                                                    <div key={`tool-${i}`} className="flex items-center text-xs text-[#3b3535]"><Wrench className="w-3 h-3 mr-2 text-[#c1835a]"/> {tool}</div>
                                                ))}
                                                {project.materials.map((mat, i) => (
                                                    <div key={`mat-${i}`} className="flex items-center text-xs text-[#3b3535]"><Box className="w-3 h-3 mr-2 text-[#c1835a]"/> {mat}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <hr className="my-3 border-neutral-900/20" />
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-[#3b3535]">Tiempo</h3>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Clock className="w-4 h-4 text-[#c1835a]" />
                                                <span className="text-[#3b3535] font-medium">{project.time_to_build} hs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4 mt-4">
                                <div className="border border-neutral-900/20 rounded-[22px] p-4">
                                    <h3 className="text-base font-semibold text-[#3b3535] mb-3">Estilos</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {/* CAMBIO: Estilos de Badge más notorios y grandes */}
                                        {project.style.map((style, i) => (
                                            <Badge key={i} variant="secondary" className="bg-[#e4d5c5] text-[#9a6a49] text-sm font-medium px-3 py-1">{style}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="border border-neutral-900/20 bg-transparent rounded-[22px] p-4 sm:p-6">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Descripción</h3>
                                    <p className="text-[#676765] text-sm leading-relaxed">{project.description}</p>
                                    <button className="text-[#c1835a] text-sm font-medium mt-2">Ver más</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Button className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-3 text-sm font-semibold rounded-[22px]">
                            <Download className="w-4 h-4 mr-2" />
                                    Descargar <span className="text-xs opacity-80 ml-1">(Free to build)</span>
                        </Button>
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Comentarios</h3>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}