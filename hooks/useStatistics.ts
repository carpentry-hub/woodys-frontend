'use client';

import { useState, useEffect } from 'react';
import { getSiteStats } from '@/app/services/stats';

export interface FormattedStats {
    projectCount: string;
    userCount: string;
    totalRatings: string;
    satisfactionRate: string;
}

export function useStatistics() {
    const [stats, setStats] = useState<FormattedStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSiteStats()
            .then(data => {
                setStats({
                    projectCount: data.projects_count.toLocaleString('es-ES'),
                    userCount: data.users_count.toLocaleString('es-ES'),
                    totalRatings: data.total_ratings.toLocaleString('es-ES'),
                    satisfactionRate: `${((data.average_rating / 5) * 100).toFixed(0)}%`
                });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading };
}