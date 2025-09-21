'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Filter, Clock, TrendingUp, Sparkles, ChevronRight, Heart, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FiltersPanel } from '@/components/filters-panel';
import { ResponsiveHeader } from '@/components/responsive-header';

const quickFilters = [
    { name: 'Principiante', count: '2.1K', active: false },
    { name: 'Menos de 5h', count: '1.8K', active: false },
    { name: 'Madera maciza', count: '3.2K', active: true },
    { name: 'Nórdico', count: '1.5K', active: false },
    { name: 'Sin herramientas eléctricas', count: '890', active: false },
];

const trendingProjects = [
    {
        id: 1,
        title: 'Mesa de Centro Flotante',
        author: 'Carlos Mendoza',
        avatar: 'CM',
        rating: 4.8,
        difficulty: 'Intermedio',
        time: '8 horas',
        downloads: '2.1K',
        views: '12.5K',
        image: '/placeholder.svg?height=300&width=300',
        trending: true,
        materials: ['Roble', 'Acero'],
        style: 'Moderno',
    },
    {
        id: 2,
        title: 'Estantería Modular Minimalista',
        author: 'Ana García',
        avatar: 'AG',
        rating: 4.9,
        difficulty: 'Principiante',
        time: '4 horas',
        downloads: '3.4K',
        views: '18.2K',
        image: '/placeholder.svg?height=300&width=300',
        trending: true,
        materials: ['Pino', 'MDF'],
        style: 'Minimalista',
    },
    {
        id: 3,
        title: 'Silla Ergonómica de Oficina',
        author: 'Miguel Torres',
        avatar: 'MT',
        rating: 4.7,
        difficulty: 'Avanzado',
        time: '15 horas',
        downloads: '1.8K',
        views: '9.3K',
        image: '/placeholder.svg?height=300&width=300',
        trending: true,
        materials: ['Fresno', 'Cuero'],
        style: 'Contemporáneo',
    },
];

const projectCategories = {
    japandi: {
        title: 'Estilo Japandi',
        subtitle: 'Simplicidad y funcionalidad en armonía',
        count: '1.2K proyectos',
        projects: [
            {
                id: 4,
                title: 'Biblioteca En Madera Maciza',
                author: 'Priscila Della Vecchia',
                avatar: 'PV',
                rating: 4.99,
                difficulty: 'Intermedio',
                time: '10 horas',
                downloads: '3.4K',
                views: '21.1K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Roble', 'Nogal'],
                style: 'Japandi',
            },
            {
                id: 5,
                title: 'Mesa de Comedor Zen',
                author: 'Kenji Nakamura',
                avatar: 'KN',
                rating: 4.85,
                difficulty: 'Avanzado',
                time: '20 horas',
                downloads: '2.1K',
                views: '15.7K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Bambú', 'Acero'],
                style: 'Japandi',
            },
            {
                id: 6,
                title: 'Banco Meditación Plegable',
                author: 'Sofia Chen',
                avatar: 'SC',
                rating: 4.92,
                difficulty: 'Principiante',
                time: '3 horas',
                downloads: '4.2K',
                views: '28.5K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Pino', 'Lino'],
                style: 'Japandi',
            },
            {
                id: 7,
                title: 'Organizador de Escritorio',
                author: 'Hiroshi Tanaka',
                avatar: 'HT',
                rating: 4.76,
                difficulty: 'Principiante',
                time: '2 horas',
                downloads: '5.8K',
                views: '32.4K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Bambú'],
                style: 'Japandi',
            },
        ],
    },
    vintage: {
        title: 'Estilo Vintage',
        subtitle: 'Nostalgia y carácter en cada pieza',
        count: '890 proyectos',
        projects: [
            {
                id: 8,
                title: 'Aparador Retro Años 60',
                author: 'Roberto Vintage',
                avatar: 'RV',
                rating: 4.88,
                difficulty: 'Avanzado',
                time: '25 horas',
                downloads: '1.9K',
                views: '11.2K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Teca', 'Latón'],
                style: 'Vintage',
            },
            {
                id: 9,
                title: 'Silla Windsor Clásica',
                author: 'Elena Rustic',
                avatar: 'ER',
                rating: 4.91,
                difficulty: 'Intermedio',
                time: '12 horas',
                downloads: '2.7K',
                views: '16.8K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Fresno', 'Roble'],
                style: 'Vintage',
            },
            {
                id: 10,
                title: 'Baúl de Almacenaje Antiguo',
                author: 'Pedro Clásico',
                avatar: 'PC',
                rating: 4.73,
                difficulty: 'Intermedio',
                time: '8 horas',
                downloads: '3.1K',
                views: '19.5K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Pino', 'Hierro'],
                style: 'Vintage',
            },
            {
                id: 11,
                title: 'Lámpara de Mesa Art Deco',
                author: 'Carmen Retro',
                avatar: 'CR',
                rating: 4.84,
                difficulty: 'Avanzado',
                time: '18 horas',
                downloads: '1.4K',
                views: '8.9K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Nogal', 'Bronce'],
                style: 'Vintage',
            },
        ],
    },
    outdoor: {
        title: 'Proyectos de Exterior',
        subtitle: 'Resistentes y perfectos para el aire libre',
        count: '650 proyectos',
        projects: [
            {
                id: 12,
                title: 'Deck Modular para Jardín',
                author: 'Luis Outdoor',
                avatar: 'LO',
                rating: 4.79,
                difficulty: 'Intermedio',
                time: '16 horas',
                downloads: '2.8K',
                views: '17.3K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Eucalipto', 'Acero inox'],
                style: 'Moderno',
            },
            {
                id: 13,
                title: 'Pérgola con Techo Retráctil',
                author: 'María Jardín',
                avatar: 'MJ',
                rating: 4.86,
                difficulty: 'Avanzado',
                time: '30 horas',
                downloads: '1.6K',
                views: '12.7K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Cedro', 'Lona'],
                style: 'Contemporáneo',
            },
            {
                id: 14,
                title: 'Banco de Jardín Curvo',
                author: 'Jorge Verde',
                avatar: 'JV',
                rating: 4.82,
                difficulty: 'Intermedio',
                time: '6 horas',
                downloads: '3.5K',
                views: '22.1K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Teca', 'Acero'],
                style: 'Orgánico',
            },
            {
                id: 15,
                title: 'Maceteros Escalonados',
                author: 'Isabella Natura',
                avatar: 'IN',
                rating: 4.75,
                difficulty: 'Principiante',
                time: '4 horas',
                downloads: '4.7K',
                views: '29.8K',
                image: '/placeholder.svg?height=300&width=300',
                materials: ['Pino tratado'],
                style: 'Rústico',
            },
        ],
    },
};

