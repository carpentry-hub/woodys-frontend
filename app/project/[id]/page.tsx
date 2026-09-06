'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, Star, Clock, Wrench, Loader2, Home, Palette, CheckSquare, Edit, Trash2, Heart, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ProductGallery } from '@/components/product-gallery';
import { ResponsiveHeader } from '@/components/responsive-header';
import { Project } from '@/models/project';
import { User } from '@/models/user';
import { deleteProject, getProject } from '../../services/projects';
import { getUser, getUserByFirebaseUid, getUserProjects, getUserProfilePictureUrl } from '../../services/users';
import { rateProject, getProjectRatings, updateRating } from '../../services/ratings';
import { listProjectComments, commentProject, replyToComment, deleteComment, createCommentLike, getCommentLikes, getUserCommentLike, updateCommentLike, deleteCommentLike } from '../../services/comments';
import { useAuthContext } from '@/contexts/AuthContext';
import DOMPurify from 'dompurify';
import { Comment, CommentLike, CommentLikeCounts, CommentWithUser } from '@/models/comment';
import { Rating } from '@/models/rating';
import SaveToListModal from '@/components/save-to-list-modal';
import Link from 'next/link'; // <--- IMPORTANTE: Importamos Link

// --- Componente Individual de Comentario ---
function CommentItem({ 
    comment, 
    replyingTo, 
    setReplyingTo, 
    replyContent, 
    setReplyContent, 
    handleReplySubmit,
    handleDeleteComment,
    currentUserId,
    depth,
    projectOwnerId,
    getLikeCounts,
    getUserLike,
    handleCommentLike
}: { 
    comment: CommentWithUser; 
    replyingTo: number | null; 
    setReplyingTo: (id: number | null) => void; 
    replyContent: string; 
    setReplyContent: (content: string) => void; 
    handleReplySubmit: (id: number) => void;
    handleDeleteComment: (id: number) => Promise<void>;
    currentUserId: number | null;
    depth: number;
    projectOwnerId: number;
    getLikeCounts: (commentId: number) => CommentLikeCounts;
    getUserLike: (commentId: number) => CommentLike | null;
    handleCommentLike: (commentId: number, value: 'like' | 'dislike') => Promise<void>;
}) {
    const indentLevel = Math.min(depth * 6, 24);
    const indentStyle = depth > 0 ? { marginLeft: `${indentLevel * 4}px` } : {};
    const borderClass = depth > 0 ? 'border-l-2 border-gray-200 pl-4' : '';
    
    const isAuthor = comment.user_id === projectOwnerId;
    const isCommentOwner = currentUserId !== null && comment.user_id === currentUserId;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDeleted = comment.content === 'Comentario Eliminado';
    const likeCounts = getLikeCounts(comment.id);
    const userLike = getUserLike(comment.id);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
        });
    };

    return (
        <div className={`py-4 ${borderClass}`} style={indentStyle}>
            <div className="flex space-x-4">
                {/* --- ENLACE AL PERFIL EN EL AVATAR DEL COMENTARIO --- */}
                <Link href={`/profile/${comment.user_id}`}>
                    <Avatar className={`w-10 h-10 cursor-pointer transition-opacity hover:opacity-80 ${isAuthor ? 'border-2 border-[#c1835a]' : ''}`}>
                        <AvatarImage src={comment.user?.profile_picture_url || undefined} />
                        <AvatarFallback className="bg-[#f2f0eb] text-[#3b3535]">
                            {comment.user?.username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                    </Avatar>
                </Link>

                <div className="flex-1">
                    <div className={`p-4 rounded-2xl rounded-tl-none border shadow-sm ${isDeleted ? 'bg-gray-100 border-gray-200' : isAuthor ? 'bg-[#c1835a]/5 border-[#c1835a]/20' : 'bg-white/60 border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                {/* --- ENLACE AL PERFIL EN EL NOMBRE DEL COMENTARIO --- */}
                                <Link href={`/profile/${comment.user_id}`} className="font-bold text-[#3b3535] text-sm hover:text-[#c1835a] hover:underline">
                                    {comment.user?.username}
                                </Link>
                                
                                {isAuthor && (
                                    <Badge variant="secondary" className="bg-[#c1835a] text-white hover:bg-[#a06d4b] text-[10px] h-5 px-1.5 font-medium border-none">
                                        Autor
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                                {isCommentOwner && !isDeleted && (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-[#3b3535]"
                                            onClick={() => setIsMenuOpen(open => !open)}
                                            aria-label="Opciones del comentario"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                        {isMenuOpen && (
                                            <div className="absolute right-0 top-8 z-20 min-w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                                                <button
                                                    type="button"
                                                    className="w-full rounded-md px-3 py-2 text-left text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    disabled={isDeleting}
                                                    onClick={async () => {
                                                        setIsDeleting(true);
                                                        try {
                                                            await handleDeleteComment(comment.id);
                                                            setIsMenuOpen(false);
                                                        } finally {
                                                            setIsDeleting(false);
                                                        }
                                                    }}
                                                >
                                                    {isDeleting ? 'Eliminando...' : 'Eliminar comentario'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isDeleted ? 'italic text-gray-500' : 'text-gray-700'}`}>{comment.content}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2 pl-2">
                        <button
                            className="text-xs font-medium text-gray-500 hover:text-[#c1835a] transition-colors"
                            onClick={() => setReplyingTo(comment.id)}
                        >
                            Responder
                        </button>
                        {!isDeleted && (
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition ${userLike?.value === true ? 'bg-[#656b48]/15 text-[#656b48]' : 'text-gray-400 hover:bg-gray-100 hover:text-[#656b48]'}`}
                                    onClick={() => handleCommentLike(comment.id, 'like')}
                                    aria-label="Me gusta"
                                >
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    <span>{likeCounts.likes}</span>
                                </button>
                                <button
                                    type="button"
                                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs transition ${userLike?.value === false ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'}`}
                                    onClick={() => handleCommentLike(comment.id, 'dislike')}
                                    aria-label="No me gusta"
                                >
                                    <ThumbsDown className="h-3.5 w-3.5" />
                                    <span>{likeCounts.dislikes}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {replyingTo === comment.id && (
                <div className="ml-14 mt-4 bg-white p-4 rounded-xl border border-[#c89c6b]/30 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <textarea
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c1835a] focus:border-transparent text-sm resize-none"
                        rows={3}
                        placeholder={`Respondiendo a ${comment.user?.username}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-3">
                        <Button variant="ghost" size="sm" onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                        }}>Cancelar</Button>
                        <Button className="bg-[#656b48] hover:bg-[#3b3535] text-white" size="sm" onClick={() => handleReplySubmit(comment.id)}>
                            Responder
                        </Button>
                    </div>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            handleReplySubmit={handleReplySubmit}
                            handleDeleteComment={handleDeleteComment}
                            getLikeCounts={getLikeCounts}
                            getUserLike={getUserLike}
                            handleCommentLike={handleCommentLike}
                            currentUserId={currentUserId}
                            depth={depth + 1}
                            projectOwnerId={projectOwnerId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = Number(params?.id);
    const [project, setProject] = useState<Project | null>(null);
    const [author, setAuthor] = useState<(User & { profile_picture_url?: string | null }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const { user } = useAuthContext();
    const [appUser, setAppUser] = useState<User | null>(null);
    const [userRating, setUserRating] = useState<Rating | null>(null);
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentLikeCounts, setCommentLikeCounts] = useState<Record<number, CommentLikeCounts>>({});
    const [userCommentLikes, setUserCommentLikes] = useState<Record<number, CommentLike | null>>({});
    const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [calculatedReputation, setCalculatedReputation] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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
            const userData = await getUser(comment.user_id);
            
            let profilePicUrl: string | null = null;
            if (userData.profile_picture && userData.profile_picture > 1) {
                try {
                    profilePicUrl = await getUserProfilePictureUrl(userData.profile_picture);
                } catch (e) {
                    console.error('Error loading pfp for comment', e);
                }
            }
            
            const userWithPic = { ...userData, profile_picture_url: profilePicUrl };

            const replies = repliesMap.get(comment.id) || [];
            const repliesWithUsers = await Promise.all(
                replies.map(reply => buildTree(reply))
            );
            return { ...comment, user: userWithPic, replies: repliesWithUsers };
        };
        
        return Promise.all(topLevelComments.map(comment => buildTree(comment)));
    };

    const flattenComments = (items: CommentWithUser[]): CommentWithUser[] =>
        items.flatMap(comment => [comment, ...(comment.replies ? flattenComments(comment.replies) : [])]);

    useEffect(() => {
        if (comments.length === 0) {
            setCommentLikeCounts({});
            setUserCommentLikes({});
            return;
        }

        const loadCommentLikes = async () => {
            try {
                const allComments = flattenComments(comments);
                const results = await Promise.all(allComments.map(async comment => {
                    const [counts, userLike] = await Promise.all([
                        getCommentLikes(comment.id),
                        appUser ? getUserCommentLike(comment.id, appUser.id) : Promise.resolve(null),
                    ]);
                    return { id: comment.id, counts, userLike };
                }));

                setCommentLikeCounts(Object.fromEntries(results.map(result => [result.id, result.counts])));
                setUserCommentLikes(Object.fromEntries(results.map(result => [result.id, result.userLike])));
            } catch (error) {
                console.error('Error cargando valoraciones de comentarios:', error);
            }
        };

        loadCommentLikes();
    }, [comments, appUser]);

    const handleCommentLike = async (commentId: number, value: 'like' | 'dislike') => {
        if (!appUser) {
            alert('Debes iniciar sesión para valorar un comentario.');
            return;
        }

        if (likingCommentId === commentId) return;
        setLikingCommentId(commentId);

        try {
            const existingLike = userCommentLikes[commentId] || null;
            const nextValue = value === 'like';
            if (!existingLike) {
                await createCommentLike(commentId, appUser.id, value);
            } else if (existingLike.value === nextValue) {
                await deleteCommentLike(existingLike.id);
            } else {
                await updateCommentLike(existingLike.id, value);
            }

            const [counts, userLike] = await Promise.all([
                getCommentLikes(commentId),
                getUserCommentLike(commentId, appUser.id),
            ]);
            setCommentLikeCounts(previous => ({ ...previous, [commentId]: counts }));
            setUserCommentLikes(previous => ({ ...previous, [commentId]: userLike }));
        } catch (error) {
            console.error('Error actualizando valoración del comentario:', error);
            alert('No se pudo actualizar tu valoración. Inténtalo nuevamente.');
        } finally {
            setLikingCommentId(null);
        }
    };

    const handleCommentSubmit = async () => {
        if (!appUser || !project) {
            alert('Debes iniciar sesión para comentar.');
            return;
        }
        if (!newComment.trim()) return;

        try {
            await commentProject(project.id, { 
                content: newComment, 
                user_id: appUser.id, 
                project_id: project.id 
            });
            
            setNewComment('');
            
            setCommentsLoading(true);
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await buildCommentTree(projectComments);
            setComments(commentsWithUsers);
            setCommentsLoading(false);
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            setCommentsLoading(false);
            alert('Hubo un error al enviar tu comentario.');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!project) return;

        try {
            await deleteComment(commentId);
            setCommentsLoading(true);
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await buildCommentTree(projectComments);
            setComments(commentsWithUsers);
            setCommentsLoading(false);
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            setCommentsLoading(false);
            alert('No se pudo eliminar el comentario. Inténtalo nuevamente.');
            throw error;
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
            setCommentsLoading(true);
            const projectComments = await listProjectComments(project.id);
            const commentsWithUsers = await buildCommentTree(projectComments);
            setComments(commentsWithUsers);
            setCommentsLoading(false);
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
            setCommentsLoading(false);
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
                await updateRating(project.id, userRating.id, { 
                    value: newRating, 
                    updated_id: new Date().toISOString(),
                    user_id: appUser.id 
                });
            } else {
                try {
                    if (!appUser.id || !project.id) throw new Error('Invalid user or project ID');
                    await rateProject(project.id, { 
                        value: newRating, 
                        user_id: appUser.id, 
                        project_id: project.id,
                        id: 0, 
                        updated_id: ''
                    });
                } catch (error: any) {
                    if (error.message === 'RATING_EXISTS') {
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

            const ratings = await getProjectRatings(project.id);
            const averageRating = ratings.length > 0 
                ? ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratings.length 
                : 0;
            const ratingCount = ratings.length;

            const updatedUserRating = ratings.find(r => r.user_id === appUser.id);
            setUserRating(updatedUserRating || null);

            setProject({ ...project, average_rating: averageRating, rating_count: ratingCount });
            
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
                            setCalculatedReputation(totalRating / allRatings.length);
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
                
                const processedProject = {
                    ...proj,
                    height: typeof proj.height === 'string' ? parseFloat(proj.height) : (proj.height ?? 0),
                    length: typeof proj.length === 'string' ? parseFloat(proj.length) : (proj.length ?? 0),
                    width: typeof proj.width === 'string' ? parseFloat(proj.width) : (proj.width ?? 0),
                };
                
                const allImages = [processedProject.portrait, ...processedProject.images].filter(Boolean);
                setProject({
                    ...processedProject,
                    images: allImages,
                    average_rating: processedProject.average_rating ?? 0,
                    rating_count: processedProject.rating_count ?? 0
                });
                setLoading(false);

                const ratingsPromise = getProjectRatings(projectId);
                const commentsPromise = listProjectComments(projectId);
                const authorPromise = processedProject.owner
                    ? getUser(processedProject.owner)
                    : Promise.resolve(null);

                const [ratingsResult, projectComments, user] = await Promise.all([
                    ratingsPromise,
                    commentsPromise,
                    authorPromise
                ]);

                const averageRating = ratingsResult.length > 0
                    ? ratingsResult.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratingsResult.length
                    : 0;
                setProject(currentProject => currentProject
                    ? { ...currentProject, average_rating: averageRating, rating_count: ratingsResult.length }
                    : currentProject);

                if (user) {
                    const authorPicUrl = user.profile_picture && user.profile_picture > 1
                        ? await getUserProfilePictureUrl(user.profile_picture)
                        : null;
                    setAuthor({ ...user, profile_picture_url: authorPicUrl });

                    getUserProjects(user.id)
                        .then(async userProjects => {
                            const projectRatings = await Promise.all(
                                userProjects.map(userProject =>
                                    getProjectRatings(userProject.id).catch(error => {
                                        console.error('Error fetching ratings:', error);
                                        return [];
                                    })
                                )
                            );
                            const allRatings = projectRatings.flat();
                            const totalRating = allRatings.reduce((acc, rating) => acc + rating.value, 0);
                            setCalculatedReputation(allRatings.length > 0 ? totalRating / allRatings.length : 0);
                        })
                        .catch(() => setCalculatedReputation(null));
                }

                const commentsWithUsers = await buildCommentTree(projectComments);
                setComments(commentsWithUsers);
                setCommentsLoading(false);
            } catch (error) {
                console.error('Error cargando datos:', error);
                setCommentsLoading(false);
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

    if (!project) return <div className="min-h-screen bg-[#f2f0eb] p-6 text-center"><h1 className="text-2xl font-bold mt-10">No encontrado</h1></div>;

    const cleanDescriptionHtml = typeof window !== 'undefined' && project?.description ? DOMPurify.sanitize(project.description) : '';
    const environmentValue = Array.isArray(project.environment) ? project.environment[0] || '' : project.environment || '';
    const formatDimension = (value: number | null | undefined): string => {
        if (value === null || value === undefined || isNaN(value)) return '0';
        return value % 1 === 0 ? value.toString() : value.toFixed(2);
    };
    const heightValue = formatDimension(project.height);
    const lengthValue = formatDimension(project.length);
    const widthValue = formatDimension(project.width);

    const handleEdit = () => project && router.push(`/create-project?edit=${project.id}`);
    const handleDelete = async () => {
        if (!project) return;
        if (window.confirm('¿Seguro que quieres eliminar?')) {
            setIsDeleting(true);
            setDeleteError(null);
            try {
                await deleteProject(project.id);
                router.push('/profile');
            } catch (err: any) {
                setDeleteError('Error al eliminar.');
            } finally {
                setIsDeleting(false);
            }
        }
    };
    const isOwner = appUser && project && appUser.id === project.owner;

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <h1 className="text-3xl font-bold text-[#3b3535]">{project.title}</h1>
                                {isOwner && (
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button variant="outline" onClick={handleEdit} className="bg-white/50"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
                                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {deleteError && <div className="text-red-500 text-sm mt-2">{deleteError}</div>}

                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center"><strong>Altura:</strong><span className="ml-1">{heightValue} cm</span></div>
                                    <div className="flex items-center"><strong>Largo:</strong><span className="ml-1">{lengthValue} cm</span></div>
                                    <div className="flex items-center"><strong>Ancho:</strong><span className="ml-1">{widthValue} cm</span></div>
                                    <div className="flex items-center"><strong>Material:</strong><span className="ml-1">{project.main_material || 'N/A'}</span></div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-2">Descripción</h3>
                                <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: cleanDescriptionHtml }} />
                            </div>

                            <ProductGallery images={project.images} productName={project.title} />

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white/50 min-h-[72px]">
                                    {project.rating_count > 0 ? (
                                        <span className="text-xl font-bold text-[#3b3535]">{project.average_rating?.toFixed(1)}</span>
                                    ) : (
                                        <span className="text-sm font-semibold text-gray-400">Sé el primero en puntuar</span>
                                    )}
                                    <div className="flex gap-1 ml-2 mr-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className={`w-5 h-5 cursor-pointer transition-colors ${(hoverRating || rating || Math.round(project.average_rating ?? 0)) >= i ? 'fill-[#c1835a] text-[#c1835a]' : 'text-gray-300'}`} onClick={() => handleRateProject(i)} onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)} />
                                        ))}
                                    </div>
                                    {project.rating_count > 0 && <span className="text-gray-500 text-sm">({project.rating_count})</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button className="w-full bg-white/80 hover:bg-white text-[#c1835a] border-2 border-[#c1835a] py-6 text-md font-semibold rounded-xl" onClick={() => appUser ? setIsSaveModalOpen(true) : alert('Inicia sesión para guardar.')}>
                                        <Heart className="w-5 h-5 mr-2" /> Guardar
                                    </Button>
                                    <Button
                                        asChild
                                        className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-6 text-md font-semibold rounded-xl"
                                    >
                                        <a
                                            href={project.tutorial || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-disabled={!project.tutorial}
                                            onClick={(event) => {
                                                if (!project.tutorial) event.preventDefault();
                                            }}
                                        >
                                            <Download className="w-5 h-5 mr-2" /> Descargar
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            {author && (
                                <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-3">Autor</h3>
                                    <div className="flex items-center space-x-3">
                                        {/* --- ENLACE AL PERFIL EN EL SIDEBAR DEL AUTOR --- */}
                                        <Link href={`/profile/${author.id}`}>
                                            <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity">
                                                <AvatarImage src={author.profile_picture_url || undefined} />
                                                <AvatarFallback className="bg-[#f2f0eb] text-[#3b3535]">
                                                    {author.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div>
                                            <Link href={`/profile/${author.id}`} className="font-semibold text-md text-[#3b3535] hover:text-[#c1835a] hover:underline">
                                                {author.username}
                                            </Link>
                                            <span className="text-sm text-gray-500 block">
                                                Reputación: {calculatedReputation !== null ? calculatedReputation.toFixed(1) : (author.reputation || 0).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center"><Palette className="w-4 h-4 mr-2"/> Estilos</h3>
                                <div className="flex flex-wrap gap-2">{project.style.map((s, i) => <Badge key={i} variant="secondary" className="bg-[#656b48]/20 text-[#3b3535]">{s}</Badge>)}</div>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center"><CheckSquare className="w-4 h-4 mr-2"/> Materiales</h3>
                                <div className="flex flex-wrap gap-2">{project.materials.map((m, i) => <Badge key={i} variant="secondary" className="bg-[#e4d5c5] text-[#9a6a49]">{m}</Badge>)}</div>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                <h3 className="text-lg font-semibold text-[#3b3535] mb-4 flex items-center"><Wrench className="w-4 h-4 mr-2"/> Herramientas</h3>
                                <div className="flex flex-wrap gap-2">{project.tools.map((t, i) => <Badge key={i} variant="secondary" className="bg-gray-200 text-gray-800">{t}</Badge>)}</div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-2 flex items-center"><Clock className="w-4 h-4 mr-2"/> Tiempo de armado</h3>
                                    <div className="flex items-center pl-6"><strong className="text-sm">{project.time_to_build} hs</strong></div>
                                </div>
                                <div className="border border-gray-200 rounded-xl p-4 bg-white/50">
                                    <h3 className="text-lg font-semibold text-[#3b3535] mb-2 flex items-center"><Home className="w-4 h-4 mr-2"/> Ambiente</h3>
                                    <div className="flex items-center pl-6"><strong className="text-sm">{environmentValue || 'N/A'}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 bg-white/50 mt-12">
                        <h3 className="text-2xl font-bold text-[#3b3535] mb-6">Comentarios ({comments.length})</h3>
                        
                        {appUser ? (
                            <div className="mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <textarea
                                    className="w-full p-3 border-none focus:ring-0 resize-none text-gray-700 placeholder:text-gray-400"
                                    rows={3}
                                    placeholder="¿Qué te parece este proyecto? Deja tu opinión..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="flex justify-end items-center mt-2 pt-2 border-t border-gray-100">
                                    <Button
                                        className="bg-[#656b48] hover:bg-[#3b3535] text-white font-semibold px-6"
                                        onClick={handleCommentSubmit}
                                        disabled={!newComment.trim()}
                                    >
                                        Publicar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 mb-8">
                                <p className="text-gray-600">Inicia sesión para unirte a la conversación.</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {commentsLoading ? (
                                <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#c1835a]" />
                                    Cargando comentarios...
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        replyingTo={replyingTo}
                                        setReplyingTo={setReplyingTo}
                                        replyContent={replyContent}
                                        setReplyContent={setReplyContent}
                                        handleReplySubmit={handleReplySubmit}
                                        handleDeleteComment={handleDeleteComment}
                                        getLikeCounts={(commentId) => commentLikeCounts[commentId] || { likes: 0, dislikes: 0 }}
                                        getUserLike={(commentId) => userCommentLikes[commentId] || null}
                                        handleCommentLike={handleCommentLike}
                                        currentUserId={appUser?.id ?? null}
                                        depth={0}
                                        projectOwnerId={project.owner}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">No hay comentarios aún. ¡Sé el primero!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isSaveModalOpen && (
                <SaveToListModal 
                    projectId={project.id} 
                    onClose={() => setIsSaveModalOpen(false)} 
                />
            )}
        </div>
    );
}