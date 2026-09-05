

// hooks/useProjects.ts
import { useState, useEffect, useMemo } from 'react';
import { Project } from '@/models/project';
import { ProjectWithUser } from '@/models/project-with-user';
import { searchProjects } from '@/app/services/projects';
import { getUser, getUserProfilePictureUrl } from '@/app/services/users';
import { getProjectRatings } from '@/app/services/ratings';
import { listProjectComments } from '@/app/services/comments';
import { Rating } from '@/models/rating';

const timeRanges = [
    { value: '0-5', label: 'Hasta 5 horas', matches: (hours: number) => hours <= 5 },
    { value: '6-10', label: 'De 6 a 10 horas', matches: (hours: number) => hours >= 6 && hours <= 10 },
    { value: '11-20', label: 'De 11 a 20 horas', matches: (hours: number) => hours >= 11 && hours <= 20 },
    { value: '21-plus', label: 'Más de 20 horas', matches: (hours: number) => hours > 20 },
];

export function useProjects() {
    const [allPublicProjects, setAllPublicProjects] = useState<ProjectWithUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchAllProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchProjects('', {});
                const publicProjects = data.filter(p => p.is_public);
            const users = new Map<number, ReturnType<typeof getUser>>();
            const profilePictures = new Map<number, ReturnType<typeof getUserProfilePictureUrl>>();
            const projectsWithData = await Promise.all(
                publicProjects.map(async (project: Project) => {
                    let userPromise = users.get(project.owner);
                    if (!userPromise) {
                        userPromise = getUser(project.owner);
                        users.set(project.owner, userPromise);
                    }

                    const user = await userPromise;
                    let profilePictureUrl: string | null = null;

                    if (user.profile_picture && user.profile_picture > 1) {
                        let profilePicturePromise = profilePictures.get(user.profile_picture);
                        if (!profilePicturePromise) {
                            profilePicturePromise = getUserProfilePictureUrl(user.profile_picture);
                            profilePictures.set(user.profile_picture, profilePicturePromise);
                        }
                        profilePictureUrl = await profilePicturePromise;
                    }

                    return {
                        ...project,
                        owner: { ...user, profile_picture_url: profilePictureUrl || undefined },
                        average_rating: project.average_rating ?? 0,
                        rating_count: project.rating_count ?? 0,
                        comments_count: 0
                    };
                })
            );
                setAllPublicProjects(projectsWithData);
            setLoading(false);

            // Las calificaciones no bloquean la primera renderización de las tarjetas.
            const ratingsByProject = await Promise.all(
                publicProjects.map(async project => {
                    try {
                        const ratings = await getProjectRatings(project.id);
                        const total = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0);
                        return {
                            id: project.id,
                            averageRating: ratings.length > 0 ? total / ratings.length : 0,
                            ratingCount: ratings.length
                        };
                    } catch (ratingError) {
                        console.error(`Error cargando calificaciones del proyecto ${project.id}:`, ratingError);
                        return null;
                    }
                })
            );

            setAllPublicProjects(currentProjects => currentProjects.map(project => {
                const ratingData = ratingsByProject.find(rating => rating?.id === project.id);
                return ratingData
                    ? {
                        ...project,
                        average_rating: ratingData.averageRating,
                        rating_count: ratingData.ratingCount
                    }
                    : project;
            }));

            const commentsByProject = await Promise.all(
                publicProjects.map(async project => {
                    try {
                        const comments = await listProjectComments(project.id);
                        return { id: project.id, count: comments.length };
                    } catch (commentsError) {
                        console.error(`Error cargando comentarios del proyecto ${project.id}:`, commentsError);
                        return null;
                    }
                })
            );

            setAllPublicProjects(currentProjects => currentProjects.map(project => {
                const commentData = commentsByProject.find(comment => comment?.id === project.id);
                return commentData ? { ...project, comments_count: commentData.count } : project;
            }));
            } catch (err) {
            console.error(err);
            setError('Error cargando proyectos');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProjects();
    }, []);

    const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'comments'>('recent');

    const filteredProjects = useMemo(() => {
        return allPublicProjects
            .filter(project => {
                const searchMatch = searchTerm === '' ||
                    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchTerm.toLowerCase());

                const filterMatch = Object.entries(activeFilters).every(([key, value]) => {
                    if (!value) return true;
                    // ✅ Lógica de filtro actualizada para los nuevos campos
                    if (key === 'style') return project.style?.includes(value);
                    if (key === 'material') return project.materials?.includes(value);
                    if (key === 'environment') {
                        const environment = Array.isArray(project.environment)
                            ? project.environment[0]
                            : project.environment;
                        return environment === value;
                    }
                    if (key === 'time') {
                        const timeRange = timeRanges.find(range => range.value === value);
                        return timeRange ? timeRange.matches(project.time_to_build) : true;
                    }
                    return true;
                });
                return searchMatch && filterMatch;
            })
            .sort((a, b) => {
                if (sortBy === 'rating') {
                    return (b.average_rating ?? 0) - (a.average_rating ?? 0);
                }
                if (sortBy === 'comments') {
                    return (b.comments_count ?? 0) - (a.comments_count ?? 0);
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
    }, [allPublicProjects, searchTerm, activeFilters, sortBy]);

    const filterOptions = useMemo(() => {
        // ✅ Opciones de filtro actualizadas
        const styles = [...new Set(allPublicProjects.flatMap(p => p.style).filter(Boolean))];
        const materials = [...new Set(allPublicProjects.flatMap(p => p.materials).filter(Boolean))];
        const environments = [...new Set(
            allPublicProjects
                .map(project => Array.isArray(project.environment) ? project.environment[0] : project.environment)
                .filter(Boolean)
        )];
        return { styles, materials, environments, timeRanges };
    }, [allPublicProjects]);

    const handleFilterChange = (category: string, value: string) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            if (!value) {
                delete newFilters[category];
            } else {
                newFilters[category] = value;
            }
            return newFilters;
        });
    };

    return {
        projects: filteredProjects,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        activeFilters,
        handleFilterChange,
        filterOptions,
        sortBy,
        setSortBy,
    };
}
