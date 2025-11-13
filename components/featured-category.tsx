'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Project } from '@/models/project';
import { ProjectWithUser } from '@/models/project-with-user';
import { Rating } from '@/models/rating';
import { searchProjects } from '@/app/services/projects';
import { getUser, getUserProfilePictureUrl } from '@/app/services/users';
import { getProjectRatings } from '@/app/services/ratings';
import ProjectCard from '@/components/project-card'; // Importa tu ProjectCard real

interface FeaturedCategoryProps {
  title: string;
  filterKey: string;
  filterValue: string;
}


export default function FeaturedCategory({ 
    title, 
    filterKey, 
    filterValue, 
}: FeaturedCategoryProps) {
    
    const [projects, setProjects] = useState<ProjectWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const filters = { [filterKey]: filterValue };
                const data = await searchProjects('', filters);
                
                const publicProjects = data.filter(p => p.is_public).slice(0, 4); 

                const projectsWithData = await Promise.all(
                    publicProjects.map(async (project: Project) => {
                        const user = await getUser(project.owner);
                        const ratings = await getProjectRatings(project.id);
                        
                        const avg = ratings.reduce((acc: number, rating: Rating) => acc + rating.value, 0);
                        const averageRating = ratings.length > 0 ? avg / ratings.length : 0;
                        const ratingCount = ratings.length;

                        let profilePicUrl: string | null = null;
                        if (user.profile_picture && user.profile_picture > 1) {
                            profilePicUrl = await getUserProfilePictureUrl(user.profile_picture);
                        }
                        
                        const ownerWithPic = { ...user, profile_picture_url: profilePicUrl };

                        return { 
                            ...project, 
                            owner: ownerWithPic, 
                            average_rating: averageRating, 
                            rating_count: ratingCount 
                        } as ProjectWithUser;
                    })
                );
                setProjects(projectsWithData);
            } catch (err) {
                console.error(`Error fetching projects for ${title}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [filterKey, filterValue, title]);

    if (loading) {
        return (
            <section className="py-8 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#3b3535]">
                            {title}
                        </h2>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return null; // No mostrar la sección si no hay proyectos
    }

    return (
        <section className="sm:py-5 my-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center mb-6 sm:mb-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#656b48]">
                        {title}
                    </h2>
                    <Link
                        href={`/explorer?${filterKey}=${filterValue}`}
                        className="text-[#c1835a] font-medium hover:underline flex items-center space-x-1 text-sm sm:text-base"
                    >
                        <span>Ver todos</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}