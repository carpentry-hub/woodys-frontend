'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Award, TrendingUp, Heart, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { ResponsiveHeader } from '@/components/responsive-header';
import CarouselSide from '@/components/carousel-side';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function LandingPage() {
    useAuth();
    // Animation hooks for each section
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [whyRef, whyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [creatorsRef, creatorsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div className="min-h-screen bg-[#f2f0eb]">
            <CarouselSide />
            <ResponsiveHeader />

            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="px-4 sm:px-6 py-8 sm:py-16 z-1 relative"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6">
                            <span className="text-[#3b3535]">Crea, </span>
                            <span className="text-[#c1835a]">Construí, </span>
                            <span className="text-[#656b48]">Disfrutá</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-[#676765] mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Unite a la comunidad de carpinteros más grande. Compartí tus proyectos, aprendé de otros
              y construí el futuro de la carpintería.
                        </p>
                        <div className="flex justify-center mb-8 sm:mb-12">
                            <Image
                                src="/logo.png"
                                alt="Woody's Workshop Logo"
                                width={200}
                                height={100}
                                priority
                            />
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
                        <Link href="/my-projects" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-[#656b48] hover:bg-[#3b3535] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Publica tu primer proyecto</span>
                                <ArrowRight className="w-5 h-5 hidden sm:block" />
                            </Button>
                        </Link>
                        <Link href="/explorer" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto border-[#c1835a] text-[#c1835a] hover:bg-[#c1835a] hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full bg-transparent"
                            >
                Explorar proyectos
                            </Button>
                        </Link>
                    </div>

                    {/* Community Stats */}
                    <motion.div
                        ref={statsRef}
                        initial={{ opacity: 0, y: 40 }}
                        animate={statsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16 px-4"
                    >
                        <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                            <div className="text-2xl sm:text-4xl font-bold text-[#c1835a] mb-1 sm:mb-2">12.5K+</div>
                            <div className="text-sm sm:text-base text-[#676765]">Proyectos</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                            <div className="text-2xl sm:text-4xl font-bold text-[#c1835a] mb-1 sm:mb-2">8.2K+</div>
                            <div className="text-sm sm:text-base text-[#676765]">Makers</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                            <div className="text-2xl sm:text-4xl font-bold text-[#c1835a] mb-1 sm:mb-2">45K+</div>
                            <div className="text-sm sm:text-base text-[#676765]">Descargas</div>
                        </div>
                        <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                            <div className="text-2xl sm:text-4xl font-bold text-[#c1835a] mb-1 sm:mb-2">98%</div>
                            <div className="text-sm sm:text-base text-[#676765]">Satisfacción</div>
                        </div>
                    </motion.div>

                    {/* Hero Image with Interactive Elements */}
                    <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-xl mb-12 sm:mb-16 mx-4 sm:mx-0">
                        {/* Imagen principal */}
                        <div className="relative w-full aspect-[3/1] max-h-[360px] overflow-hidden">
                            <Image
                                src="/landing/landing.png"
                                alt="Ambiente de comedor de madera"
                                fill
                                className="object-cover w-full h-full"
                                priority
                            />
                        </div>
                        {/* Hotspots interactivos */}
                        {/* Mesa pasillo */}
                        <div className="absolute left-[7%] top-[60%] flex flex-col items-center group">
                            <div className="mb-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs text-[#3b3535] font-medium shadow transition-all group-hover:bg-[#c1835a] group-hover:text-white">
                Mesa pasillo
                            </div>
                            <div className="w-0.5 h-8 bg-white/60 group-hover:bg-[#c1835a]" />
                            <button className="w-8 h-8 bg-white/80 border-2 border-white shadow-lg rounded-full flex items-center justify-center transition-all group-hover:bg-[#c1835a] group-hover:border-[#c1835a]">
                                <div className="w-3 h-3 bg-[#c1835a] rounded-full group-hover:bg-white transition-all"></div>
                            </button>
                        </div>
                        {/* Mesa comedor */}
                        <div className="absolute left-1/2 top-[32%] flex flex-col items-center group" style={{transform:'translateX(-50%)'}}>
                            <div className="mb-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs text-[#3b3535] font-medium shadow transition-all group-hover:bg-[#c1835a] group-hover:text-white">
                Mesa comedor
                            </div>
                            <div className="w-0.5 h-12 bg-white/60 group-hover:bg-[#c1835a]" />
                            <button className="w-8 h-8 bg-white/80 border-2 border-white shadow-lg rounded-full flex items-center justify-center transition-all group-hover:bg-[#c1835a] group-hover:border-[#c1835a]">
                                <div className="w-3 h-3 bg-[#c1835a] rounded-full group-hover:bg-white transition-all"></div>
                            </button>
                        </div>
                        {/* Silla cómoda */}
                        <div className="absolute right-[22%] top-[60%] flex flex-col items-center group">
                            <div className="mb-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs text-[#3b3535] font-medium shadow transition-all group-hover:bg-[#c1835a] group-hover:text-white">
                Silla cómoda
                            </div>
                            <div className="w-0.5 h-8 bg-white/60 group-hover:bg-[#c1835a]" />
                            <button className="w-8 h-8 bg-white/80 border-2 border-white shadow-lg rounded-full flex items-center justify-center transition-all group-hover:bg-[#c1835a] group-hover:border-[#c1835a]">
                                <div className="w-3 h-3 bg-[#c1835a] rounded-full group-hover:bg-white transition-all"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Why Publish Section */}
            <motion.section
                ref={whyRef}
                initial={{ opacity: 0, y: 40 }}
                animate={whyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="bg-white py-12 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-4">¿Por qué publicar tus proyectos?</h2>
                        <p className="text-lg sm:text-xl text-[#676765] max-w-3xl mx-auto">
              Comparte tu pasión por la carpintería y ayuda a otros makers mientras construyes tu reputación
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        <div className="text-center p-4 sm:p-6">
                            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#656b48] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-[#3b3535] mb-3">Construye tu comunidad</h3>
                            <p className="text-sm sm:text-base text-[#676765]">
                Conecta con otros carpinteros, recibe feedback valioso y forma parte de una comunidad apasionada
                            </p>
                        </div>

                        <div className="text-center p-4 sm:p-6">
                            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#c1835a] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-[#3b3535] mb-3">Gana reconocimiento</h3>
                            <p className="text-sm sm:text-base text-[#676765]">
                Obtén badges, mejora tu reputación y conviértete en un referente de la carpintería sustentable
                            </p>
                        </div>

                        <div className="text-center p-4 sm:p-6">
                            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#c89c6b] rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-[#3b3535] mb-3">Haz crecer tu negocio</h3>
                            <p className="text-sm sm:text-base text-[#676765]">
                Muestra tu trabajo, atrae clientes potenciales y monetiza tu experiencia en carpintería
                            </p>
                        </div>
                    </div>

                    <div className="text-center px-4">
                        <Link href="/my-projects">
                            <Button className="w-full sm:w-auto bg-[#656b48] hover:bg-[#3b3535] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Comenzar ahora - Es gratis</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* Featured Creators Section */}
            <motion.section
                ref={creatorsRef}
                initial={{ opacity: 0, y: 40 }}
                animate={creatorsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="py-12 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-4">Creadores destacados del mes</h2>
                        <p className="text-lg sm:text-xl text-[#676765]">
              Conoce a los makers que están inspirando a nuestra comunidad
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        {[
                            { name: 'Priscila Della Vecchia', projects: 24, followers: '1.2K', badge: 'Experta en Nórdico' },
                            { name: 'Carlos Mendoza', projects: 18, followers: '890', badge: 'Maestro Vintage' },
                            { name: 'Ana García', projects: 31, followers: '2.1K', badge: 'Innovadora Sustentable' },
                        ].map((creator, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 text-center shadow-sm">
                                <Avatar className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4">
                                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                                    <AvatarFallback className="text-lg sm:text-xl">
                                        {creator.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg sm:text-xl font-semibold text-[#3b3535] mb-2">{creator.name}</h3>
                                <Badge className="bg-[#656b48] text-white mb-3 text-xs sm:text-sm">{creator.badge}</Badge>
                                <div className="flex justify-center space-x-4 sm:space-x-6 text-sm">
                                    <div>
                                        <div className="font-semibold text-[#3b3535]">{creator.projects}</div>
                                        <div className="text-[#676765]">Proyectos</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#3b3535]">{creator.followers}</div>
                                        <div className="text-[#676765]">Seguidores</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center px-4">
                        <p className="text-base sm:text-lg text-[#676765] mb-4">¿Quieres ser el próximo creador destacado?</p>
                        <Link href="/my-projects">
                            <Button className="w-full sm:w-auto bg-[#c1835a] hover:bg-[#3b3535] text-white px-6 sm:px-8 py-3 rounded-full">
                Publica tu proyecto ahora
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* Projects Sections */}
            {['Estilo japandi', 'Estilo vintage'].map((sectionTitle, sectionIndex) => (
                <section key={sectionIndex} className="py-8 sm:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex justify-between items-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#3b3535]">{sectionTitle}</h2>
                            <Link
                                href="/explorer"
                                className="text-[#c1835a] font-medium hover:underline flex items-center space-x-1 text-sm sm:text-base"
                            >
                                <span>Ver todos</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[1, 2, 3, 4].map((projectIndex) => (
                                <Link key={projectIndex} href="/project" className="group">
                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <div className="aspect-square relative overflow-hidden">
                                            <Image
                                                src="/placeholder.svg?height=250&width=250"
                                                alt="Biblioteca En Madera Maciza"
                                                width={250}
                                                height={250}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Heart className="w-4 h-4 text-[#c1835a]" />
                                            </div>
                                        </div>
                                        <div className="p-3 sm:p-4">
                                            <h3 className="font-semibold text-[#3b3535] mb-2 text-sm sm:text-base">
                        Biblioteca En Madera Maciza
                                            </h3>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-base sm:text-lg font-bold text-[#3b3535]">4.99</span>
                                                <Star className="w-3 sm:w-4 h-3 sm:h-4 fill-[#c1835a] text-[#c1835a]" />
                                                <span className="text-xs sm:text-sm text-[#676765]">• 3.4K descargas</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="w-5 sm:w-6 h-5 sm:h-6">
                                                    <AvatarFallback className="text-xs">PV</AvatarFallback>
                                                </Avatar>
                                                <div className="text-xs text-[#676765]">
                                                    <div>Priscila Della Vecchia</div>
                                                    <div className="text-[#c1835a]">Ver workshop</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Final CTA Section */}
            <section className="bg-[#656b48] py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Listo para compartir tu próximo proyecto?</h2>
                    <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Únete a miles de carpinteros que ya están construyendo el futuro de la carpintería sustentable
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/my-projects" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-white text-[#656b48] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Publicar mi primer proyecto</span>
                            </Button>
                        </Link>
                        <Link href="/explorer" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#656b48] px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full bg-transparent"
                            >
                Ver proyectos destacados
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
