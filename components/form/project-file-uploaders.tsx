'use client';

import { Button } from '@/components/ui/button';
import { UploadCloud, Plus, Trash2 } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableImagePreview } from './sortable-image-preview';
import type { ImagePreview } from '@/app/create-project/page';

import { useState } from 'react';
import type { ChangeEvent } from 'react';

type ProjectImageManagerProps = {
  coverPreview: string | null;
  onCoverChange: (files: FileList | null) => void;
  onCoverRemove: () => void;
  
  galleryImages: ImagePreview[];
  onGalleryChange: (files: FileList | null) => void;
  onGalleryRemove: (id: string) => void;
  
  maxFiles: number;
  maxSizeMB: number;
  allowedType: string;
};

export function ProjectImageManager({
    coverPreview,
    onCoverChange,
    onCoverRemove,
    galleryImages,
    onGalleryChange,
    onGalleryRemove,
    maxFiles,
    maxSizeMB,
    allowedType
}: ProjectImageManagerProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-[#3b3535] mb-2">Imágenes del Proyecto</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="md:col-span-1">
                    {!coverPreview ? (
                        <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-4 text-center bg-white/50 h-24 flex flex-col justify-center">
                            <input
                                type="file"
                                accept={allowedType}
                                onChange={(e) => onCoverChange(e.target.files)}
                                className="hidden"
                                id="cover-image-upload"
                            />
                            <label htmlFor="cover-image-upload" className="cursor-pointer flex flex-col items-center space-y-1">
                                <UploadCloud className="w-8 h-8 text-[#c89c6b]" />
                                <span className="text-[#3b3535] font-medium text-sm">Imagen de Portada (1)</span>
                                <span className="text-xs text-gray-500">Solo JPG, Máx {maxSizeMB}MB</span>
                            </label>
                        </div>
                    ) : (
                        <div className="relative w-full rounded-lg overflow-hidden border-2 border-[#c89c6b] bg-white/50">
                            <div className="absolute top-1 left-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center z-10 text-xs font-bold">
                                1
                            </div>
                            <img
                                src={coverPreview}
                                alt="Vista previa de portada"
                                className="w-[50%] h-auto object-cover justify-center flex align-middle m-auto"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                className="absolute top-2 right-2 z-10"
                                onClick={onCoverRemove}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Quitar Portada
                            </Button>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    {galleryImages.length === 0 ? (
                        <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-4 text-center bg-white/50 h-24 flex flex-col justify-center">
                            <input
                                type="file"
                                accept={allowedType}
                                multiple
                                onChange={(e) => onGalleryChange(e.target.files)}
                                className="hidden"
                                id="images-upload-initial"
                            />
                            <label htmlFor="images-upload-initial" className="cursor-pointer flex flex-col items-center space-y-1">
                                <Plus className="w-8 h-8 text-[#c89c6b]" />
                                <span className="text-[#3b3535] font-medium text-sm">Imágenes Adicionales</span>
                                <span className="text-xs text-gray-500">Máx {maxFiles} (JPG, {maxSizeMB}MB)</span>
                            </label>
                        </div>
                    ) : (
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Imágenes adicionales (Máx {maxFiles}). Arrastra para ordenar.</p>
                            <SortableContext items={galleryImages.map(img => img.id)} strategy={rectSortingStrategy}>
                                <div className="flex flex-row flex-wrap gap-3">
                                    {galleryImages.map((image, index) => (
                                        <SortableImagePreview
                                            key={image.id}
                                            id={image.id}
                                            preview={image.preview}
                                            onRemove={onGalleryRemove}
                                            number={index + 2}
                                        />
                                    ))}
                                    
                                    {galleryImages.length < maxFiles && (
                                        <div className="w-24 h-24 border-2 border-dashed border-[#c89c6b] rounded-lg text-center bg-white/50">
                                            <input
                                                type="file"
                                                accept={allowedType}
                                                multiple
                                                onChange={(e) => onGalleryChange(e.target.files)}
                                                className="hidden"
                                                id="images-upload-more"
                                            />
                                            <label htmlFor="images-upload-more" className="cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-1 text-[#3b3535] hover:bg-gray-50">
                                                <Plus className="w-6 h-6" />
                                                <span className="text-xs font-medium">Añadir</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const MAX_TUTORIAL_SIZE_MB = 25;
const MAX_TUTORIAL_SIZE = MAX_TUTORIAL_SIZE_MB * 1024 * 1024;

type TutorialFileUploaderProps = {
  file: File | null;
  onChange: (files: FileList | null) => void;
};

export function TutorialFileUploader({ file, onChange }: TutorialFileUploaderProps) {
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const files = e.target.files;

        if (!files || files.length === 0) {
            onChange(null);
            return;
        }

        const selectedFile = files[0];

        if (selectedFile.size > MAX_TUTORIAL_SIZE) {
            setError(`El archivo es demasiado grande. El máximo es ${MAX_TUTORIAL_SIZE_MB}MB.`);
            onChange(null);
            e.target.value = '';
        } else {
            onChange(files);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-[#3b3535] mb-2">Archivo tutorial</label>
            <div className="border-2 border-dashed border-[#c89c6b] rounded-lg p-6 text-center bg-white/50">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="tutorial-upload"
                />
                <label htmlFor="tutorial-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                    <UploadCloud className="w-10 h-10 text-[#c89c6b]" />
                    <span className="text-[#3b3535] font-medium text-sm">Subir archivo</span>
                    <span className="text-xs text-gray-500">Solo PDF (Máx {MAX_TUTORIAL_SIZE_MB}MB)</span>
                </label>
                
                {error && (
                    <p className="mt-2 text-xs text-red-600">{error}</p>
                )}
                {!error && file && (
                    <p className="mt-2 text-xs text-[#656b48]">Archivo seleccionado: {file.name}</p>
                )}
            </div>
        </div>
    );
}