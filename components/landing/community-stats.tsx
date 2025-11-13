'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { StatCard } from './stat-card';
import { useStatistics } from '@/hooks/useStatistics';
import { FolderOpen, Users, Heart, Star, Loader2 } from 'lucide-react';

export function CommunityStats() {
    const { stats, loading: statsLoading } = useStatistics();
    const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16 px-4"
        >
            {statsLoading ? (
                <div className="col-span-2 lg:col-span-4 flex justify-center items-center p-6 bg-white rounded-lg shadow-sm">
                    <Loader2 className="w-8 h-8 text-[#c1835a] animate-spin" />
                </div>
            ) : stats ? (
                <>
                    <StatCard
                        icon={FolderOpen}
                        value={`${stats.projectCount}+`}
                        label="Proyectos"
                        iconBgColor="#656b481A"
                        iconColor="#656b48"
                    />
                    <StatCard
                        icon={Users}
                        value={`${stats.userCount}+`}
                        label="Makers"
                        iconBgColor="#c1835a1A"
                        iconColor="#c1835a"
                    />
                    <StatCard
                        icon={Heart}
                        value={`${stats.totalRatings}+`}
                        label="Valoraciones"
                        iconBgColor="#c89c6b1A"
                        iconColor="#c89c6b"
                    />
                    <StatCard
                        icon={Star}
                        value={stats.satisfactionRate}
                        label="Rating Promedio"
                        iconBgColor="#c1835a1A"
                        iconColor="#c1835a"
                    />
                </>
            ) : (
                <div className="col-span-2 lg:col-span-4 text-center p-6 bg-white rounded-lg shadow-sm">
                    <p className="text-[#676765]">No se pudieron cargar las estadísticas.</p>
                </div>
            )}
        </motion.div>
    );
}