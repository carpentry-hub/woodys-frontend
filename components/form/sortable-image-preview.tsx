'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { GripVertical, Trash2 } from 'lucide-react';

type SortableImageProps = {
  id: string;
  preview: string;
  onRemove: (id: string) => void;
  number: number;
};

export function SortableImagePreview({ id, preview, onRemove, number }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300"
        >
            <div className="absolute top-1 left-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center z-10 text-xs font-bold">
                {number}
            </div>
            <Image
                src={preview}
                alt="Vista previa"
                layout="fill"
                objectFit="cover"
            />
            <button
                type="button"
                onClick={() => onRemove(id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center z-10 hover:bg-red-700"
                title="Eliminar imagen"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="absolute bottom-1 left-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
                title="Ordenar imagen"
            >
                <GripVertical className="w-4 h-4" />
            </button>
        </div>
    );
}