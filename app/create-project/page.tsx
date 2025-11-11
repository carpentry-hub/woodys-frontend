'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check, Loader2, AlertCircle } from 'lucide-react';
import { ResponsiveHeader } from '@/components/responsive-header';
import Image from 'next/image';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useFileUpload } from '@/hooks/useFileUpload';
import { createProject } from '@/app/services/projects';
import { getCurrentUserFromDB } from '@/app/services/users';
import { mapFormDataToProject } from '@/app/utils/project-mapper';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DescriptionEditor from '@/components/form/description-editor';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
    ProjectImageManager,
    TutorialFileUploader
} from '@/components/form/project-file-uploaders';

export type ImagePreview = {
  id: string;
  file: File;
  preview: string;
};

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
  ambiente: string,
  is_public: boolean
}

const MAX_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPE = 'image/jpeg';
const MAX_IMAGES = 10;

export default function CreateProjectPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { uploadFile, uploadMultipleFiles, uploading } = useFileUpload();
    
    const [formData, setFormData] = useState<FormData>({
        title: '',
        altura: '',
        largo: '',
        ancho: '',
        materialPrincipal: '',
        description: '',
        estilos: [],
        tiempoArmado: '',
        materiales: [],
        herramientas: [],
        ambiente: '',
        is_public: true,
    });

    const [uploadedFiles, setUploadedFiles] = useState<{
        coverImage: { file: File | null, preview: string | null },
        images: ImagePreview[],
        tutorialFile: File | null,
    }>({
        coverImage: { file: null, preview: null },
        images: [],
        tutorialFile: null,
    });

    const [imageError, setImageError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleInputChange = (field: keyof Omit<FormData, 'estilos' | 'materiales' | 'herramientas' | 'is_public'>, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value } as FormData));
    };

    const estilosOptions = [
        { value: 'minimalista', label: 'Minimalista' },
        { value: 'nordico', label: 'Nórdico' },
        { value: 'moderno', label: 'Moderno' },
        { value: 'japandi', label: 'Japandi' },
        { value: 'vintage', label: 'Vintage' },
        { value: 'industrial', label: 'Industrial' },
    ];

    const materialesOptions = [
        { value: 'madera-maciza', label: 'Madera maciza' },
        { value: 'mdf', label: 'MDF' },
        { value: 'contrachapado', label: 'Contrachapado' },
        { value: 'fibrofacil', label: 'Fibrofácil' },
        { value: 'pino', label: 'Pino' },
        { value: 'roble', label: 'Roble' },
    ];

    const herramientasOptions = [
        { value: 'sierra-circular', label: 'Sierra circular' },
        { value: 'taladro', label: 'Taladro' },
        { value: 'lijadora', label: 'Lijadora' },
        { value: 'router', label: 'Router' },
        { value: 'herramientas-manuales', label: 'Herr. manuales' },
    ];

    const ambienteOptions = [
        { value: 'comedor', label: 'Comedor' },
        { value: 'living', label: 'Living' },
        { value: 'cocina', label: 'Cocina' },
        { value: 'exterior', label: 'Exterior' },
        { value: 'dormitorio', label: 'Dormitorio' },
        { value: 'oficina', label: 'Oficina' },
        { value: 'baño', label: 'Baño' },
        { value: 'infantil', label: 'Infantil' },
        { value: 'otros', label: 'Otros' },
    ];


    const handleMultiSelect = (field: 'estilos' | 'materiales' | 'herramientas', value: string) => {
        setFormData((prev) => {
            const exists = prev[field].includes(value);
            return {
                ...prev,
                [field]: exists ? prev[field].filter((v) => v !== value) : [...prev[field], value],
            };
        });
    };

    const validateFile = (file: File): string | null => {
        if (file.type !== ALLOWED_IMAGE_TYPE) {
            return 'Formato inválido. Solo se permiten imágenes JPG.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return `Archivo demasiado grande. El máximo es ${MAX_SIZE_MB}MB.`;
        }
        return null;
    };

    const handleCoverImageChange = (files: FileList | null) => {
        setImageError(null);
        if (uploadedFiles.coverImage.preview) {
            URL.revokeObjectURL(uploadedFiles.coverImage.preview);
        }
        
        if (!files || files.length === 0) {
            setUploadedFiles(prev => ({ ...prev, coverImage: { file: null, preview: null }}));
            return;
        }
        
        const file = files[0];
        const error = validateFile(file);

        if (error) {
            setImageError(error);
            setUploadedFiles(prev => ({ ...prev, coverImage: { file: null, preview: null }}));
            return;
        }

        const preview = URL.createObjectURL(file);
        setUploadedFiles(prev => ({ ...prev, coverImage: { file, preview }}));
    };

    const handleImagesChange = (files: FileList | null) => {
        setImageError(null);
        if (!files) return;

        const newFiles: ImagePreview[] = [];
        const currentCount = uploadedFiles.images.length;

        if (currentCount + files.length > MAX_IMAGES) {
            setImageError(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
            return;
        }

        for (const file of Array.from(files)) {
            const error = validateFile(file);
            if (error) {
                setImageError(error);
                continue;
            }
            newFiles.push({
                id: `${file.name}-${Date.now()}`,
                file,
                preview: URL.createObjectURL(file)
            });
        }
        
        setUploadedFiles(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    };

    const handleTutorialChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setUploadedFiles(prev => ({ ...prev, tutorialFile: files[0] }));
        }
    };

    const removeCoverImage = () => {
        if (uploadedFiles.coverImage.preview) {
            URL.revokeObjectURL(uploadedFiles.coverImage.preview);
        }
        setUploadedFiles(prev => ({ ...prev, coverImage: { file: null, preview: null }}));
    };

    const removeImage = (id: string) => {
        const fileToRemove = uploadedFiles.images.find(img => img.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setUploadedFiles(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setUploadedFiles(prev => {
                const oldIndex = prev.images.findIndex(img => img.id === active.id);
                const newIndex = prev.images.findIndex(img => img.id === over.id);
                return {
                    ...prev,
                    images: arrayMove(prev.images, oldIndex, newIndex)
                };
            });
        }
    };

    useEffect(() => {
        const coverPreview = uploadedFiles.coverImage.preview;
        const galleryPreviews = uploadedFiles.images.map(img => img.preview);
        
        return () => {
            if (coverPreview) {
                URL.revokeObjectURL(coverPreview);
            }
            galleryPreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [uploadedFiles.coverImage.preview, uploadedFiles.images]);

    const handleSubmit = async () => {
        if (!user) {
            setSubmitError('Debes estar autenticado para crear un proyecto');
            return;
        }

        if (!formData.title.trim()) {
            setSubmitError('El título es obligatorio');
            return;
        }

        if (!formData.description.trim()) {
            setSubmitError('La descripción es obligatoria');
            return;
        }

        if (!uploadedFiles.coverImage.file) {
            setSubmitError('La imagen de portada es obligatoria');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const currentUser = await getCurrentUserFromDB();
            const projectTempId = Date.now().toString();
    
            const portraitUrl = await uploadFile(
                uploadedFiles.coverImage.file,
                `projects/${projectTempId}/portrait`
            );

            let imageUrls: string[] = [];
            const filesToUpload = uploadedFiles.images.map(img => img.file);
            if (filesToUpload.length > 0) {
                imageUrls = await uploadMultipleFiles(
                    filesToUpload,
                    `projects/${projectTempId}/images`
                );
            }

            let tutorialUrl = '';
            if (uploadedFiles.tutorialFile) {
                tutorialUrl = await uploadFile(
                    uploadedFiles.tutorialFile,
                    `projects/${projectTempId}/tutorial`
                );
            }

            const fileUrls = { portraitUrl, imageUrls, tutorialUrl };
            const projectData = mapFormDataToProject(formData, fileUrls, currentUser.id);
            const newProject = await createProject(projectData);
    
            router.push(`/project/${newProject.id}`);
    
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('Error al crear el proyecto. Intenta nuevamente.');
            }
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

                        {/* --- SECCIÓN 1: INFORMACIÓN PRINCIPAL --- */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-[#3b3535] border-b border-[#c89c6b]/50 pb-2">
                                Información Principal
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-[#3b3535] mb-2">Título</label>
                                <Input
                                    type="text"
                                    placeholder="Ej: Mesa Fachera para exterior"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Altura</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Ej: 45"
                                            value={formData.altura}
                                            onChange={(e) => handleInputChange('altura', e.target.value)}
                                            className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b] pr-10"
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                                            cm
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Largo</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Ej: 120"
                                            value={formData.largo}
                                            onChange={(e) => handleInputChange('largo', e.target.value)}
                                            className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b] pr-10"
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                                            cm
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Ancho</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Ej: 60"
                                            value={formData.ancho}
                                            onChange={(e) => handleInputChange('ancho', e.target.value)}
                                            className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b] pr-10"
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                                            cm
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Material principal</label>
                                    <Input
                                        type="text"
                                        placeholder="Ej: Madera de Pino"
                                        value={formData.materialPrincipal}
                                        onChange={(e) => handleInputChange('materialPrincipal', e.target.value)}
                                        className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-[#c89c6b]/30" />

                        {/* --- SECCIÓN 2: DESCRIPCIÓN --- */}
                        <div>
                            <label className="block text-xl font-semibold text-[#3b3535] mb-4">Descripción</label>
                            <DescriptionEditor
                                value={formData.description}
                                onChange={(html) => handleInputChange('description', html)}
                            />
                        </div>

                        <hr className="border-[#c89c6b]/30" />

                        {/* --- SECCIÓN 3: ARCHIVOS DEL PROYECTO --- */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#3b3535] border-b border-[#c89c6b]/50 pb-2">
                                Archivos del Proyecto
                            </h3>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <ProjectImageManager
                                    coverPreview={uploadedFiles.coverImage.preview}
                                    onCoverChange={handleCoverImageChange}
                                    onCoverRemove={removeCoverImage}
                                    galleryImages={uploadedFiles.images}
                                    onGalleryChange={handleImagesChange}
                                    onGalleryRemove={removeImage}
                                    maxFiles={MAX_IMAGES}
                                    maxSizeMB={MAX_SIZE_MB}
                                    allowedType={ALLOWED_IMAGE_TYPE}
                                />
                            </DndContext>

                            <TutorialFileUploader
                                file={uploadedFiles.tutorialFile}
                                onChange={handleTutorialChange}
                            />

                            {imageError && (
                                <div className="flex items-center p-3 rounded-md bg-red-50 border border-red-200">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <p className="text-sm text-red-700">{imageError}</p>
                                </div>
                            )}
                        </div>
                        
                        <hr className="border-[#c89c6b]/30" />

                        {/* --- SECCIÓN 4: CLASIFICACIÓN Y DETALLES --- */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#3b3535] border-b border-[#c89c6b]/50 pb-2">
                                Clasificación y Detalles
                            </h3>
                            
                            {[
                                { key: 'estilos', label: 'Estilos', options: estilosOptions },
                                { key: 'materiales', label: 'Materiales', options: materialesOptions },
                                { key: 'herramientas', label: 'Herramientas', options: herramientasOptions },
                            ].map(({ key, label, options }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">{label}</label>
                                    <Select onValueChange={(val) => handleMultiSelect(key as 'estilos' | 'materiales' | 'herramientas', val)}>
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
                                        {(formData[key as 'estilos' | 'materiales' | 'herramientas'] as string[]).map((val) => {
                                            const opt = options.find((o) => o.value === val);
                                            return (
                                                <span
                                                    key={val}
                                                    className="flex items-center px-3 py-1 rounded-full text-sm bg-[#c89c6b] text-white"
                                                >
                                                    {opt?.label}
                                                    <button type="button" onClick={() => handleMultiSelect(key as 'estilos' | 'materiales' | 'herramientas', val)} className="ml-2">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Tiempo de armado</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Ej: 4"
                                            value={formData.tiempoArmado}
                                            onChange={(e) => handleInputChange('tiempoArmado', e.target.value)}
                                            className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b] pr-12"
                                        />
                                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                                            horas
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#3b3535] mb-2">Ambiente</label>
                                    <Select onValueChange={(value) => handleInputChange('ambiente', value)} value={formData.ambiente}>
                                        <SelectTrigger className="w-full border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b]">
                                            <SelectValue placeholder="Selecciona un ambiente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ambienteOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* --- SECCIÓN 5: PUBLICAR --- */}
                        {submitError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {submitError}
                            </div>
                        )}

                        <div className="flex flex-col space-y-4 pt-6 border-t border-[#c89c6b]/30">
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || uploading}
                                className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {isSubmitting || uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{uploading ? 'Subiendo archivos...' : 'Creando proyecto...'}</span>
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
    );
}