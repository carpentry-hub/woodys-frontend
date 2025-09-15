'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                <div className="flex flex-col space-y-2">
                    {images.slice(0, 5).map((image, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`w-16 h-16 bg-[#ffffff] rounded-lg border overflow-hidden ${
                                selectedImage === i ? 'border-[#c1835a]' : 'border-[#f6f6f6]'
                            }`}
                        >
                            <Image
                                src={image || '/placeholder.svg'}
                                alt={`${productName} thumbnail ${i + 1}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                    {images.length > 5 && (
                        <div className="w-16 h-16 bg-[#c89c6b] rounded-lg flex items-center justify-center text-[#ffffff] font-bold">
              +{images.length - 5}
                        </div>
                    )}
                </div>

                <div className="flex-1 bg-[#ffffff] rounded-lg overflow-hidden relative">
                    <Image
                        src={images[selectedImage] || '/placeholder.svg'}
                        alt={productName}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                        priority
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 left-4 bg-[#656b48] hover:bg-[#3b3535] text-[#ffffff]"
                    >
            Guardar
                    </Button>
                </div>
            </div>
        </div>
    );
}