const newThisWeek = [
    {
        id: 16,
        title: 'Escritorio Gaming Ergonómico',
        author: 'Alex Tech',
        avatar: 'AT',
        rating: 4.95,
        difficulty: 'Intermedio',
        time: '14 horas',
        downloads: '890',
        views: '5.2K',
        image: '/placeholder.svg?height=200&width=200',
        isNew: true,
    },
    {
        id: 17,
        title: 'Cama Montessori Infantil',
        author: 'Laura Kids',
        avatar: 'LK',
        rating: 4.88,
        difficulty: 'Intermedio',
        time: '12 horas',
        downloads: '1.2K',
        views: '7.8K',
        image: '/placeholder.svg?height=200&width=200',
        isNew: true,
    },
    {
        id: 18,
        title: 'Bar Móvil para Terraza',
        author: 'Diego Party',
        avatar: 'DP',
        rating: 4.91,
        difficulty: 'Avanzado',
        time: '22 horas',
        downloads: '654',
        views: '4.1K',
        image: '/placeholder.svg?height=200&width=200',
        isNew: true,
    },
];

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
    case 'Principiante':
        return 'bg-green-100 text-green-800';
    case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
    case 'Avanzado':
        return 'bg-red-100 text-red-800';
    default:
        return 'bg-gray-100 text-gray-800';
    }
};

