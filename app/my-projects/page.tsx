"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Grid3X3,
  List,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Share2,
  Eye,
  Download,
  Heart,
  Star,
  Clock,
  Award,
  Target,
} from "lucide-react"
import Image from "next/image"
import { ResponsiveHeader } from "@/components/responsive-header"

const userStats = {
  totalProjects: 24,
  publicProjects: 18,
  privateProjects: 6,
  totalViews: "45.2K",
  totalDownloads: "12.8K",
  totalLikes: "3.4K",
  avgRating: 4.7,
  followers: 1205,
}

const publicProjects = [
  {
    id: 1,
    title: "Biblioteca En Madera Maciza",
    category: "Bibliotecas",
    status: "Publicado",
    rating: 4.99,
    views: "8.2K",
    downloads: "2.1K",
    likes: 342,
    comments: 89,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-15",
    difficulty: "Intermedio",
    time: "10 horas",
    materials: ["Roble", "Nogal"],
    trending: true,
  },
  {
    id: 2,
    title: "Mesa de Centro Flotante",
    category: "Mesas",
    status: "Publicado",
    rating: 4.85,
    views: "6.7K",
    downloads: "1.8K",
    likes: 298,
    comments: 67,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-10",
    difficulty: "Avanzado",
    time: "15 horas",
    materials: ["Fresno", "Acero"],
    trending: false,
  },
  {
    id: 3,
    title: "Silla Ergonómica Minimalista",
    category: "Sillas",
    status: "Publicado",
    rating: 4.72,
    views: "4.3K",
    downloads: "1.2K",
    likes: 187,
    comments: 43,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-05",
    difficulty: "Intermedio",
    time: "8 horas",
    materials: ["Pino", "Lino"],
    trending: false,
  },
  {
    id: 4,
    title: "Estantería Modular",
    category: "Estanterías",
    status: "Publicado",
    rating: 4.91,
    views: "9.1K",
    downloads: "2.8K",
    likes: 456,
    comments: 112,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-12-28",
    difficulty: "Principiante",
    time: "6 horas",
    materials: ["MDF", "Pino"],
    trending: false,
  },
  {
    id: 5,
    title: "Banco de Jardín Curvo",
    category: "Exterior",
    status: "Publicado",
    rating: 4.68,
    views: "3.9K",
    downloads: "1.1K",
    likes: 234,
    comments: 56,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-12-20",
    difficulty: "Avanzado",
    time: "12 horas",
    materials: ["Teca", "Acero inox"],
    trending: false,
  },
  {
    id: 6,
    title: "Organizador de Escritorio",
    category: "Oficina",
    status: "Publicado",
    rating: 4.83,
    views: "5.6K",
    downloads: "1.9K",
    likes: 321,
    comments: 78,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-12-15",
    difficulty: "Principiante",
    time: "3 horas",
    materials: ["Bambú"],
    trending: false,
  },
]

