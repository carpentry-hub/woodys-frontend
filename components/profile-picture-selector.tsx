import { useState } from 'react';
import { useProfilePictures } from '@/hooks/useProfilePictures';
import { ProfilePicture } from '@/models/profile-picture';

interface ProfilePictureSelectorProps {
  currentPictureId?: number;
  onSelect: (id: number, url: string) => void;
}

export default function ProfilePictureSelector({ currentPictureId, onSelect }: ProfilePictureSelectorProps) {
    const { pictures, loading, error } = useProfilePictures();
    const [selectedId, setSelectedId] = useState(currentPictureId);

    if (loading) return <div>Cargando imágenes...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const handleSelect = (pic: ProfilePicture) => {
        setSelectedId(pic.id);
        onSelect(pic.id, pic.referenced);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-3 gap-4">
                {pictures.map(pic => (
                    <button
                        key={pic.id}
                        className={`border-2 rounded-full p-1 transition-all ${
                            selectedId === pic.id ? 'border-[#c1835a]' : 'border-transparent'
                        }`}
                        onClick={() => handleSelect(pic)}
                        type="button"
                    >
                        <img src={pic.referenced} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}