export default function ExplorerPage() {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [activeQuickFilter, setActiveQuickFilter] = useState('Madera maciza');

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            {/* Header */}
            <ResponsiveHeader />

            <div className="pt-4 sm:pt-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-4">Descubre tu próximo proyecto</h1>
                        <p className="text-lg sm:text-xl text-[#676765] mb-6 sm:mb-8 max-w-3xl mx-auto">
              Explora miles de proyectos creados por nuestra comunidad de makers. Filtra por dificultad, tiempo,
              materiales y encuentra el proyecto perfecto para ti.
                        </p>

                        {/* Main Search Bar */}
                        <div className="relative max-w-2xl mx-auto mb-8">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#adadad] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="¿Qué quieres construir hoy? Mesa, silla, biblioteca..."
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-full text-lg border border-[#f6f6f6] focus:outline-none focus:ring-2 focus:ring-[#c1835a] shadow-sm"
                            />
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4">
                            {quickFilters.map((filter) => (
                                <button
                                    key={filter.name}
                                    onClick={() => setActiveQuickFilter(filter.active ? '' : filter.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        filter.active || activeQuickFilter === filter.name
                                            ? 'bg-[#656b48] text-white'
                                            : 'bg-white text-[#3b3535] hover:bg-[#f6f6f6] border border-[#f6f6f6]'
                                    }`}
                                >
                                    {filter.name} <span className="text-xs opacity-75">({filter.count})</span>
                                </button>
                            ))}
                            <Button
                                onClick={() => setIsFiltersOpen(true)}
                                variant="outline"
                                className="px-4 py-2 rounded-full text-sm font-medium bg-white border-[#c1835a] text-[#c1835a] hover:bg-[#c1835a] hover:text-white"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                Más filtros
                            </Button>
                        </div>
                    </div>

                    {/* Trending Projects */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="w-6 h-6 text-[#c1835a]" />
                                <h2 className="text-3xl font-bold text-[#3b3535]">Trending ahora</h2>
                                <Badge className="bg-[#c1835a] text-white">🔥 Popular</Badge>
                            </div>
                            <button className="text-[#c1835a] font-medium hover:underline flex items-center space-x-1">
                                <span>Ver todos los trending</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                            {trendingProjects.map((project, index) => (
                                <Link key={project.id} href="/project" className="group">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <Image
                                                src={project.image || '/placeholder.svg'}
                                                alt={project.title}
                                                width={400}
                                                height={300}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-red-500 text-white text-xs">🔥 #{index + 1} Trending</Badge>
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Heart className="w-4 h-4 text-[#c1835a]" />
                                            </div>
                                            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{project.views}</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                                                    {project.difficulty}
                                                </Badge>
                                                <div className="flex items-center space-x-1 text-[#676765] text-sm">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{project.time}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-[#3b3535] mb-2 text-lg group-hover:text-[#c1835a] transition-colors">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="text-xl font-bold text-[#3b3535]">{project.rating}</span>
                                                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                                                <span className="text-sm text-[#676765]">• {project.downloads} descargas</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarFallback className="text-xs bg-[#f6f6f6]">{project.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-[#676765]">{project.author}</span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-[#c1835a] text-sm">
                                                    <Download className="w-3 h-3" />
                                                    <span>{project.downloads}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* New This Week */}
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <Sparkles className="w-6 h-6 text-[#656b48]" />
                                <h2 className="text-3xl font-bold text-[#3b3535]">Nuevos esta semana</h2>
                                <Badge className="bg-[#656b48] text-white">✨ Recién llegados</Badge>
                            </div>
                            <button className="text-[#c1835a] font-medium hover:underline flex items-center space-x-1">
                                <span>Ver todos los nuevos</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {newThisWeek.map((project) => (
                                <Link key={project.id} href="/project" className="group">
                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="aspect-[3/2] relative overflow-hidden">
                                            <Image
                                                src={project.image || '/placeholder.svg'}
                                                alt={project.title}
                                                width={300}
                                                height={200}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <Badge className="bg-[#656b48] text-white text-xs">✨ Nuevo</Badge>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-[#3b3535] mb-2 group-hover:text-[#c1835a] transition-colors">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-[#676765]">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="w-5 h-5">
                                                        <AvatarFallback className="text-xs">{project.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{project.author}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3 fill-[#c1835a] text-[#c1835a]" />
                                                    <span>{project.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Project Categories */}
                    {Object.entries(projectCategories).map(([key, category]) => (
                        <section key={key} className="mb-16">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#3b3535] mb-2">{category.title}</h2>
                                    <p className="text-[#676765] text-lg">{category.subtitle}</p>
                                    <p className="text-[#c1835a] text-sm font-medium">{category.count}</p>
                                </div>
                                <button className="text-[#c1835a] font-medium hover:underline flex items-center space-x-1">
                                    <span>Ver todos en {category.title}</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {category.projects.map((project) => (
                                    <Link key={project.id} href="/project" className="group">
                                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="aspect-square relative overflow-hidden">
                                                <Image
                                                    src={project.image || '/placeholder.svg'}
                                                    alt={project.title}
                                                    width={300}
                                                    height={300}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Heart className="w-4 h-4 text-[#c1835a]" />
                                                </div>
                                                <div className="absolute bottom-3 left-3">
                                                    <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                                                        {project.difficulty}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-[#3b3535] mb-2 text-sm group-hover:text-[#c1835a] transition-colors">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <span className="text-lg font-bold text-[#3b3535]">{project.rating}</span>
                                                    <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                                                    <span className="text-sm text-[#676765]">• {project.downloads}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="w-5 h-5">
                                                            <AvatarFallback className="text-xs bg-[#f6f6f6]">{project.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="text-xs text-[#676765]">
                                                            <div className="font-medium">{project.author}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-[#676765] text-xs">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{project.time}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {project.materials.slice(0, 2).map((material, index) => (
                                                        <Badge key={index} variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                                                            {material}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Call to Action */}
                    <section className="bg-gradient-to-r from-[#656b48] to-[#3b3535] rounded-2xl p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
                        <p className="text-xl mb-8 opacity-90">
              Únete a nuestra comunidad y comparte tu próximo proyecto con miles de makers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/my-projects">
                                <Button className="bg-white text-[#656b48] hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full">
                  Publicar mi proyecto
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-[#656b48] px-8 py-3 text-lg font-semibold rounded-full bg-transparent"
                            >
                Solicitar proyecto personalizado
                            </Button>
                        </div>
                    </section>
                </div>
            </div>

            {/* Filters Panel */}
            <FiltersPanel isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />
        </div>
    );
}
