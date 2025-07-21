"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Check } from "lucide-react"
import Image from "next/image"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    altura: "",
    largo: "",
    ancho: "",
    materialPrincipal: "",
    description: "",
    estilos: "",
    tiempoArmado: "",
    materiales: "",
    herramientas: "",
    ambiente: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    coverImage: null as File | null,
    images: [] as File[],
    tutorialFile: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (type: "coverImage" | "images" | "tutorialFile", files: FileList | null) => {
    if (!files) return

    if (type === "coverImage" || type === "tutorialFile") {
      setUploadedFiles((prev) => ({ ...prev, [type]: files[0] }))
    } else if (type === "images") {
      setUploadedFiles((prev) => ({ ...prev, images: [...prev.images, ...Array.from(files)] }))
    }
  }

  const handleSubmit = () => {
    console.log("Form data:", formData)
    console.log("Uploaded files:", uploadedFiles)
    // Here you would typically send the data to your backend
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#f2f0eb] rounded-lg shadow-xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#3b3535]">Crear un nuevo proyecto</h2>
                <div className="flex items-center space-x-4">
                  <Image 
                    src="/logo.png"
                    alt="Woody's Workshop Logo"
                    width={75}
                    height={50}
                    className="object-contain"
                    priority
                  />
                  <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                    <X className="w-5 h-5 text-[#3b3535]" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#3b3535] mb-2">Título</label>
                  <Input
                    type="text"
                    placeholder="Ej: Mesa Fachera para exterior"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]"
                  />
                </div>

                {/* Specifications Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Altura</label>
                    <Input
                      type="text"
                      value={formData.altura}
                      onChange={(e) => handleInputChange("altura", e.target.value)}
                      className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Largo</label>
                    <Input
                      type="text"
                      value={formData.largo}
                      onChange={(e) => handleInputChange("largo", e.target.value)}
                      className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Ancho</label>
                    <Input
                      type="text"
                      value={formData.ancho}
                      onChange={(e) => handleInputChange("ancho", e.target.value)}
                      className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Material principal</label>
                    <Input
                      type="text"
                      value={formData.materialPrincipal}
                      onChange={(e) => handleInputChange("materialPrincipal", e.target.value)}
                      className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#3b3535] mb-2">Descripción</label>
                  <Textarea
                    placeholder="Comenta un poco acerca de tu proyecto!"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a] min-h-[120px] resize-none"
                  />
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#3b3535] mb-2">Imagen de portada</label>
                  <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-8 text-center bg-white/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload("coverImage", e.target.files)}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <label htmlFor="cover-image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-[#c89c6b] rounded-full flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[#3b3535] font-medium">Subir imagen</span>
                      </div>
                    </label>
                    {uploadedFiles.coverImage && (
                      <p className="mt-2 text-sm text-[#656b48]">
                        Archivo seleccionado: {uploadedFiles.coverImage.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images and Tutorial File Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Additional Images */}
                  <div>
                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Imágenes</label>
                    <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-6 text-center bg-white/50">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload("images", e.target.files)}
                        className="hidden"
                        id="images-upload"
                      />
                      <label htmlFor="images-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 bg-[#c89c6b] rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[#3b3535] font-medium text-sm">Subir imágenes</span>
                        </div>
                      </label>
                      {uploadedFiles.images.length > 0 && (
                        <p className="mt-2 text-xs text-[#656b48]">
                          {uploadedFiles.images.length} archivo(s) seleccionado(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tutorial File */}
                  <div>
                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Archivo tutorial</label>
                    <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-6 text-center bg-white/50">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => handleFileUpload("tutorialFile", e.target.files)}
                        className="hidden"
                        id="tutorial-upload"
                      />
                      <label htmlFor="tutorial-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-10 h-10 bg-[#c89c6b] rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[#3b3535] font-medium text-sm">Subir archivo</span>
                        </div>
                      </label>
                      {uploadedFiles.tutorialFile && (
                        <p className="mt-2 text-xs text-[#656b48]">
                          Archivo seleccionado: {uploadedFiles.tutorialFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dropdown Sections */}
                <div className="space-y-4">
                  <Select onValueChange={(value) => handleInputChange("estilos", value)}>
                    <SelectTrigger className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]">
                      <SelectValue placeholder="Estilos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimalista">Minimalista</SelectItem>
                      <SelectItem value="nordico">Nórdico</SelectItem>
                      <SelectItem value="moderno">Moderno</SelectItem>
                      <SelectItem value="japandi">Japandi</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleInputChange("tiempoArmado", value)}>
                    <SelectTrigger className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]">
                      <SelectValue placeholder="Tiempo de armado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menos-2h">Menos de 2 horas</SelectItem>
                      <SelectItem value="2-5h">2-5 horas</SelectItem>
                      <SelectItem value="5-10h">5-10 horas</SelectItem>
                      <SelectItem value="10-20h">10-20 horas</SelectItem>
                      <SelectItem value="mas-20h">Más de 20 horas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleInputChange("materiales", value)}>
                    <SelectTrigger className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]">
                      <SelectValue placeholder="Materiales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="madera-maciza">Madera maciza</SelectItem>
                      <SelectItem value="mdf">MDF</SelectItem>
                      <SelectItem value="contrachapado">Contrachapado</SelectItem>
                      <SelectItem value="fibrofacil">Fibrofácil</SelectItem>
                      <SelectItem value="pino">Pino</SelectItem>
                      <SelectItem value="roble">Roble</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleInputChange("herramientas", value)}>
                    <SelectTrigger className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]">
                      <SelectValue placeholder="Herramientas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sierra-circular">Sierra circular</SelectItem>
                      <SelectItem value="taladro">Taladro</SelectItem>
                      <SelectItem value="lijadora">Lijadora</SelectItem>
                      <SelectItem value="router">Router</SelectItem>
                      <SelectItem value="herramientas-manuales">Herramientas manuales</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleInputChange("ambiente", value)}>
                    <SelectTrigger className="bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]">
                      <SelectValue placeholder="Ambiente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dormitorio">Dormitorio</SelectItem>
                      <SelectItem value="living">Living / Sala de estar</SelectItem>
                      <SelectItem value="comedor">Comedor</SelectItem>
                      <SelectItem value="cocina">Cocina</SelectItem>
                      <SelectItem value="oficina">Oficina / Estudio</SelectItem>
                      <SelectItem value="infantil">Infantil</SelectItem>
                      <SelectItem value="bano">Baño</SelectItem>
                      <SelectItem value="exterior">Exterior / Jardín</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-4 pt-6">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Publicar proyecto!</span>
                  </Button>
                  <button onClick={onClose} className="text-[#c1835a] font-medium hover:underline text-center">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
