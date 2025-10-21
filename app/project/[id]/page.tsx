
'use client';

import { useEffect, useState, } from 'react';
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
import { getUser, getUserByFirebaseUid } from '../../services/users';
import { rateProject, getProjectRatings, updateRating } from '../../services/ratings';
import { listProjectComments, commentProject, replyToComment } from '../../services/comments';
import { useAuthContext } from '@/contexts/AuthContext';
import DOMPurify from 'dompurify';
import { Comment, CommentWithUser } from '@/models/comment';
import { Rating } from '@/models/rating';

export default function ProjectPage() {
    const params = useParams();
    const projectId = Number(params?.id);
    const [project, setProject] = useState<Project | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const { user } = useAuthContext();
    const [appUser, setAppUser] = useState<User | null>(null);
    const [userRating, setUserRating] = useState<Rating | null>(null);
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        if (user) {
            getUserByFirebaseUid(user.uid).then(setAppUser);
        }
    }, [user]);

    useEffect(() => {
        if (appUser && project) {
            getProjectRatings(project.id).then(ratings => {
                const userRating = ratings.find(r => r.user_id === appUser.id);
                setUserRating(userRating || null);
            });
        }
    }, [appUser, project]);

    const handleCommentSubmit = async () => {
        if (!appUser || !project) {
            alert('Debes iniciar sesión para comentar.');
            return;
        }
        if (!newComment.trim()) return;

        try {
            await commentProject(project.id, { content: newComment, user_id: appUser.id, project_id: project.id });
            setNewComment('');
            // Refetch comments
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await Promise.all(
                projectComments.map(async (comment: Comment) => {
                    const user = await getUser(comment.user_id);
                    return { ...comment, user };
                })
            );
            setComments(commentsWithUsers);
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            alert('Hubo un error al enviar tu comentario.');
        }
    };

    const handleReplySubmit = async (commentId: number) => {
        if (!appUser || !project) {
            alert('Debes iniciar sesión para responder.');
            return;
        }
        if (!replyContent.trim()) return;

        try {
            await replyToComment(commentId, { content: replyContent, user_id: appUser.id, project_id: project.id, parent_comment_id: commentId });
            setReplyingTo(null);
            setReplyContent('');
            // Refetch comments
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await Promise.all(
                projectComments.map(async (comment: Comment) => {
                    const user = await getUser(comment.user_id);
                    return { ...comment, user };
                })
            );
            setComments(commentsWithUsers);
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
            alert('Hubo un error al enviar tu respuesta.');
        }
    };

    const handleRateProject = async (newRating: number) => {
        if (!appUser) {
            alert('Debes iniciar sesión para calificar.');
            return;
        }
        if (!project) return;

        try {
            if (userRating) {
                await updateRating(userRating.id, { ...userRating, value: newRating, updated_id: new Date().toISOString() });
            } else {
                await rateProject(project.id, { value: newRating, user_id: appUser.id, project_id: project.id });
            }
            setRating(newRating);

            // Refetch ratings and recalculate average
            const ratings = await getProjectRatings(project.id);
            const averageRating = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratings.length;
            const ratingCount = ratings.length;

            setProject({ ...project, average_rating: averageRating, rating_count: ratingCount });

        } catch (error) {
            console.error('Error al calificar el proyecto:', error);
            alert('Hubo un error al procesar tu calificación.');
        }
    };

    useEffect(() => {
        if (!projectId) return;

        async function fetchData() {
            setLoading(true);
            try {
                const proj = await getProject(projectId);
                const allImages = [proj.portrait, ...proj.images].filter(Boolean);

                const ratings = await getProjectRatings(projectId);
                const averageRating = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratings.length;
                const ratingCount = ratings.length;

                setProject({ ...proj, images: allImages, average_rating: averageRating, rating_count: ratingCount });

                if (proj.owner) {
                    const user = await getUser(proj.owner);
                    setAuthor(user);
                }

                const projectComments = await listProjectComments(projectId);
                const commentsWithUsers = await Promise.all(
                    projectComments.map(async (comment: Comment) => {
                        const user = await getUser(comment.user_id);
                        return { ...comment, user };
                    })
                );
                setComments(commentsWithUsers);
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
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 cursor-pointer transition-colors ${
                                                    (hoverRating || rating || Math.round(project.average_rating)) >= i
                                                        ? 'fill-[#c1835a] text-[#c1835a]'
                                                        : 'text-gray-300'
                                                }`}
                                                onClick={() => handleRateProject(i)}
                                                onMouseEnter={() => setHoverRating(i)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            />
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
                                            <AvatarImage src={author.profile_picture ? `/pfp/${author.profile_picture}.png` : '/placeholder.svg'} />
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

                            <Button
                                className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-6 text-md font-semibold rounded-xl"
                                onClick={() => window.open(project.tutorial, '_blank')}
                                disabled={!project.tutorial}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                {project.tutorial ? 'Descargar Planos' : 'Planos no disponibles'}
                            </Button>
                        </div>
                    </div>

                    {/* Sección de Comentarios */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-[#3b3535] mb-4">Comentarios</h3>
                        {appUser && (
                            <div className="mb-6">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c1835a] focus:border-transparent transition"
                                    rows={3}
                                    placeholder="Escribe tu comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button
                                    className="mt-2 bg-[#656b48] hover:bg-[#3b3535] text-white font-semibold rounded-lg"
                                    onClick={handleCommentSubmit}
                                >
                                    Comentar
                                </Button>
                            </div>
                        )}
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id}>
                                    <div className="flex space-x-4">
                                        <Avatar>
                                            <AvatarImage src={comment.user?.profile_picture ? `/pfp/${comment.user.profile_picture}.png` : '/placeholder.svg'} />
                                            <AvatarFallback>{comment.user?.username[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-[#3b3535]">{comment.user?.username}</p>
                                                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-700">{comment.content}</p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)}>Responder</Button>
                                            </div>
                                        </div>
                                    </div>
                                    {replyingTo === comment.id && (
                                        <div className="ml-14 mt-4">
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                rows={2}
                                                placeholder={`Respondiendo a ${comment.user?.username}...`}
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                            />
                                            <Button className="mt-2" size="sm" onClick={() => handleReplySubmit(comment.id)}>Enviar Respuesta</Button>
                                        </div>
                                    )}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="ml-14 mt-4 space-y-4">
                                            {comment.replies.map(reply => (
                                                <div key={reply.id} className="flex space-x-4">
                                                    <Avatar>
                                                        <AvatarImage src={reply.user?.profile_picture ? `/pfp/${reply.user.profile_picture}.png` : '/placeholder.svg'} />
                                                        <AvatarFallback>{reply.user?.username[0]?.toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold text-[#3b3535]">{reply.user?.username}</p>
                                                            <span className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-gray-700">{reply.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
