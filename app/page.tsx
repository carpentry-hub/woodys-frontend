'use client';
import { Button } from '@/components/ui/button';
import { Plus, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ResponsiveHeader } from '@/components/responsive-header';
import CarouselSide from '@/components/carousel-side';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FeaturedCategory from '@/components/featured-category';
import { CommunityStats } from '@/components/landing/community-stats';
import LoginModal from '@/components/login-modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
    useAuth();
    const { user } = useAuth(); // <-- Cambia `useAuth()` por esto
    const router = useRouter(); // <-- Añade el router
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    // Animation hooks for each section
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [whyRef, whyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [creatorsRef, creatorsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [finalRef, finalInView] = useInView({ triggerOnce: true, threshold: 0.2 });

    const handleCreateProjectClick = () => {
        if (user) {
            router.push('/create-project');
        } else {
            setLoginModalOpen(true);
        }
    };

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
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
                        <Button 
                            className="w-full sm:w-auto bg-[#656b48] hover:bg-[#3b3535] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-2"
                            onClick={handleCreateProjectClick}
                        >
                            <Plus className="w-5 h-5" />
                            <span>Publica tu primer proyecto</span>
                            <ArrowRight className="w-5 h-5 hidden sm:block" />
                        </Button>
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
                    <CommunityStats />

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
                        <Link href="/project/10" className="absolute left-[7%] top-[60%] flex flex-col items-center group">
                            <div className="mb-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs text-[#3b3535] font-medium shadow transition-all group-hover:bg-[#c1835a] group-hover:text-white">
        Mesa pasillo
                            </div>
                            <div className="w-0.5 h-8 bg-white/60 group-hover:bg-[#c1835a]" />
                            <div className="w-8 h-8 bg-white/80 border-2 border-white shadow-lg rounded-full flex items-center justify-center transition-all group-hover:bg-[#c1835a] group-hover:border-[#c1835a]">
                                <div className="w-3 h-3 bg-[#c1835a] rounded-full group-hover:bg-white transition-all"></div>
                            </div>
                        </Link>
                        {/* Mesa comedor */}
                        <Link 
                            href="/project/12" 
                            className="absolute left-1/2 top-[32%] flex flex-col items-center group" 
                            style={{transform:'translateX(-50%)'}}
                        >
                            <div className="mb-2 px-3 py-1 rounded-full bg-white backdrop-blur-sm text-xs text-[#3b3535] font-medium shadow transition-all group-hover:bg-[#c1835a] group-hover:text-white">
        Mesa comedor
                            </div>
                            <div className="w-0.5 h-8 bg-white/60 group-hover:bg-[#c1835a]" />
                            <div className="w-8 h-8 bg-white/80 border-2 border-white shadow-lg rounded-full flex items-center justify-center transition-all group-hover:bg-[#c1835a] group-hover:border-[#c1835a]">
                                <div className="w-3 h-3 bg-[#c1835a] rounded-full group-hover:bg-white transition-all"></div>
                            </div>
                        </Link>
                        {/* Silla cómoda */}
                        <Link 
                            href="/project/11" 
                            className="absolute right-[22%] top-[60%] flex flex-col items-center group"
                        >
                            <div className="mb-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm text-xs text-[#3b3535] font-medium shadow transition-all group-hover:bg-[#c1835a] group-hover:text-white">
        Silla cómoda
                            </div>
                            <div className="w-0.5 h-8 bg-white/60 group-hover:bg-[#c1835a]" />
                            <div className="w-8 h-8 bg-white/80 border-2 border-white shadow-lg rounded-full flex items-center justify-center transition-all group-hover:bg-[#c1835a] group-hover:border-[#c1835a]">
                                <div className="w-3 h-3 bg-[#c1835a] rounded-full group-hover:bg-white transition-all"></div>
                            </div>
                        </Link>
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
              Comparte tu pasión por la carpintería y ayuda a otros carpinteros mientras construyes tu reputación
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

                    <div className="text-center px-4 flex justify-center">
                        <Button onClick={handleCreateProjectClick} className="w-full sm:w-auto bg-[#656b48] hover:bg-[#3b3535] text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Comenzar ahora - Es gratis</span>
                        </Button>
                    </div>
                </div>
            </motion.section>

            {/* Featured Creators Section */}
            {/* --- Featured Creators Section / CTA --- */}
            <motion.section
                ref={creatorsRef}
                initial={{ opacity: 0, y: 40 }}
                animate={creatorsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="py-12 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Envolvemos todo en una tarjeta blanca para destacarla del fondo beige */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                
                            {/* Columna 1: Texto y CTA */}
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-4">
                        ¿Quieres ser el próximo Creador Destacado?
                                </h2>
                                <p className="text-base sm:text-lg text-[#676765] mb-8">
                        Al publicar tu proyecto, no solo compartes tu trabajo, sino que inspiras a miles de otros carpinteros. Construye tu reputación y conviértete en una parte fundamental de nuestra comunidad.
                                </p>
                                <Button onClick={handleCreateProjectClick} className="w-full sm:w-auto bg-[#c1835a] hover:bg-[#3b3535] text-white px-6 sm:px-8 py-3 rounded-full text-base font-semibold">
                            Publica tu proyecto ahora
                                </Button>
                            </div>

                            {/* Columna 2: Collage de Imágenes */}
                            <div className="grid grid-cols-2 gap-4 h-64 md:h-80">
                                {/* Imagen 1 (Vertical) */}
                                <div className="col-span-1 row-span-2 rounded-lg overflow-hidden">
                                    <Image
                                        src="/landing/torre-gato.jpeg"
                                        alt="Proyecto de carpintería vertical"
                                        width={300}
                                        height={600}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                {/* Imagen 2 (Cuadrada) */}
                                <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
                                    <Image
                                        src="/landing/plano-gato.jpg"
                                        alt="Detalle de carpintería"
                                        width={150}
                                        height={300}
                                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                {/* Imagen 3 (Cuadrada) */}
                                <div className="col-span-1 row-span-1 rounded-lg overflow-hidden">
                                    <Image
                                        src="/landing/carpintero.jpg"
                                        alt="Herramientas de carpintería"
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </div>
                
                        </div>
                    </div>
                </div>
            </motion.section>
            {/* Projects Sections */}
            <FeaturedCategory
                title="Estilo Japandi"
                filterKey="style"
                filterValue="japandi"
            />
            
            <FeaturedCategory
                title="Estilo Vintage"
                filterKey="style"
                filterValue="vintage"
            />
            <motion.section
                ref={finalRef}
                initial={{ opacity: 0, y: 40 }}
                animate={finalInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                {/* Final CTA Section */}
                <section className="bg-[#656b48] py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Listo para compartir tu próximo proyecto?</h2>
                        <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Únete a miles de carpinteros que ya están construyendo el futuro de la carpintería sustentable
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                className="w-full sm:w-auto bg-white text-[#656b48] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-2"
                                onClick={handleCreateProjectClick}
                            >
                                <Plus className="w-5 h-5" />
                                <span>Publicar mi primer proyecto</span>
                            </Button>
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
            </motion.section>
            {loginModalOpen && (
                <LoginModal
                    open={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                />
            )}
        </div>
    );
}
