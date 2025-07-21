"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Star, Clock, ThumbsUp, MessageSquare } from "lucide-react"
import { ProductGallery } from "@/components/product-gallery"
import { ResponsiveHeader } from "@/components/responsive-header"

// This would typically come from a database or API
const productData = {
  id: 1,
  name: "Biblioteca En Madera Maciza",
  author: {
    name: "Priscila Della Vecchia",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 4.99,
    workshop: "Ver workshop",
  },
  rating: 3.7,
  votes: 1509,
  specifications: {
    alto: "1.65cm",
    ancho: "90cm",
    largo: "40cm",
    material: "Madera Maciza",
  },
  assemblyTime: "10 horas",
  styles: ["Minimalista", "Nórdico", "Moderno", "Japandi"],
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
}

export default function ProductPage() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f2f0eb]">
      {/* Header */}
      <ResponsiveHeader />

      <div className="pt-4 sm:pt-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              <ProductGallery images={productData.images} productName={productData.name} />

              <div className="space-y-2 lg:hidden">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#3b3535]">{productData.name}</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-[#3b3535]">{productData.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i <= Math.floor(productData.rating)
                            ? "fill-[#c1835a] text-[#c1835a]"
                            : i === Math.ceil(productData.rating)
                              ? "fill-[#c1835a] text-[#c1835a] opacity-50"
                              : "text-[#adadad]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[#adadad] text-sm">{productData.votes} votantes</span>
                </div>
              </div>

              {/* Description - moved here from right column */}
              <div className="bg-[#ffffff] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Descripción</h3>
                <p className="text-[#676765] text-sm leading-relaxed mb-4">
                  Elegante, funcional y hecha para durar: esta biblioteca de madera maciza es la combinación perfecta
                  entre simplicidad y calidad. Su diseño único, con líneas rectas y proporciones equilibradas, se adapta
                  a cualquier espacio moderno, nórdico o contemporáneo. Ideal para libros, objetos decorativos o incluso
                  plantas pequeñas, ofrece una solución de almacenamiento robusto y estético.
                </p>
                <p className="text-[#676765] text-sm leading-relaxed">
                  Fabricada íntegramente con madera natural seleccionada, cada pieza resalta las vetas únicas del
                  material, aportando un toque orgánico y acogedor al ambiente. Las uniones discretas y los acabados
                  suaves garantizan durabilidad y resistencia al uso diario.
                </p>
                <button className="text-[#c1835a] text-sm font-medium mt-2">Ver más</button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Author Section */}
              <div className="bg-[#ffffff] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Autor</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={productData.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>PV</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-[#3b3535]">{productData.author.name}</p>
                      <p className="text-sm text-[#c1835a]">{productData.author.workshop}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#676765]">Reputación</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-[#3b3535]">{productData.author.rating}</span>
                      <Star className="w-4 h-4 fill-[#c1835a] text-[#c1835a]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-[#ffffff] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Especificaciones</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-[#676765]">Alto</span>
                    <span className="text-[#3b3535] font-medium">{productData.specifications.alto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#676765]">Ancho</span>
                    <span className="text-[#3b3535] font-medium">{productData.specifications.ancho}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#676765]">Largo</span>
                    <span className="text-[#3b3535] font-medium">{productData.specifications.largo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#676765]">Material</span>
                    <span className="text-[#3b3535] font-medium">{productData.specifications.material}</span>
                  </div>
                </div>
              </div>

              {/* Tools and Materials */}
              <div className="bg-[#ffffff] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Herramientas y materiales</h3>
                <div className="space-y-3">
                  {[
                    { name: "Madera maciza", color: "#c89c6b" },
                    { name: "Lija", color: "#c1835a" },
                    { name: "Adhesivo para madera", color: "#c89c6b" },
                    { name: "Sierra circular", color: "#c1835a" },
                    { name: "Reglas", color: "#c89c6b" },
                  ].map((tool, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: tool.color }}></div>
                      <span className="text-[#3b3535]">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assembly Time */}
              <div className="bg-[#ffffff] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Tiempo de armado</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#c1835a]" />
                  <span className="text-[#3b3535] font-medium">{productData.assemblyTime}</span>
                </div>
              </div>

              {/* Styles */}
              <div className="bg-[#ffffff] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#3b3535] mb-4">Estilos</h3>
                <div className="flex flex-wrap gap-2">
                  {productData.styles.map((style, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#f3f0eb] text-[#c89c6b] hover:bg-[#f3f0eb]">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download Button - Full Width */}
          <div className="mt-8">
            <Button className="w-full bg-[#656b48] hover:bg-[#3b3535] text-[#ffffff] py-4 text-lg font-semibold">
              <Download className="w-5 h-5 mr-2" />
              Descargar <span className="text-sm opacity-80 ml-1">(Free to build)</span>
            </Button>
          </div>

          {/* Comments Section */}
          <div className="mt-12 bg-[#ffffff] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#3b3535] mb-6">Comentarios</h3>

            <div className="space-y-6">
              {[
                {
                  name: "Agustín Sánchez",
                  avatar: "AS",
                  time: "hace 3 semanas",
                  comment:
                    "Te falto aclarar en el instructivo que la madera maciza puede ser roble, fresno, pino, o Guatambú que recomiendo mucho por q es re low cost, lo digo xq soy un experto capaz alguien lo hace con fibrofácil tiene que saber que no va a tener el mismo acabado. Más allá de eso, excelente proyecto!",
                  likes: 209,
                  replies: 621,
                  hasReplies: true,
                },
                {
                  name: "Tiago Di Stefano",
                  avatar: "TD",
                  time: "hace 3 semanas",
                  comment: "yo lo hice con fibrofácil y quedó bastante bien no soporta tanto peso, pero reduce costos",
                  likes: "2k",
                  replies: 30,
                  hasReplies: false,
                },
              ].map((comment, index) => (
                <div key={index} className="flex space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{comment.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-[#c1835a]">{comment.name}</span>
                      <span className="text-[#adadad] text-sm">{comment.time}</span>
                    </div>
                    <p className="text-[#3b3535] text-sm mb-3">{comment.comment}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-[#adadad] hover:text-[#3b3535]">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-[#adadad] hover:text-[#3b3535]">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{comment.replies}</span>
                      </button>
                    </div>
                    {comment.hasReplies && (
                      <button className="text-[#c1835a] text-sm font-medium mt-2">Ver 23 respuestas</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
