"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search, Bell, Menu, X, Home, FolderOpen, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

interface ResponsiveHeaderProps {
  onCreateProject?: () => void
}

export function ResponsiveHeader({ onCreateProject }: ResponsiveHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    {
      name: "Explorar proyectos",
      href: "/explorer",
      icon: Home,
      active: pathname === "/explorer",
    },
    {
      name: "Mis proyectos",
      href: "/my-projects",
      icon: FolderOpen,
      active: pathname === "/my-projects",
    },
    {
      name: "Mis favoritos",
      href: "/my-favorites",
      icon: Heart,
      active: pathname === "/my-favorites",
    },
    {
      name: "Mi perfil",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#ffffff] border-b border-[#f6f6f6] z-50 shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 hover:bg-[#f6f6f6] rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-[#3d3d3d]" /> : <Menu className="w-6 h-6 text-[#3d3d3d]" />}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`font-medium transition-colors ${
                      item.active
                        ? "text-[#000000] border-b-2 border-[#000000] pb-1"
                        : "text-[#adadad] hover:text-[#3d3d3d]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Logo - Center on mobile, left on desktop */}
            <Link
              href="/"
              className="flex items-center space-x-2 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
            >
              <div className="w-8 h-8 bg-[#c1835a] rounded-full"></div>
              <div className="hidden sm:flex items-center space-x-1">
                <span className="text-[#c1835a] font-bold text-lg">WOODY'S</span>
                <span className="text-[#676765] text-sm">WORKSHOP</span>
              </div>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Desktop */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#adadad] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  className="pl-10 pr-4 py-2 bg-[#f6f6f6] rounded-full text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-[#c1835a]"
                />
              </div>

              {/* Search - Mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 hover:bg-[#f6f6f6] rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-[#3d3d3d]" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-[#3d3d3d]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
              </div>

              {/* Profile - Desktop */}
              <Link
                href="/profile"
                className="hidden sm:flex items-center space-x-2 hover:bg-[#f6f6f6] rounded-lg px-2 py-1 transition-colors"
              >
                <Avatar className="w-8 h-8 hover:ring-2 hover:ring-[#c1835a] transition-all">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>PV</AvatarFallback>
                </Avatar>
                <span className="text-[#3d3d3d] text-sm font-medium hover:text-[#c1835a] transition-colors hidden lg:block">
                  Priscila Della Vecchia
                </span>
              </Link>

              {/* Profile - Mobile */}
              <Link href="/profile" className="sm:hidden">
                <Avatar className="w-8 h-8 hover:ring-2 hover:ring-[#c1835a] transition-all">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>PV</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />}

      {/* Mobile Menu Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#ffffff] z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-xl`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={closeMenu} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#c1835a] rounded-full"></div>
              <div>
                <span className="text-[#c1835a] font-bold text-xl block">WOODY'S</span>
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

          {/* User Profile Section */}
          <div className="mb-8 p-4 bg-[#f6f6f6] rounded-lg">
            <Link href="/profile" onClick={closeMenu} className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>PV</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-[#3b3535]">Priscila Della Vecchia</div>
                <div className="text-sm text-[#676765]">Ver perfil completo</div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active ? "bg-[#656b48] text-white" : "text-[#3d3d3d] hover:bg-[#f6f6f6]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onCreateProject && (
              <Button
                onClick={() => {
                  onCreateProject()
                  closeMenu()
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

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#f6f6f6] text-center">
            <p className="text-xs text-[#676765]">
              © 2024 Woody's Workshop
              <br />
              Hecho con ❤️ para makers
            </p>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  )
}
