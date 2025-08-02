"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Calendar, Star, Users, Folder } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ResponsiveHeader } from "@/components/responsive-header"
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../services/users";
import ProfilePictureSelector from "@/components/profile-picture-selector";

// Estado para los datos reales del usuario
const initialStats = {
  projectsPublished: 0,
  followers: 0,
  following: 0,
  totalLikes: 0,
  reputation: 0,
};

import { getUserProjects } from "../services/users";




export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string>("/placeholder.svg?height=96&width=96");
  const [showSelector, setShowSelector] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userStats, setUserStats] = useState(initialStats);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      getUser(Number(user.uid))
        .then(data => {
          setUserData(data);
          setProfilePicture(data.profile_picture_url || "/placeholder.svg?height=96&width=96");
          setUserStats({
            projectsPublished: data.projects_count || 0,
            followers: data.followers_count || 0,
            following: data.following_count || 0,
            totalLikes: data.total_likes || 0,
            reputation: data.reputation || 0,
          });
        })
        .catch(() => {});

      setProjectsLoading(true);
      getUserProjects(Number(user.uid))
        .then(data => {
          setProjects(data);
        })
        .catch(() => {
          setProjects([]);
        })
        .finally(() => setProjectsLoading(false));
    }
  }, [user]);

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
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback className="text-2xl">PV</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-[#3b3535] mb-2">{userData?.username || user?.displayName || user?.email || "Usuario"}</h1>
                  <div className="flex items-center space-x-4 text-[#676765] mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{userData?.location || "Sin ubicación"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Se unió en {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : "-"}</span>
                    </div>
                  </div>
                  <p className="text-[#3b3535] max-w-2xl">
                    {userData?.bio || "Sin descripción."}
                  </p>
                  <Button className="mt-4 bg-[#c1835a] text-white rounded-full" onClick={() => setShowSelector(true)}>
                    Cambiar foto de perfil
                  </Button>
                  {showSelector && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-white rounded-2xl p-8 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4 text-[#3b3535]">Selecciona tu foto de perfil</h3>
                        <ProfilePictureSelector
                          currentPicture={profilePicture}
                          onSelect={url => {
                            setProfilePicture(url);
                            setShowSelector(false);
                          }}
                        />
                        <Button className="mt-4" variant="outline" onClick={() => setShowSelector(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
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
              {/* Proyectos del usuario */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#3b3535] mb-6">Proyectos recientes</h2>
                {projectsLoading ? (
                  <div className="text-center text-[#676765]">Cargando proyectos...</div>
                ) : projects.length === 0 ? (
                  <div className="text-center text-[#676765]">Aún no tiene proyectos publicados.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="group cursor-pointer">
                        <div className="aspect-square bg-[#f6f6f6] rounded-lg overflow-hidden mb-3">
                          <Image
                            src={project.image_url || "/placeholder.svg"}
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
                            <span className="text-xs text-[#676765]">{project.rating || "-"}</span>
                          </div>
                          <Badge variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] text-xs">
                            {project.category || "Sin categoría"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-center mt-6">
                  <Link href="/my-projects" className="text-[#c1835a] font-medium hover:underline">
                    Ver todos los proyectos
                  </Link>
                </div>
              </div>

              {/* Achievements eliminados, solo datos del backend */}
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
