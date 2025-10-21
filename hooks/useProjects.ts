

// hooks/useProjects.ts
import { useState, useEffect, useMemo } from 'react';
import { Project } from '@/models/project';
import { ProjectWithUser } from '@/models/project-with-user';
import { searchProjects } from '@/app/services/projects';
import { getUser } from '@/app/services/users';
import { getProjectRatings } from '@/app/services/ratings';
import { Rating } from '@/models/rating';

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
                const projectsWithData = await Promise.all(
                    publicProjects.map(async (project: Project) => {
                        const user = await getUser(project.owner);
                        const ratings = await getProjectRatings(project.id);
                        const averageRating = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0) / ratings.length;
                        const ratingCount = ratings.length;
                        return { ...project, owner: user, average_rating: averageRating, rating_count: ratingCount };
                    })
                );
                setAllPublicProjects(projectsWithData);
            } catch (err) {
                console.error(err);
                setError('Error cargando proyectos');
            } finally {
                setLoading(false);
            }
        };
        fetchAllProjects();
    }, []);

    const filteredProjects = useMemo(() => {
        return allPublicProjects.filter(project => {
            const searchMatch = searchTerm === '' ||
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase());

            const filterMatch = Object.entries(activeFilters).every(([key, value]) => {
                if (!value) return true;
                // ✅ Lógica de filtro actualizada para los nuevos campos
                if (key === 'style') return project.style?.includes(value);
                if (key === 'material') return project.materials?.includes(value);
                // (Se puede añadir filtro por 'time_to_build' o 'average_rating' si se desea)
                return true;
            });
            return searchMatch && filterMatch;
        });
    }, [allPublicProjects, searchTerm, activeFilters]);

    const filterOptions = useMemo(() => {
        // ✅ Opciones de filtro actualizadas
        const styles = [...new Set(allPublicProjects.flatMap(p => p.style).filter(Boolean))];
        const materials = [...new Set(allPublicProjects.flatMap(p => p.materials).filter(Boolean))];
        return { styles, materials };
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
    };
}
