"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Grid3X3,
  List,
  Filter,
  MoreHorizontal,
  Heart,
  Star,
  Clock,
  Download,
  Share2,
  Folder,
  Edit3,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { ResponsiveHeader } from "@/components/responsive-header"

const favoriteStats = {
  totalFavorites: 156,
  collections: 8,
  recentlyAdded: 12,
  mostLikedCategory: "Japandi",
}

const collections = [
  {
    id: 1,
    name: "Silla para el patio",
    description: "Ideas para crear la silla perfecta para mi terraza",
    count: 8,
    isPrivate: false,
    color: "#656b48",
    projects: [
      { id: 1, image: "/placeholder.svg?height=120&width=120" },
      { id: 2, image: "/placeholder.svg?height=120&width=120" },
      { id: 3, image: "/placeholder.svg?height=120&width=120" },
      { id: 4, image: "/placeholder.svg?height=120&width=120" },
    ],
    additionalCount: 4,
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
  },
  {
    id: 2,
    name: "Escritorio para Lara",
    description: "Proyectos de escritorios infantiles y juveniles",
    count: 12,
    isPrivate: true,
    color: "#c1835a",
    projects: [
      { id: 5, image: "/placeholder.svg?height=120&width=120" },
      { id: 6, image: "/placeholder.svg?height=120&width=120" },
      { id: 7, image: "/placeholder.svg?height=120&width=120" },
      { id: 8, image: "/placeholder.svg?height=120&width=120" },
    ],
    additionalCount: 8,
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-18",
  },
  {
    id: 3,
    name: "Ideas Biblioteca",
    description: "Diferentes estilos y tamaños de bibliotecas",
    count: 15,
    isPrivate: false,
    color: "#c89c6b",
    projects: [
      { id: 9, image: "/placeholder.svg?height=120&width=120" },
      { id: 10, image: "/placeholder.svg?height=120&width=120" },
      { id: 11, image: "/placeholder.svg?height=120&width=120" },
      { id: 12, image: "/placeholder.svg?height=120&width=120" },
    ],
    additionalCount: 11,
    createdAt: "2024-01-05",
    lastUpdated: "2024-01-19",
  },
  {
    id: 4,
    name: "Para vender",
    description: "Proyectos con potencial comercial",
    count: 6,
    isPrivate: true,
    color: "#3b3535",
    projects: [
      { id: 13, image: "/placeholder.svg?height=120&width=120" },
      { id: 14, image: "/placeholder.svg?height=120&width=120" },
      { id: 15, image: "/placeholder.svg?height=120&width=120" },
      { id: 16, image: "/placeholder.svg?height=120&width=120" },
    ],
    additionalCount: 2,
    createdAt: "2023-12-28",
    lastUpdated: "2024-01-16",
  },
]

const recentFavorites = [
  {
    id: 1,
    title: "Mesa de Centro Flotante",
    author: "Carlos Mendoza",
    avatar: "CM",
    rating: 4.8,
    difficulty: "Intermedio",
    time: "8 horas",
    downloads: "2.1K",
    views: "12.5K",
    image: "/placeholder.svg?height=200&width=200",
    addedAt: "2024-01-20",
    category: "Mesas",
    style: "Moderno",
    note: "Me gusta el diseño flotante, perfecto para mi sala",
  },
  {
    id: 2,
    title: "Silla Ergonómica Minimalista",
    author: "Ana García",
    avatar: "AG",
    rating: 4.9,
    difficulty: "Avanzado",
    time: "12 horas",
    downloads: "1.8K",
    views: "9.3K",
    image: "/placeholder.svg?height=200&width=200",
    addedAt: "2024-01-19",
    category: "Sillas",
    style: "Minimalista",
    note: "Excelente para la oficina en casa",
  },
  {
    id: 3,
    title: "Estantería Modular Bambú",
    author: "Kenji Nakamura",
    avatar: "KN",
    rating: 4.7,
    difficulty: "Principiante",
    time: "4 horas",
    downloads: "3.2K",
    views: "18.7K",
    image: "/placeholder.svg?height=200&width=200",
    addedAt: "2024-01-18",
    category: "Estanterías",
    style: "Japandi",
    note: "Sostenible y fácil de hacer",
  },
]

