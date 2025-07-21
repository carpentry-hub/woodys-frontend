"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Star, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function LandingPage() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[#f2f0eb]">
      {/* Header */}
      <header className="bg-[#ffffff] border-b border-[#f6f6f6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-8">
            <Link href="/explorer" className="text-[#3d3d3d] hover:text-[#000000] font-medium">
              Explorar proyectos
            </Link>
            <Link href="/my-projects" className="text-[#adadad] hover:text-[#3d3d3d] font-medium">
              Mis proyectos
            </Link>
            <Link href="/my-favorites" className="text-[#adadad] hover:text-[#3d3d3d] font-medium">
              Mis favoritos
            </Link>
            <Link href="/profile" className="text-[#adadad] hover:text-[#3d3d3d] font-medium">
              Mi perfil
            </Link>
          </nav>

          <Link href="/landing" className="flex items-center space-x-2">
            <Image
              src="/woodys-workshop.png"
              alt="Woody's Workshop Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#adadad] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar tu proyecto de carpintería perfecto..."
                className="pl-10 pr-4 py-2 bg-[#f6f6f6] rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#c1835a]"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-[#3d3d3d]" />
              </button>
              <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            </div>
            <Link href="/profile" className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 hover:ring-2 hover:ring-[#c1835a] transition-all">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>PV</AvatarFallback>
              </Avatar>
              <span className="text-[#3d3d3d] text-sm font-medium hover:text-[#c1835a] transition-colors">
                Priscila Della Vecchia
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#3b3535] mb-2">Haz tu proyecto de carpintería</h2>
          <h3 className="text-4xl font-bold text-[#656b48]">Realidad</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-6xl font-bold text-[#c1835a] mb-4">01</div>
            <h4 className="text-xl font-semibold text-[#3b3535] mb-2">Diseño y Durabilidad a tu</h4>
            <h4 className="text-xl font-semibold text-[#3b3535]">Alcance</h4>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-[#c1835a] mb-4">02</div>
            <h4 className="text-xl font-semibold text-[#3b3535] mb-2">Prácticas Sustentables y</h4>
            <h4 className="text-xl font-semibold text-[#3b3535]">Reutilización</h4>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-[#c1835a] mb-4">03</div>
            <h4 className="text-xl font-semibold text-[#3b3535] mb-2">Colabora con Comunidades</h4>
            <h4 className="text-xl font-semibold text-[#3b3535]">Eco-enfocadas</h4>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#adadad] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tu proyecto de carpintería perfecto..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-full text-lg border border-[#f6f6f6] focus:outline-none focus:ring-2 focus:ring-[#c1835a] shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Estilo Japandi Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#3b3535] mb-8 text-center">Estilo japandi</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Project 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">2.65</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Sabrina Carpenter</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">4.99</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">PV</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Priscila Della Vecchia</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">2.65</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Sabrina Carpenter</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">2.65</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Sabrina Carpenter</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="text-[#c1835a] font-medium hover:underline">Ver más</button>
        </div>
      </section>

      {/* Estilo Vintage Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-[#3b3535] mb-8 text-center">Estilo vintage</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Vintage Project 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">4.99</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">PV</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Priscila Della Vecchia</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Project 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">2.65</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Sabrina Carpenter</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Project 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">2.65</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Sabrina Carpenter</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Project 4 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square relative">
              <Image
                src="/placeholder.svg?height=250&width=250"
                alt="Biblioteca En Madera Maciza"
                width={250}
                height={250}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#3b3535] mb-2">Biblioteca En Madera Maciza</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-[#3b3535]">2.65</span>
                <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">SC</AvatarFallback>
                </Avatar>
                <div className="text-xs text-[#676765]">
                  <div>Sabrina Carpenter</div>
                  <div>Ver workshop</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="text-[#c1835a] font-medium hover:underline">Ver más</button>
        </div>
      </section>
    </div>
  )
}
