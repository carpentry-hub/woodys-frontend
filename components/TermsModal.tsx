'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">

                <div className="flex items-center justify-between p-6 border-b border-[#c89c6b]/30">
                    <h2 className="text-xl font-bold text-[#3b3535]">Términos y Condiciones</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-gray-700">
                    <p>
                        Al utilizar esta plataforma, aceptas los siguientes Términos y Condiciones, los cuales rigen el uso del servicio y la publicación de proyectos.
                    </p>

                    <h3 className="text-lg font-semibold text-[#3b3535] mt-4">1. Exención de Responsabilidad</h3>
                    <p>
                        La plataforma actúa únicamente como un intermediario digital para la publicación de proyectos y tutoriales creados por terceros. No nos hacemos responsables por daños materiales, lesiones físicas, o accidentes que puedan ocurrir durante la réplica o ejecución de los proyectos aquí publicados.
                    </p>

                    <h3 className="text-lg font-semibold text-[#3b3535] mt-4">2. Riesgos Inherentes a la Carpintería</h3>
                    <p>
                        La carpintería es una actividad que implica riesgos significativos. El uso de herramientas manuales y eléctricas, así como la manipulación de materiales, puede resultar en lesiones graves si no se toman las precauciones necesarias. Es obligación y responsabilidad exclusiva del usuario utilizar Elementos de Protección Personal (EPP) adecuados (gafas de seguridad, protección auditiva, mascarillas, etc.) y operar las herramientas siguiendo las indicaciones de sus respectivos fabricantes.
                    </p>

                    <h3 className="text-lg font-semibold text-[#3b3535] mt-4">3. Responsabilidad del Autor (Ley 24.240)</h3>
                    <p>
                        En cumplimiento con la Ley de Defensa del Consumidor, quien publica un proyecto declara bajo juramento que la información técnica, materiales, medidas y pasos a seguir son ciertos, claros y detallados. El autor del proyecto asume total responsabilidad por la veracidad del contenido publicado.
                    </p>

                    <h3 className="text-lg font-semibold text-[#3b3535] mt-4">4. Moderación de Contenido</h3>
                    <p>
                        Nos reservamos el derecho de eliminar, sin previo aviso, cualquier proyecto que consideremos peligroso, que contenga información falsa o que infrinja normas de seguridad básicas.
                    </p>

                    <h3 className="text-lg font-semibold text-[#3b3535] mt-4">5. Revocación y Baja de Cuenta</h3>
                    <p>
                        Se garantiza al usuario el derecho a la libre rescisión del servicio. Podrás solicitar la baja de tu cuenta y la eliminación de tus proyectos en cualquier momento desde el panel de configuración de tu perfil de usuario, de forma sencilla y accesible.
                    </p>
                </div>

                <div className="p-6 border-t border-[#c89c6b]/30 bg-[#fcfbf9] rounded-b-lg flex justify-end">
                    <Button
                        onClick={onClose}
                        className="bg-[#656b48] hover:bg-[#3b3535] text-white px-8"
                    >
                        Entendido
                    </Button>
                </div>
            </div>
        </div>
    );
}