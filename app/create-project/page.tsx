'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { ResponsiveHeader } from '@/components/responsive-header';
import Image from 'next/image';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useFileUpload } from '@/hooks/useFileUpload';
import { createProject, getProject, updateProject, deleteProject } from '@/app/services/projects';
import { getCurrentUserFromDB } from '@/app/services/users';
import { mapFormDataToProject } from '@/app/utils/project-mapper';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Project } from '@/models/project';

export type ImagePreview = {
  id: string;
  file: File | null;
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

function CreateProjectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, appUser } = useAuth();
    const { uploadFile, uploadMultipleFiles, uploading } = useFileUpload();
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [projectId, setProjectId] = useState<number | null>(null);
    const [existingProject, setExistingProject] = useState<Project | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

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

    useEffect(() => {
        const editIdParam = searchParams.get('edit');
        if (editIdParam) {
            setIsPageLoading(true);
            setIsEditMode(true);
            const id = Number(editIdParam);
            setProjectId(id);

            getProject(id)
                .then(project => {
                    if (appUser && project.owner !== appUser.id) {
                        console.error('Permiso denegado: No eres el dueño de este proyecto.');
                        router.push('/');
                        return;
                    }
                    
                    setExistingProject(project);
                    
                    setFormData({
                        title: project.title,
                        altura: project.height.toString(),
                        largo: project.length.toString(),
                        ancho: project.width.toString(),
                        materialPrincipal: project.main_material,
                        description: project.description,
                        estilos: project.style,
                        tiempoArmado: project.time_to_build.toString(),
                        materiales: project.materials,
                        herramientas: project.tools,
                        ambiente: project.environment,
                        is_public: project.is_public,
                    });

                    setUploadedFiles({
                        coverImage: { file: null, preview: project.portrait },
                        images: project.images.map((url, index) => ({
                            id: `existing-${index}-${url}`,
                            file: null,
                            preview: url
                        })),
                        tutorialFile: null 
                    });

                    setIsPageLoading(false);
                })
                .catch(err => {
                    console.error('Error al cargar el proyecto para editar:', err);
                    setIsPageLoading(false);
                    router.push('/');
                });
        } else {
            setIsPageLoading(false);
        }
    }, [searchParams, appUser, user, router]);

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
        { value: 'fresno', label: 'Fresno' },
        { value: 'otros', label: 'Otros' },
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
        const newPreviews = uploadedFiles.images
            .filter(img => img.file !== null)
            .map(img => img.preview);
        
        const coverPreview = uploadedFiles.coverImage.file ? uploadedFiles.coverImage.preview : null;

        return () => {
            if (coverPreview) {
                URL.revokeObjectURL(coverPreview);
            }
            newPreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [uploadedFiles.coverImage, uploadedFiles.images]);


    const handleSubmit = async () => {
        if (!user || !appUser) {
            setSubmitError('Debes estar autenticado para esta acción.');
            return;
        }

        setSubmitError(null); 
        

        if (!formData.title.trim()) {
            setSubmitError('El título es obligatorio');
            return;
        }
        
        if (!formData.altura.trim()) {
            setSubmitError('La altura es obligatoria');
            return;
        }
        if (!formData.ancho.trim()) {
            setSubmitError('El ancho es obligatorio');
            return;
        }
        if (!formData.description.trim() || formData.description === '<p><br></p>') {
            setSubmitError('La descripción es obligatoria');
            return;
        }
        if (!formData.materialPrincipal.trim()) {
            setSubmitError('El material principal es obligatorio');
            return;
        }

        if (!isEditMode && !uploadedFiles.coverImage.file) {
            setSubmitError('La imagen de portada es obligatoria');
            return;
        }        


        if (!isEditMode && !uploadedFiles.tutorialFile) {
            setSubmitError('El archivo del tutorial es obligatorio');
            return;
        }
        
        if (formData.estilos.length === 0) {
            setSubmitError('Debes seleccionar al menos un estilo');
            return;
        }
        if (formData.materiales.length === 0) {
            setSubmitError('Debes seleccionar al menos un material');
            return;
        }
        if (formData.herramientas.length === 0) {
            setSubmitError('Debes seleccionar al menos una herramienta');
            return;
        }
        if (!formData.tiempoArmado.trim()) {
            setSubmitError('El tiempo de armado es obligatorio');
            return;
        }
        if (!formData.ambiente.trim()) {
            setSubmitError('El ambiente es obligatorio');
            return;
        }
        

        setIsSubmitting(true);

        try {
            if (isEditMode && projectId && existingProject) {
                
                let newPortraitUrl = null;
                if (uploadedFiles.coverImage.file) {
                    newPortraitUrl = await uploadFile(
                        uploadedFiles.coverImage.file,
                        `projects/${projectId}/portrait`
                    );
                }

                const newImageFiles = uploadedFiles.images
                    .map(img => img.file)
                    .filter((file): file is File => file !== null);
                
                let newImageUrls: string[] = [];
                if (newImageFiles.length > 0) {
                    newImageUrls = await uploadMultipleFiles(
                        newImageFiles,
                        `projects/${projectId}/images`
                    );
                }

                let newTutorialUrl = null;
                if (uploadedFiles.tutorialFile) {
                    newTutorialUrl = await uploadFile(
                        uploadedFiles.tutorialFile,
                        `projects/${projectId}/tutorial`
                    );
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const textData = mapFormDataToProject(formData, {} as any, appUser.id);
                
                const projectToUpdate: Project = {
                    ...existingProject,
                    ...textData,
                    portrait: newPortraitUrl || existingProject.portrait,
                    images: [
                        ...uploadedFiles.images.filter(img => img.file === null).map(img => img.preview),
                        ...newImageUrls
                    ],
                    tutorial: newTutorialUrl || existingProject.tutorial,
                };
                
                const updated = await updateProject(projectId, projectToUpdate);
                router.push(`/project/${updated.id}`);

            } else {
                
                const currentUser = await getCurrentUserFromDB();
                const projectTempId = Date.now().toString();
        
                const portraitUrl = await uploadFile(
                    uploadedFiles.coverImage.file!, 
                    `projects/${projectTempId}/portrait`
                );

                let imageUrls: string[] = [];
                const filesToUpload = uploadedFiles.images.map(img => img.file).filter(Boolean) as File[];
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
            }
        
        } catch (error: unknown) {
            if (error instanceof Error) {
                setSubmitError(error.message);
            } else {
                setSubmitError('Error al guardar el proyecto. Intenta nuevamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!isEditMode || !projectId) return;

        if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.')) {
            setIsDeleting(true);
            setSubmitError(null);
            try {
                await deleteProject(projectId);
                alert('Proyecto eliminado exitosamente.');
                router.push('/profile');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setSubmitError(error.message);
                } else {
                    setSubmitError('Error al eliminar el proyecto.');
                }
                setIsDeleting(false);
            }
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f2f0eb]">
                <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 bg-[#f2f0eb]">
            <ResponsiveHeader />
            <div className="mx-auto w-full max-w-6xl bg-white rounded-lg shadow-xl">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-[#3b3535]">
                            {isEditMode ? 'Editar Proyecto' : 'Crear un nuevo proyecto'}
                        </h2>
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

                        <div>
                            <label className="block text-xl font-semibold text-[#3b3535] mb-4">Descripción</label>
                            <DescriptionEditor
                                value={formData.description}
                                onChange={(html) => handleInputChange('description', html)}
                            />
                        </div>

                        <hr className="border-[#c89c6b]/30" />

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
                                            <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
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

                        {submitError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {submitError}
                            </div>
                        )}

                        <div className="flex flex-col space-y-4 pt-6 border-t border-[#c89c6b]/30">
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting || uploading || isDeleting}
                                className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {isSubmitting || uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{uploading ? 'Subiendo archivos...' : (isEditMode ? 'Actualizando...' : 'Publicando...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>{isEditMode ? 'Actualizar Proyecto' : 'Publicar Proyecto'}</span>
                                    </>
                                )}
                            </Button>
                            
                            {isEditMode && (
                                <Button 
                                    variant="destructive"
                                    onClick={handleDelete} 
                                    disabled={isSubmitting || uploading || isDeleting}
                                    className="w-full"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    <span className="ml-2">Eliminar Proyecto</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreateProjectPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-[#f2f0eb]">
                <Loader2 className="w-12 h-12 text-[#c1835a] animate-spin" />
            </div>
        }>
            <CreateProjectContent />
        </Suspense>
    );
}