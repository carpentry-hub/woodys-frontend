import type { Project } from '@/models/project';

type FormData = {
 title: string;
 altura: string;
 largo: string;
 ancho: string;
 materialPrincipal: string;
 description: string;
 estilos: string[];
 tiempoArmado: string;
 materiales: string[];
 herramientas: string[];
 ambiente: string;
 is_public: boolean;
};

type FileUrls = {
 portraitUrl: string;
 imageUrls: string[];
 tutorialUrl: string;
};

export function mapFormDataToProject(
    formData: FormData,
    fileUrls: FileUrls,
    ownerId: number
): Omit<Project, 'id' | 'average_rating' | 'rating_count' | 'created_at' | 'updated_at'> {
    const timeMatch = formData.tiempoArmado.match(/\d+/);
    const timeToBuild = timeMatch ? parseInt(timeMatch[0]) : 0;
    const height = parseFloat(formData.altura) || 0;
    const length = parseFloat(formData.largo) || 0;
    const width = parseFloat(formData.ancho) || 0;

    return {
        owner: ownerId,
        title: formData.title,
        materials: formData.materiales,
        tools: formData.herramientas,
        style: formData.estilos,
        portrait: fileUrls.portraitUrl,
        images: fileUrls.imageUrls,
        tutorial: fileUrls.tutorialUrl,
        description: formData.description,
        time_to_build: timeToBuild,
        is_public: formData.is_public,
        height: height,
        length: length,
        width: width,
        main_material: formData.materialPrincipal,
        environment: formData.ambiente,
    };
}