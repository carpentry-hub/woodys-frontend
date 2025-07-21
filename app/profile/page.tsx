import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Calendar, Star, Users, Folder } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ResponsiveHeader } from "@/components/responsive-header"

const userStats = {
  projectsPublished: 24,
  followers: 1205,
  following: 89,
  totalLikes: 3420,
  reputation: 4.99,
}

const recentProjects = [
  {
    id: 1,
    title: "Biblioteca En Madera Maciza",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.99,
    likes: 209,
    category: "Bibliotecas",
  },
  {
    id: 2,
    title: "Mesa Comedor Nórdica",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.85,
    likes: 156,
    category: "Mesas",
  },
  {
    id: 3,
    title: "Silla Minimalista",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.72,
    likes: 98,
    category: "Sillas",
  },
]

const achievements = [
  { name: "Carpintero Experto", icon: "🏆", description: "Más de 20 proyectos publicados" },
  { name: "Mentor Comunitario", icon: "👨‍🏫", description: "Ayudó a más de 100 usuarios" },
  { name: "Innovador", icon: "💡", description: "Primer proyecto en tendencia" },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f2f0eb]">
      {/* Header */}
      <ResponsiveHeader />

      <div className="pt-4 sm:pt-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                <Avatar className="w-20 sm:w-24 h-20 sm:h-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl">PV</AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-3xl font-bold text-[#3b3535] mb-2">Priscila Della Vecchia</h1>
                  <div className="flex items-center space-x-4 text-[#676765] mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Buenos Aires, Argentina</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Se unió en marzo 2023</span>
                    </div>
                  </div>
                  <p className="text-[#3b3535] max-w-2xl">
                    Apasionada por la carpintería y el diseño sustentable. Me especializo en muebles minimalistas y
                    nórdicos usando madera maciza. Comparto mis proyectos para inspirar a otros makers.
                  </p>
                </div>
              </div>

              <Button className="bg-[#656b48] hover:bg-[#3b3535] text-white flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Editar perfil</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#f6f6f6]">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3b3535]">{userStats.projectsPublished}</div>
                <div className="text-sm text-[#676765]">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3b3535]">{userStats.followers.toLocaleString()}</div>
                <div className="text-sm text-[#676765]">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3b3535]">{userStats.following}</div>
                <div className="text-sm text-[#676765]">Siguiendo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3b3535]">{userStats.totalLikes.toLocaleString()}</div>
                <div className="text-sm text-[#676765]">Me gusta</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-2xl font-bold text-[#3b3535]">{userStats.reputation}</span>
                  <Star className="w-5 h-5 fill-[#c1835a] text-[#c1835a]" />
                </div>
                <div className="text-sm text-[#676765]">Reputación</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Projects */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#3b3535] mb-6">Proyectos recientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="group cursor-pointer">
                      <div className="aspect-square bg-[#f6f6f6] rounded-lg overflow-hidden mb-3">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-[#3b3535] text-sm mb-1">{project.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-[#c1835a] text-[#c1835a]" />
                          <span className="text-xs text-[#676765]">{project.rating}</span>
                        </div>
                        <Badge variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link href="/my-projects" className="text-[#c1835a] font-medium hover:underline">
                    Ver todos los proyectos
                  </Link>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#3b3535] mb-6">Logros</h2>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-[#f6f6f6] rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-medium text-[#3b3535]">{achievement.name}</h3>
                        <p className="text-sm text-[#676765]">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {["Carpintería", "Diseño nórdico", "Madera maciza", "Minimalismo", "Sustentabilidad", "DIY"].map(
                    (skill) => (
                      <Badge key={skill} variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b]">
                        {skill}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              {/* Tools */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Herramientas favoritas</h3>
                <div className="space-y-3">
                  {["Sierra circular", "Router", "Lijadora orbital", "Taladro percutor", "Formones"].map((tool) => (
                    <div key={tool} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#c1835a] rounded-full"></div>
                      <span className="text-sm text-[#3b3535]">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Contacto</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    Seguir
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Folder className="w-4 h-4 mr-2" />
                    Ver workshop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
