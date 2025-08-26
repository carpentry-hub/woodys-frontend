"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Check, Loader2 } from "lucide-react";
import { ResponsiveHeader } from "@/components/responsive-header";
import Image from "next/image";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useFileUpload } from "@/hooks/useFileUpload";
import { createProject } from "@/app/services/projects";
import { getCurrentUserFromDB } from "@/app/services/users";
import { mapFormDataToProject } from "@/app/utils/project-mapper";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type FormData = {
  title: string,
  altura: string,
  largo: string,
  ancho: string,
  materialPrincipal: string,
  description: string,
  estilos: string[],
  tiempoArmado: string,
  materiales: string[],
  herramientas: string[],
  ambiente: string
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { uploadFile, uploadMultipleFiles, uploading } = useFileUpload();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    altura: "",
    largo: "",
    ancho: "",
    materialPrincipal: "",
    description: "",
    estilos: [],
    tiempoArmado: "",
    materiales: [],
    herramientas: [],
    ambiente: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    coverImage: null as File | null,
    images: [] as File[],
    tutorialFile: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof Omit<FormData, "estilos" | "materiales" | "herramientas">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as FormData))
  }

  const handleFileUpload = (type: "coverImage" | "images" | "tutorialFile", files: FileList | null) => {
    if (!files) return

    if (type === "coverImage" || type === "tutorialFile") {
      setUploadedFiles((prev) => ({ ...prev, [type]: files[0] }))
    } else if (type === "images") {
      setUploadedFiles((prev) => ({ ...prev, images: [...prev.images, ...Array.from(files)] }))
    }
  }

  const estilosOptions = [
    { value: "minimalista", label: "Minimalista" },
    { value: "nordico", label: "Nórdico" },
    { value: "moderno", label: "Moderno" },
    { value: "japandi", label: "Japandi" },
    { value: "vintage", label: "Vintage" },
    { value: "industrial", label: "Industrial" },
  ];

  const materialesOptions = [
    { value: "madera-maciza", label: "Madera maciza" },
    { value: "mdf", label: "MDF" },
    { value: "contrachapado", label: "Contrachapado" },
    { value: "fibrofacil", label: "Fibrofácil" },
    { value: "pino", label: "Pino" },
    { value: "roble", label: "Roble" },
  ];

  const herramientasOptions = [
    { value: "sierra-circular", label: "Sierra circular" },
    { value: "taladro", label: "Taladro" },
    { value: "lijadora", label: "Lijadora" },
    { value: "router", label: "Router" },
    { value: "herramientas-manuales", label: "Herr. manuales" },
  ];

  const handleMultiSelect = (field: "estilos" | "materiales" | "herramientas", value: string) => {
    setFormData((prev) => {
      const exists = prev[field].includes(value)
      return {
        ...prev,
        [field]: exists ? prev[field].filter((v) => v !== value) : [...prev[field], value],
      }
    })
  }

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("Debes estar autenticado para crear un proyecto");
      return;
    }

    if (!formData.title.trim()) {
      setSubmitError("El título es obligatorio");
      return;
    }

    if (!formData.description.trim()) {
      setSubmitError("La descripción es obligatoria");
      return;
    }

    if (!uploadedFiles.coverImage) {
      setSubmitError("La imagen de portada es obligatoria");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const currentUser = await getCurrentUserFromDB();
      const projectTempId = Date.now().toString();
      
      const portraitUrl = await uploadFile(
        uploadedFiles.coverImage,
        `projects/${projectTempId}/portrait`
      );

      let imageUrls: string[] = [];
      if (uploadedFiles.images.length > 0) {
        imageUrls = await uploadMultipleFiles(
          uploadedFiles.images,
          `projects/${projectTempId}/images`
        );
      }

      let tutorialUrl = "";
      if (uploadedFiles.tutorialFile) {
        tutorialUrl = await uploadFile(
          uploadedFiles.tutorialFile,
          `projects/${projectTempId}/tutorial`
        );
      }

      const fileUrls = {
        portraitUrl,
        imageUrls,
        tutorialUrl,
      };

      const projectData = mapFormDataToProject(formData, fileUrls, currentUser.id);
      const newProject = await createProject(projectData);
      
      router.push(`/projects/${newProject.id}`);
      
    } catch (error: any) {
      setSubmitError(error.message || "Error al crear el proyecto. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-[#f2f0eb]">
      <ResponsiveHeader />
      <div className="mx-auto w-full max-w-6xl bg-white rounded-lg shadow-xl">
        <div className="p-8">
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
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#3b3535] mb-2">Título</label>
              <Input
                type="text"
                placeholder="Ej: Mesa Fachera para exterior"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "altura", label: "Altura" },
                { key: "largo", label: "Largo" },
                { key: "ancho", label: "Ancho" },
                { key: "materialPrincipal", label: "Material principal" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#3b3535] mb-2">{label}</label>
                  <Input
                    type="text"
                    value={formData[key as keyof Omit<FormData, "estilos" | "materiales" | "herramientas">] as string}
                    onChange={(e) => handleInputChange(key as keyof Omit<FormData, "estilos" | "materiales" | "herramientas">, e.target.value)}
                    className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3535] mb-2">Descripción</label>
              <Textarea
                placeholder="Comenta un poco acerca de tu proyecto!"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b] min-h-[120px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3b3535] mb-2">Imagen de portada</label>
              <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-8 text-center bg-white/50">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload("coverImage", e.target.files)} className="hidden" id="cover-image-upload" />
                <label htmlFor="cover-image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-[#c89c6b] rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[#3b3535] font-medium">Subir imagen</span>
                  </div>
                </label>
                {uploadedFiles.coverImage && <p className="mt-2 text-sm text-[#656b48]">Archivo seleccionado: {uploadedFiles.coverImage.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#3b3535] mb-2">Imágenes</label>
                <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-6 text-center bg-white/50">
                  <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload("images", e.target.files)} className="hidden" id="images-upload" />
                  <label htmlFor="images-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-[#c89c6b] rounded-full flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[#3b3535] font-medium text-sm">Subir imágenes</span>
                    </div>
                  </label>
                  {uploadedFiles.images.length > 0 && <p className="mt-2 text-xs text-[#656b48]">{uploadedFiles.images.length} archivo(s) seleccionado(s)</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b3535] mb-2">Archivo tutorial</label>
                <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-6 text-center bg-white/50">
                  <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFileUpload("tutorialFile", e.target.files)} className="hidden" id="tutorial-upload" />
                  <label htmlFor="tutorial-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-10 h-10 bg-[#c89c6b] rounded-full flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[#3b3535] font-medium text-sm">Subir archivo</span>
                    </div>
                  </label>
                  {uploadedFiles.tutorialFile && <p className="mt-2 text-xs text-[#656b48]">Archivo seleccionado: {uploadedFiles.tutorialFile.name}</p>}
                </div>
              </div>
            </div>

            {[
              { key: "estilos", label: "Estilos", options: estilosOptions },
              { key: "materiales", label: "Materiales", options: materialesOptions },
              { key: "herramientas", label: "Herramientas", options: herramientasOptions },
            ].map(({ key, label, options }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#3b3535] mb-2">{label}</label>
                <Select onValueChange={(val) => handleMultiSelect(key as "estilos" | "materiales" | "herramientas", val)}>
                  <SelectTrigger className="w-full border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]">
                    Selecciona {label.toLowerCase()}
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData[key as "estilos" | "materiales" | "herramientas"] as string[]).map((val) => {
                    const opt = options.find((o) => o.value === val)
                    return (
                      <span
                        key={val}
                        className="flex items-center px-3 py-1 rounded-full text-sm bg-[#c89c6b] text-white"
                      >
                        {opt?.label}
                        <button type="button" onClick={() => handleMultiSelect(key as "estilos" | "materiales" | "herramientas", val)} className="ml-2">
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3b3535] mb-2">Tiempo de armado</label>
                <Input
                  type="text"
                  placeholder="Ej: 2-5 horas"
                  value={formData.tiempoArmado}
                  onChange={(e) => handleInputChange("tiempoArmado", e.target.value)}
                  className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3b3535] mb-2">Ambiente</label>
                <Input
                  type="text"
                  placeholder="Ej: Comedor"
                  value={formData.ambiente}
                  onChange={(e) => handleInputChange("ambiente", e.target.value)}
                  className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                />
              </div>
            </div>

            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}

            <div className="flex flex-col space-y-4 pt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || uploading}
                className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting || uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{uploading ? "Subiendo archivos..." : "Creando proyecto..."}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Publicar proyecto!</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
