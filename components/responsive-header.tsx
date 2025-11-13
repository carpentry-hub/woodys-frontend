'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext'; // Importamos useAuthContext
import LoginModal from '@/components/login-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, Home, FolderOpen, Heart, User, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface ResponsiveHeaderProps {
    onCreateProject?: () => void
}

export function ResponsiveHeader({ onCreateProject }: ResponsiveHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

    const navigationItems = [
        { name: 'Explorar proyectos', href: '/explorer', icon: Home, active: pathname === '/explorer', always: true, },
        { name: 'Mis proyectos', href: '/my-projects', icon: FolderOpen, active: pathname === '/my-projects', always: false, },
        { name: 'Mis favoritos', href: '/my-favorites', icon: Heart, active: pathname === '/my-favorites', always: false, },
        { name: 'Crear proyecto', href: '/create-project', icon: User, active: pathname === '/create-project', always: false, },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const { user, appUser, profilePictureUrl, loading, logout } = useAuthContext();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const protectedRoutes = ['/my-projects', '/my-favorites', '/profile'];

    const handleLogout = () => {
        logout();
        setProfileMenuOpen(false);
        if (protectedRoutes.includes(pathname)) {
            window.location.href = '/';
        }
    };

    const getFallback = () => {
        if (appUser?.username) return appUser.username[0].toUpperCase();
        if (user?.displayName) return user.displayName.split(' ').map(n => n[0]).join('');
        if (user?.email) return user.email.slice(0, 2).toUpperCase();
        return 'U';
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b border-[#f6f6f6] shadow-sm"
                style={{
                    background: 'rgba(255,255,255,0.67)',
                    backdropFilter: 'blur(14.2px)',
                    WebkitBackdropFilter: 'blur(14.2px)',
                }}
            >
                <div className="px-4 sm:px-6 py-3 sm:py-4 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0">
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden p-2 hover:bg-[#f6f6f6] rounded-lg transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X className="w-6 h-6 text-[#3d3d3d]" /> : <Menu className="w-6 h-6 text-[#3d3d3d]" />}
                            </button>
                            <AnimatePresence mode="wait">
                                <motion.nav
                                    key={user ? 'nav-logged' : 'nav-guest'}
                                    className="hidden lg:flex items-center space-x-8"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                >
                                    {navigationItems.filter(item => item.always || user).map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={`font-medium transition-colors ${
                                                item.active
                                                    ? 'text-[#c1835a] border-b-2 border-[#c1835a] pb-1'
                                                    : 'text-[#adadad] hover:text-[#3d3d3d]'
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </motion.nav>
                            </AnimatePresence>
                        </div>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/logo.png"
                                    alt="Woody's Workshop Logo"
                                    width={55}
                                    height={32}
                                    className="object-contain mr-2"
                                    priority
                                />
                                <div className="flex flex-col items-center justify-center">
                                    <Image
                                        src="/woodys.png"
                                        alt="Woody's Workshop Text Logo"
                                        width={105}
                                        height={32}
                                        className="object-contain"
                                        priority
                                    />
                                    <span className="text-[#676765] text-xs sm:text-sm font-medium mt-0.5" style={{letterSpacing: '0.15em', fontFamily: 'Inter, sans-serif'}}>WORKSHOP</span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#adadad] w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar proyectos..."
                                    className="pl-10 pr-4 py-2 bg-[#f6f6f6] rounded-full text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-[#c1835a]"
                                />
                            </div>

                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 hover:bg-[#f6f6f6] rounded-full transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 text-[#3d3d3d]" />
                            </button>

                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-[#c1835a] sm:block" />
                            ) : user ? (
                                <div className="hidden sm:flex items-center space-x-2 relative">
                                    <button
                                        onClick={() => setProfileMenuOpen((v) => !v)}
                                        className="flex items-center space-x-2 hover:bg-[#f6f6f6] rounded-lg px-2 py-1 transition-colors focus:outline-none"
                                    >
                                        <Avatar className="w-8 h-8 hover:ring-2 hover:ring-[#c1835a] transition-all">
                                            {profilePictureUrl ? (
                                                <AvatarImage src={profilePictureUrl} />
                                            ) : (
                                                <AvatarFallback>{getFallback()}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <span className="text-[#3d3d3d] text-sm font-medium hover:text-[#c1835a] transition-colors hidden lg:block">
                                            {appUser?.username || user.displayName || user.email}
                                        </span>
                                        <ChevronDown className="w-4 h-4 ml-1 text-[#adadad]" />
                                    </button>
                                    {profileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white border border-[#f6f6f6] rounded-lg shadow-lg z-50">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#f6f6f6] rounded-t-lg">Ver perfil</Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-[#c1835a] hover:bg-[#f6f6f6] rounded-b-lg"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Button onClick={() => setLoginModalOpen(true)} className="hidden sm:flex bg-[#c1835a] text-white items-center px-4 py-2 rounded-lg">
                                        Iniciar sesión
                                    </Button>
                                    {loginModalOpen && (
                                        <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
                                    )}
                                </>
                            )}

                            <Link href="/profile" className="sm:hidden">
                                <Avatar className="w-8 h-8 hover:ring-2 hover:ring-[#c1835a] transition-all">
                                    {profilePictureUrl ? (
                                        <AvatarImage src={profilePictureUrl} />
                                    ) : (
                                        <AvatarFallback>{getFallback()}</AvatarFallback>
                                    )}
                                </Avatar>
                            </Link>
                        </div>
                    </div>

                    {isSearchOpen && (
                        <div className="md:hidden mt-4 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#adadad] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar tu proyecto de carpintería perfecto..."
                                className="w-full pl-10 pr-4 py-3 bg-[#f6f6f6] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c1835a]"
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </header>

            {isMenuOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />}

            <div
                className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#ffffff] z-50 transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } shadow-xl`}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" onClick={closeMenu} className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-[#c1835a] rounded-full"></div>
                            <div>
                                <span className="text-[#c1835a] font-bold text-xl block">WOODY&apos;S</span>
                                <span className="text-[#676765] text-sm">WORKSHOP</span>
                            </div>
                        </Link>
                        <button
                            onClick={closeMenu}
                            className="p-2 hover:bg-[#f6f6f6] rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6 text-[#3d3d3d]" />
                        </button>
                    </div>

                    <div className="mb-8 p-4 bg-[#f6f6f6] rounded-lg">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen((v) => !v)}
                                    className="flex items-center w-full space-x-3 focus:outline-none hover:bg-[#ececec] rounded-lg px-2 py-2 transition-colors"
                                >
                                    <Avatar className="w-12 h-12">
                                        {profilePictureUrl ? (
                                            <AvatarImage src={profilePictureUrl} />
                                        ) : (
                                            <AvatarFallback>{getFallback()}</AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold text-[#3b3535] truncate">{appUser?.username || user.displayName || user.email}</div>
                                        <div className="text-sm text-[#676765]">Ver perfil completo</div>
                                    </div>
                                    <ChevronDown className="w-5 h-5 text-[#adadad] ml-2" />
                                </button>
                                {profileMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-full bg-white border border-[#f6f6f6] rounded-lg shadow-lg z-50">
                                        <Link href="/profile" onClick={closeMenu} className="block px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#f6f6f6] rounded-t-lg">Ver perfil</Link>
                                        <button
                                            onClick={() => { logout(); setProfileMenuOpen(false); closeMenu(); }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#c1835a] hover:bg-[#f6f6f6] rounded-b-lg"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button onClick={() => setLoginModalOpen(true)} className="w-full bg-[#c1835a] text-white items-center px-4 py-2 rounded-lg">
                                    Iniciar sesión
                                </Button>
                                <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
                            </>
                        )}
                    </div>

                    <nav className="space-y-2 mb-8">
                        {navigationItems.filter(item => item.always || user).map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        item.active ? 'bg-[#656b48] text-white' : 'text-[#3d3d3d] hover:bg-[#f6f6f6]'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-3">
                        {onCreateProject && (
                            <Button
                                onClick={() => {
                                    onCreateProject();
                                    closeMenu();
                                }}
                                className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                            >
                                <span>Crear proyecto</span>
                            </Button>
                        )}
                        <Link href="/explorer" onClick={closeMenu}>
                            <Button variant="outline" className="w-full py-3 rounded-lg bg-transparent">
                                Explorar proyectos
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-8 pt-6 border-t border-[#f6f6f6] text-center">
                        <p className="text-xs text-[#676765]">
                            © 2025 Woody&lsquo;s Workshop
                            <br />
                            Hecho con ❤️ para makers
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-16 sm:h-20"></div>
        </>
    );
}