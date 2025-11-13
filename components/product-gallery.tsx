'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                {/* Thumbnails */}
                <div className="flex flex-col space-y-2">
                    {images.slice(0, 5).map((image, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`w-16 h-16 bg-white rounded-lg border overflow-hidden ${
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
                        <div className="w-16 h-16 bg-[#c89c6b] rounded-lg flex items-center justify-center text-white font-bold">
                            +{images.length - 5}
                        </div>
                    )}
                </div>

                {/* Main Image */}
                <div className="flex-1 bg-white border border-neutral-900/20 rounded-[22px] overflow-hidden relative w-[600px] h-[400px] flex items-center justify-center">
                    <Image
                        src={images[selectedImage] || '/placeholder.svg'}
                        alt={productName}
                        width={600}
                        height={400}
                        className="object-contain w-full h-full bg-white"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