const privateProjects = [
  {
    id: 7,
    title: "Mesa de Comedor Familiar",
    category: "Mesas",
    status: "Borrador",
    progress: 75,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-20",
    difficulty: "Avanzado",
    time: "25 horas",
    materials: ["Roble", "Hierro"],
  },
  {
    id: 8,
    title: "Cama Montessori Infantil",
    category: "Infantil",
    status: "En revisión",
    progress: 90,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-18",
    difficulty: "Intermedio",
    time: "12 horas",
    materials: ["Pino", "Laca"],
  },
  {
    id: 9,
    title: "Aparador Vintage",
    category: "Almacenamiento",
    status: "Borrador",
    progress: 45,
    image: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-12",
    difficulty: "Avanzado",
    time: "30 horas",
    materials: ["Nogal", "Latón"],
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Publicado":
      return "bg-green-100 text-green-800"
    case "Borrador":
      return "bg-gray-100 text-gray-800"
    case "En revisión":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function MyProjectsPage() {
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3b3535] mb-2">Mis proyectos</h1>
            <p className="text-[#676765] text-base sm:text-lg">Gestiona y comparte tus creaciones con la comunidad</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#656b48] hover:bg-[#3b3535] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
            <span>Crear nuevo proyecto</span>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#3b3535]">{userStats.totalProjects}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Total proyectos</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#656b48]">{userStats.publicProjects}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Publicados</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#c1835a]">{userStats.totalViews}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Visualizaciones</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#c89c6b]">{userStats.totalDownloads}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Descargas</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#3b3535]">{userStats.totalLikes}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Me gusta</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-xl sm:text-2xl font-bold text-[#3b3535]">{userStats.avgRating}</span>
              <Star className="w-3 sm:w-4 h-3 sm:h-4 fill-[#c1835a] text-[#c1835a]" />
            </div>
            <div className="text-xs sm:text-sm text-[#676765]">Rating promedio</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#3b3535]">{userStats.followers}</div>
            <div className="text-xs sm:text-sm text-[#676765]">Seguidores</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 text-center">
            <div className="flex items-center justify-center">
              <Award className="w-5 sm:w-6 h-5 sm:h-6 text-[#c1835a]" />
            </div>
            <div className="text-xs sm:text-sm text-[#676765]">Top Creator</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="flex items-center justify-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Filtrar</span>
            </Button>
            <select className="px-3 py-2 bg-white border border-[#f6f6f6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c1835a]">
              <option>Más recientes</option>
              <option>Más populares</option>
              <option>Mejor valorados</option>
              <option>Más descargados</option>
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
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="public" className="flex items-center space-x-2 text-sm">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Proyectos públicos</span>
              <span className="sm:hidden">Públicos</span>
              <span>({userStats.publicProjects})</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="flex items-center space-x-2 text-sm">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Proyectos privados</span>
              <span className="sm:hidden">Privados</span>
              <span>({userStats.privateProjects})</span>
            </TabsTrigger>
          </TabsList>

          {/* Public Projects */}
          <TabsContent value="public">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {publicProjects
                  .filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.trending && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-500 text-white text-xs">🔥 Trending</Badge>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-2">
                            <button className="p-2 bg-white/90 rounded-full hover:bg-white">
                              <Edit className="w-4 h-4 text-[#3b3535]" />
                            </button>
                            <button className="p-2 bg-white/90 rounded-full hover:bg-white">
                              <MoreHorizontal className="w-4 h-4 text-[#3b3535]" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                        </div>
                        <h3 className="font-bold text-[#3b3535] mb-2 text-lg">{project.title}</h3>
                        <p className="text-sm text-[#676765] mb-4">{project.category}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-[#676765]" />
                            <span className="text-[#676765]">{project.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4 text-[#676765]" />
                            <span className="text-[#676765]">{project.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-[#676765]" />
                            <span className="text-[#676765]">{project.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                            <span className="text-[#676765]">{project.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-[#676765] text-sm">
                            <Clock className="w-3 h-3" />
                            <span>{project.time}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 hover:bg-[#f6f6f6] rounded">
                              <Share2 className="w-4 h-4 text-[#676765]" />
                            </button>
                            <button className="p-1 hover:bg-[#f6f6f6] rounded">
                              <Copy className="w-4 h-4 text-[#676765]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {publicProjects
                  .filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                            <h3 className="font-bold text-[#3b3535] text-xl">{project.title}</h3>
                            <div className="flex space-x-2">
                              <button className="p-2 hover:bg-[#f6f6f6] rounded">
                                <Edit className="w-4 h-4 text-[#676765]" />
                              </button>
                              <button className="p-2 hover:bg-[#f6f6f6] rounded">
                                <Share2 className="w-4 h-4 text-[#676765]" />
                              </button>
                              <button className="p-2 hover:bg-[#f6f6f6] rounded">
                                <MoreHorizontal className="w-4 h-4 text-[#676765]" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                              {project.difficulty}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                            {project.trending && <Badge className="bg-red-500 text-white text-xs">🔥 Trending</Badge>}
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-sm text-[#676765]">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{project.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{project.downloads}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{project.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                              <span>{project.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{project.time}</span>
                            </div>
                            <div className="text-right">
                              <span>{project.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Private Projects */}
          <TabsContent value="private">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {privateProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white">
                          <Edit className="w-4 h-4 text-[#3b3535]" />
                        </button>
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white">
                          <MoreHorizontal className="w-4 h-4 text-[#3b3535]" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`text-xs ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                    </div>
                    <h3 className="font-bold text-[#3b3535] mb-2 text-lg">{project.title}</h3>
                    <p className="text-sm text-[#676765] mb-4">{project.category}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#676765]">Progreso</span>
                        <span className="text-sm font-medium text-[#3b3535]">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-[#f6f6f6] rounded-full h-2">
                        <div
                          className="bg-[#656b48] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-[#676765] text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{project.time}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-[#656b48] hover:bg-[#3b3535] text-white">
                          Continuar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State for Private Projects */}
              <div className="bg-white rounded-lg p-8 sm:p-12 shadow-sm text-center border-2 border-dashed border-[#f6f6f6]">
                <div className="mb-6">
                  <div className="w-16 h-12 bg-[#c1835a] rounded-t-full rounded-b-sm mx-auto transform rotate-12 mb-4"></div>
                </div>
                <p className="text-[#c1835a] text-lg mb-2">¿Tienes una idea en mente?</p>
                <p className="text-[#676765] mb-6">Crea un borrador y trabaja en él cuando tengas tiempo</p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#c89c6b] hover:bg-[#c1835a] text-white px-6 py-2 rounded-full w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear borrador
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
