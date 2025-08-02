import { useState } from "react";
import { useProfilePictures } from "@/hooks/useProfilePictures";
import { Button } from "@/components/ui/button";

interface ProfilePictureSelectorProps {
  currentPicture?: string;
  onSelect: (url: string) => void;
}

export default function ProfilePictureSelector({ currentPicture, onSelect }: ProfilePictureSelectorProps) {
  const { pictures, loading, error } = useProfilePictures();
  const [selected, setSelected] = useState(currentPicture || "");

  if (loading) return <div>Cargando imágenes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-4">
        {pictures.map(url => (
          <button
            key={url}
            className={`border-2 rounded-full p-1 transition-all ${selected === url ? "border-[#c1835a]" : "border-transparent"}`}
            onClick={() => { setSelected(url); onSelect(url); }}
            type="button"
          >
            <img src={url} alt="Foto de perfil" className="w-16 h-16 rounded-full object-cover" />
          </button>
        ))}
      </div>
      {selected && <Button className="bg-[#c1835a] text-white rounded-full" onClick={() => onSelect(selected)}>Confirmar selección</Button>}
    </div>
  );
}