const recommendedProjects = [
  {
    id: 4,
    title: "Mesa Auxiliar Nórdica",
    author: "Sofia Chen",
    avatar: "SC",
    rating: 4.85,
    image: "/placeholder.svg?height=150&width=150",
    reason: "Basado en tu interés en mesas minimalistas",
  },
  {
    id: 5,
    title: "Silla Windsor Moderna",
    author: "Miguel Torres",
    avatar: "MT",
    rating: 4.92,
    image: "/placeholder.svg?height=150&width=150",
    reason: "Similar a tus sillas favoritas",
  },
  {
    id: 6,
    title: "Biblioteca Esquinera",
    author: "Elena Rustic",
    avatar: "ER",
    rating: 4.78,
    image: "/placeholder.svg?height=150&width=150",
    reason: "Perfecto para tu colección de bibliotecas",
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Principiante":
      return "bg-green-100 text-green-800"
    case "Intermedio":
      return "bg-yellow-100 text-yellow-800"
    case "Avanzado":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MyFavoritesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-[#f2f0eb]">
      {/* Responsive Header */}
      <ResponsiveHeader onCreateProject={() => setIsCreateModalOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-2">Mis favoritos</h1>
            <p className="text-[#676765] text-base sm:text-lg">Organiza y guarda los proyectos que más te inspiran</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#656b48] hover:bg-[#3b3535] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
            <span>Nueva colección</span>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#3b3535]">{favoriteStats.totalFavorites}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Total favoritos</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#656b48]">{favoriteStats.collections}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Colecciones</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#c1835a]">{favoriteStats.recentlyAdded}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Agregados esta semana</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#c89c6b]">{favoriteStats.mostLikedCategory}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Estilo favorito</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Filtrar por estilo</span>
            </Button>
            <select className="px-3 py-2 bg-white border border-[#f6f6f6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c1835a]">
              <option>Más recientes</option>
              <option>Más antiguos</option>
              <option>Por nombre</option>
              <option>Por cantidad</option>
            </select>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-[#656b48] text-white" : "bg-white text-[#676765]"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-[#656b48] text-white" : "bg-white text-[#676765]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
            <TabsTrigger value="collections" className="flex items-center space-x-2 text-sm">
              <Folder className="w-4 h-4" />
              <span className="hidden sm:inline">Colecciones</span>
              <span className="sm:hidden">Col.</span>
              <span>({favoriteStats.collections})</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Recientes</span>
              <span className="sm:hidden">Rec.</span>
              <span>({favoriteStats.recentlyAdded})</span>
            </TabsTrigger>
            <TabsTrigger value="recommended" className="flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Recomendados</span>
              <span className="sm:hidden">Rec.</span>
            </TabsTrigger>
          </TabsList>

          {/* Collections */}
          <TabsContent value="collections">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {collections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all group">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: collection.color }}></div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#3b3535]">{collection.name}</h3>
                        {collection.isPrivate && (
                          <Badge variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                            Privada
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-[#f6f6f6] rounded">
                          <Edit3 className="w-4 h-4 text-[#676765]" />
                        </button>
                        <button className="p-1 hover:bg-[#f6f6f6] rounded">
                          <Share2 className="w-4 h-4 text-[#676765]" />
                        </button>
                        <button className="p-1 hover:bg-[#f6f6f6] rounded">
                          <MoreHorizontal className="w-4 h-4 text-[#676765]" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[#676765] text-sm mb-4">{collection.description}</p>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {collection.projects.map((project, index) => (
                        <div
                          key={project.id}
                          className="aspect-square bg-[#f6f6f6] rounded-lg overflow-hidden relative"
                        >
                          {index === 3 ? (
                            <div className="w-full h-full bg-[#c89c6b] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">+{collection.additionalCount}</span>
                            </div>
                          ) : (
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={`Proyecto ${project.id}`}
                              width={120}
                              height={120}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[#c1835a] text-sm font-medium">{collection.count} proyectos</p>
                      <div className="text-xs text-[#676765]">Actualizada {collection.lastUpdated}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Collection Card */}
              <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-[#f6f6f6] hover:border-[#c1835a] transition-all group cursor-pointer">
                <div className="p-8 sm:p-12 text-center">
                  <div className="mb-4">
                    <Plus className="w-10 sm:w-12 h-10 sm:h-12 text-[#c1835a] mx-auto group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#3b3535] mb-2">Nueva colección</h3>
                  <p className="text-[#676765] text-sm">Organiza tus favoritos por tema, estilo o proyecto</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Recent Favorites */}
          <TabsContent value="recent">
            <div className="space-y-4 sm:space-y-6">
              {recentFavorites.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="w-full sm:w-32 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={128}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                        <h3 className="font-bold text-[#3b3535] text-xl">{project.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty}
                          </Badge>
                          <span className="text-sm text-[#676765]">Agregado {project.addedAt}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">{project.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#676765]">{project.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                          <span className="text-sm text-[#676765]">{project.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-[#676765]" />
                          <span className="text-sm text-[#676765]">{project.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4 text-[#676765]" />
                          <span className="text-sm text-[#676765]">{project.downloads}</span>
                        </div>
                      </div>

                      {project.note && (
                        <div className="bg-[#f6f6f6] rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <Edit3 className="w-4 h-4 text-[#c1835a] mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-[#3b3535] italic">"{project.note}"</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                            {project.category}
                          </Badge>
                          <Badge variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                            {project.style}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs bg-transparent flex-1 sm:flex-none">
                            <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                            Quitar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#656b48] hover:bg-[#3b3535] text-white text-xs flex-1 sm:flex-none"
                          >
                            Ver proyecto
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Recommended */}
          <TabsContent value="recommended">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-6 h-6 text-[#c1835a]" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#3b3535]">Recomendado para ti</h2>
              </div>
              <p className="text-[#676765]">Basado en tus favoritos y proyectos guardados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={225}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#656b48] text-white text-xs">✨ Recomendado</Badge>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white">
                        <Heart className="w-4 h-4 text-[#c1835a]" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-[#3b3535] mb-2 text-lg group-hover:text-[#c1835a] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{project.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-[#676765]">{project.author}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                        <span className="text-sm text-[#676765]">{project.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#676765] mb-4">{project.reason}</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                        <Heart className="w-3 h-3 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" className="flex-1 bg-[#656b48] hover:bg-[#3b3535] text-white text-xs">
                        Ver proyecto
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* More Recommendations */}
            <div className="text-center mt-6 sm:mt-8">
              <Button variant="outline" className="px-6 sm:px-8 py-3 bg-transparent">
                Ver más recomendaciones
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
