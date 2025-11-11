
'use client';

import { useEffect, useState, } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Star, Clock, Wrench, Loader2, Home, Palette, CheckSquare } from 'lucide-react';
import { ProductGallery } from '@/components/product-gallery';
import { ResponsiveHeader } from '@/components/responsive-header';
import { Project } from '@/models/project';
import { User } from '@/models/user';
import { getProject } from '../../services/projects';
import { getUser, getUserByFirebaseUid, getUserProjects } from '../../services/users';
import { rateProject, getProjectRatings, updateRating } from '../../services/ratings';
import { listProjectComments, commentProject, replyToComment } from '../../services/comments';
import { useAuthContext } from '@/contexts/AuthContext';
import DOMPurify from 'dompurify';
import { Comment, CommentWithUser } from '@/models/comment';
import { Rating } from '@/models/rating';


function CommentItem({ 
    comment, 
    replyingTo, 
    setReplyingTo, 
    replyContent, 
    setReplyContent, 
    handleReplySubmit,
    depth 
}: { 
    comment: CommentWithUser; 
    replyingTo: number | null; 
    setReplyingTo: (id: number | null) => void; 
    replyContent: string; 
    setReplyContent: (content: string) => void; 
    handleReplySubmit: (id: number) => void;
    depth: number;
}) {
    const indentLevel = Math.min(depth * 6, 24);
    const indentStyle = depth > 0 ? { marginLeft: `${indentLevel * 4}px` } : {};
    const borderClass = depth > 0 ? 'border-l-2 border-gray-200 pl-4' : '';

    return (
        <div className={borderClass} style={indentStyle}>
            <div className="flex space-x-4">
                <Avatar className="border-2 border-[#c1835a]">
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
                    <div className="flex gap-2 mt-2">
                        <Button className="bg-[#656b48] hover:bg-[#3b3535] text-white" size="sm" onClick={() => handleReplySubmit(comment.id)}>Enviar Respuesta</Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                        }}>Cancelar</Button>
                    </div>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            handleReplySubmit={handleReplySubmit}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

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
    const [calculatedReputation, setCalculatedReputation] = useState<number | null>(null);

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

    // Helper function to build comment tree structure
    const buildCommentTree = async (projectComments: Comment[]): Promise<CommentWithUser[]> => {
        const topLevelComments = projectComments.filter((comment: Comment) => 
            !comment.parent_comment_id || comment.parent_comment_id === 0
        );
        
        const repliesMap = new Map<number, Comment[]>();
        projectComments.forEach((comment: Comment) => {
            if (comment.parent_comment_id && comment.parent_comment_id !== 0) {
                const parentId = comment.parent_comment_id;
                if (!repliesMap.has(parentId)) {
                    repliesMap.set(parentId, []);
                }
                repliesMap.get(parentId)!.push(comment);
            }
        });
        
        const buildTree = async (comment: Comment): Promise<CommentWithUser> => {
            const user = await getUser(comment.user_id);
            const replies = repliesMap.get(comment.id) || [];
            const repliesWithUsers = await Promise.all(
                replies.map(reply => buildTree(reply))
            );
            return { ...comment, user, replies: repliesWithUsers };
        };
        
        return Promise.all(topLevelComments.map(comment => buildTree(comment)));
    };

    const handleCommentSubmit = async () => {
        if (!appUser || !project) {
            alert('Debes iniciar sesión para comentar.');
            return;
        }
        if (!newComment.trim()) return;

        try {
            await commentProject(project.id, { content: newComment, user_id: appUser.id, project_id: project.id });
            setNewComment('');
            // Refetch comments and rebuild tree
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await buildCommentTree(projectComments);
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
            // Refetch comments and rebuild tree
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await buildCommentTree(projectComments);
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
            // If user already has a rating, update it; otherwise create a new one
            if (userRating) {
                // Update existing rating - pass project ID, rating ID, and user ID
                await updateRating(project.id, userRating.id, { 
                    value: newRating, 
                    updated_id: new Date().toISOString(),
                    user_id: appUser.id 
                });
            } else {
                // Try to create new rating, but if it already exists (409), find and update it
                try {
                    // Ensure all IDs are valid numbers
                    if (!appUser.id || !project.id) {
                        throw new Error('Invalid user or project ID');
                    }
                    await rateProject(project.id, { 
                        value: newRating, 
                        user_id: appUser.id, 
                        project_id: project.id,
                        id: 0, // Not used but required by interface
                        updated_id: '' // Not used but required by interface
                    });
                } catch (error: any) {
                    if (error.message === 'RATING_EXISTS') {
                        // Rating already exists, fetch it and update
                        const ratings = await getProjectRatings(project.id);
                        const existingRating = ratings.find(r => r.user_id === appUser.id);
                        if (existingRating) {
                            await updateRating(project.id, existingRating.id, { 
                                value: newRating, 
                                updated_id: new Date().toISOString(),
                                user_id: appUser.id 
                            });
                        }
                    } else {
                        throw error;
                    }
                }
            }
            setRating(newRating);

            // Refetch ratings and recalculate average
            const ratings = await getProjectRatings(project.id);
            const averageRating = ratings.length > 0 
                ? ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratings.length 
                : 0;
            const ratingCount = ratings.length;

            // Update userRating state
            const updatedUserRating = ratings.find(r => r.user_id === appUser.id);
            setUserRating(updatedUserRating || null);

            setProject({ ...project, average_rating: averageRating, rating_count: ratingCount });
            
            // Recalculate author's reputation if author exists
            if (author) {
                try {
                    const userProjects = await getUserProjects(author.id);
                    if (userProjects.length > 0) {
                        const allRatings: Rating[] = [];
                        for (const userProject of userProjects) {
                            try {
                                const projectRatings = await getProjectRatings(userProject.id);
                                allRatings.push(...projectRatings);
                            } catch (error) {
                                console.error(`Error fetching ratings for project ${userProject.id}:`, error);
                            }
                        }
                        
                        if (allRatings.length > 0) {
                            const totalRating = allRatings.reduce((acc, rating) => acc + rating.value, 0);
                            const averageReputation = totalRating / allRatings.length;
                            setCalculatedReputation(averageReputation);
                        } else {
                            setCalculatedReputation(0);
                        }
                    } else {
                        setCalculatedReputation(0);
                    }
                } catch (error) {
                    console.error('Error recalculating reputation:', error);
                }
            }

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
                console.log('Raw project data from API:', proj);
                console.log('Dimensions:', { 
                    height: proj.height, 
                    length: proj.length, 
                    width: proj.width,
                    heightType: typeof proj.height,
                    lengthType: typeof proj.length,
                    widthType: typeof proj.width
                });
                
                // Ensure dimensions are numbers, not strings
                const processedProject = {
                    ...proj,
                    height: typeof proj.height === 'string' ? parseFloat(proj.height) : (proj.height ?? 0),
                    length: typeof proj.length === 'string' ? parseFloat(proj.length) : (proj.length ?? 0),
                    width: typeof proj.width === 'string' ? parseFloat(proj.width) : (proj.width ?? 0),
                };
                
                const allImages = [processedProject.portrait, ...processedProject.images].filter(Boolean);

                const ratings = await getProjectRatings(projectId);
                const averageRating = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratings.length;
                const ratingCount = ratings.length;

                setProject({ ...processedProject, images: allImages, average_rating: averageRating, rating_count: ratingCount });

                if (processedProject.owner) {
                    const user = await getUser(processedProject.owner);
                    setAuthor(user);
                    
                    // Calculate reputation based on average rating of all user's projects
                    try {
                        const userProjects = await getUserProjects(user.id);
                        if (userProjects.length > 0) {
                            // Get all ratings for all user's projects
                            const allRatings: Rating[] = [];
                            for (const userProject of userProjects) {
                                try {
                                    const projectRatings = await getProjectRatings(userProject.id);
                                    allRatings.push(...projectRatings);
                                } catch (error) {
                                    console.error(`Error fetching ratings for project ${userProject.id}:`, error);
                                }
                            }
                            
                            // Calculate average rating
                            if (allRatings.length > 0) {
                                const totalRating = allRatings.reduce((acc, rating) => acc + rating.value, 0);
                                const averageReputation = totalRating / allRatings.length;
                                setCalculatedReputation(averageReputation);
                            } else {
                                setCalculatedReputation(0);
                            }
                        } else {
                            setCalculatedReputation(0);
                        }
                    } catch (error) {
                        console.error('Error calculating reputation:', error);
                        setCalculatedReputation(null);
                    }
                }

                const projectComments = await listProjectComments(projectId);
                const commentsWithUsers = await buildCommentTree(projectComments);
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

    // Handle environment - it might be an array from the backend
    const environmentValue = Array.isArray(project.environment) 
        ? project.environment[0] || '' 
        : project.environment || '';

    // Format dimensions - handle null, undefined, and ensure proper number formatting
    const formatDimension = (value: number | null | undefined): string => {
        if (value === null || value === undefined || isNaN(value)) {
            return '0';
        }
        // Remove unnecessary decimal places if it's a whole number
        return value % 1 === 0 ? value.toString() : value.toFixed(2);
    };

    const heightValue = formatDimension(project.height);
    const lengthValue = formatDimension(project.length);
    const widthValue = formatDimension(project.width);

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-3 space-y-6">
                            <h1 className="text-3xl font-bold text-[#3b3535]">{project.title}</h1>

                            {/* Dimensiones y Material Principal */}
                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center"><strong>Altura:</strong><span className="ml-1">{heightValue} cm</span></div>
                                    <div className="flex items-center"><strong>Largo:</strong><span className="ml-1">{lengthValue} cm</span></div>
                                    <div className="flex items-center"><strong>Ancho:</strong><span className="ml-1">{widthValue} cm</span></div>
                                    <div className="flex items-center"><strong>Material:</strong><span className="ml-1">{project.main_material || 'N/A'}</span></div>
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

                            {/* Galería de Imágenes */}
                            <ProductGallery images={project.images} productName={project.title} />

                            {/* Rating y Botón de Descarga */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Calificación */}
                                <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white/50">
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

                                {/* Botón de Descarga */}
                                <Button
                                    className="bg-[#656b48] hover:bg-[#3b3535] text-white py-6 text-md font-semibold rounded-xl px-8"
                                    onClick={() => window.open(project.tutorial, '_blank')}
                                    disabled={!project.tutorial}
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    {project.tutorial ? 'Descargar Planos' : 'Planos no disponibles'}
                                </Button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
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
                                            <span className="text-sm text-gray-500">
                        Reputación: {calculatedReputation !== null 
                                                    ? calculatedReputation.toFixed(1) 
                                                    : (author.reputation || 0).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center">
                                    <Palette className="w-4 h-4 mr-2 text-[#3b3535]"/> Estilos
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.style.map((s, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="bg-[#656b48]/20 text-[#3b3535] border border-[#656b48]/30 text-sm font-medium px-3 py-1 shadow-sm"
                                        >
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center">
                                    <CheckSquare className="w-4 h-4 mr-2 text-[#3b3535]"/> Materiales
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.materials.map((m, i) => (
                                        <Badge key={i} variant="secondary" className="bg-[#e4d5c5] text-[#9a6a49] text-sm font-medium px-3 py-1 shadow-sm">{m}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center">
                                    <Wrench className="w-4 h-4 mr-2 text-[#3b3535]"/> Herramientas
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tools.map((t, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="bg-gray-200 text-gray-800 border border-gray-300 text-sm font-medium px-3 py-1 shadow-sm"
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-2 flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-[#3b3535]"/>
                Tiempo de armado
                                    </h3>
                                    <div className="flex items-center pl-6">
                                        <strong className="text-sm">{project.time_to_build} hs</strong>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-2 flex items-center">
                                        <Home className="w-4 h-4 mr-2 text-[#3b3535]"/>
                Ambiente
                                    </h3>
                                    <div className="flex items-center pl-6">
                                        <strong className="text-sm">{environmentValue || 'N/A'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Comentarios */}
                    <div className="border border-gray-200 rounded-xl p-6 bg-white/50 mt-12">
                        <h3 className="text-2xl font-bold text-[#3b3535] mb-4">Comentarios</h3>
                        {appUser && (
                            <div className="mb-6">
                                <textarea
                                    className="w-full p-3 border border-[#c89c6b] rounded-lg focus:ring-2 focus:ring-[#c1835a] focus:border-transparent transition bg-white"
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
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    replyContent={replyContent}
                                    setReplyContent={setReplyContent}
                                    handleReplySubmit={handleReplySubmit}
                                    depth={0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

