'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FiltersPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function FiltersPanel({ isOpen, onClose }: FiltersPanelProps) {
    const [selectedRooms, setSelectedRooms] = useState<string[]>(['Dormitorio', 'Comedor']);
    const [isStylesOpen, setIsStylesOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [roomSearch, setRoomSearch] = useState('');

    const rooms = [
        'Dormitorio',
        'Living / Sala de estar',
        'Comedor',
        'Cocina',
        'Oficina / Estudio',
        'Infantil',
        'Baño',
        'Exterior / Jardín',
        'Otro',
    ];

    const filteredRooms = rooms.filter((room) => room.toLowerCase().includes(roomSearch.toLowerCase()));

    const toggleRoom = (room: string) => {
        setSelectedRooms((prev) => (prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Filter Panel */}
            <div className="fixed left-0 top-0 h-full w-96 bg-[#f2f0eb] z-50 shadow-xl overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-[#3b3535]">Filtros</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                            <X className="w-5 h-5 text-[#3b3535]" />
                        </button>
                    </div>

                    {/* Room Type Filter */}
                    <div className="mb-6">
                        <div className="mb-4">
                            <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-[#f6f6f6] text-left">
                                <span className="text-[#3b3535]">Tipo de ambiente para el mueble</span>
                                <ChevronDown className="w-4 h-4 text-[#adadad]" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[#adadad] mb-2">Filtrar ambientes</p>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#adadad] w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar ambientes"
                                        value={roomSearch}
                                        onChange={(e) => setRoomSearch(e.target.value)}
                                        className="pl-10 bg-white border-[#f6f6f6] focus:ring-[#c1835a] focus:border-[#c1835a]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {filteredRooms.map((room) => (
                                    <label key={room} className="flex items-center space-x-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectedRooms.includes(room)}
                                                onChange={() => toggleRoom(room)}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                    selectedRooms.includes(room) ? 'bg-[#656b48] border-[#656b48]' : 'bg-white border-[#adadad]'
                                                }`}
                                            >
                                                {selectedRooms.includes(room) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-[#3b3535] text-sm">{room}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Styles Filter */}
                    <div className="mb-6">
                        <button
                            onClick={() => setIsStylesOpen(!isStylesOpen)}
                            className="w-full flex items-center justify-between p-3 text-left text-[#3b3535] hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <span>Estilos</span>
                            {isStylesOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#adadad]" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-[#adadad]" />
                            )}
                        </button>

                        {isStylesOpen && (
                            <div className="mt-3 p-4 bg-white rounded-lg border border-[#f6f6f6]">
                                <div className="space-y-3">
                                    {['Minimalista', 'Nórdico', 'Moderno', 'Japandi', 'Vintage', 'Industrial'].map((style) => (
                                        <label key={style} className="flex items-center space-x-3 cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" />
                                                <div className="w-5 h-5 rounded border-2 bg-white border-[#adadad] flex items-center justify-center"></div>
                                            </div>
                                            <span className="text-[#3b3535] text-sm">{style}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Assembly Time Filter */}
                    <div className="mb-8">
                        <button
                            onClick={() => setIsTimeOpen(!isTimeOpen)}
                            className="w-full flex items-center justify-between p-3 text-left text-[#3b3535] hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <span>Tiempo de armado</span>
                            {isTimeOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#adadad]" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-[#adadad]" />
                            )}
                        </button>

                        {isTimeOpen && (
                            <div className="mt-3 p-4 bg-white rounded-lg border border-[#f6f6f6]">
                                <div className="space-y-3">
                                    {['Menos de 2 horas', '2-5 horas', '5-10 horas', '10-20 horas', 'Más de 20 horas'].map((time) => (
                                        <label key={time} className="flex items-center space-x-3 cursor-pointer">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" />
                                                <div className="w-5 h-5 rounded border-2 bg-white border-[#adadad] flex items-center justify-center"></div>
                                            </div>
                                            <span className="text-[#3b3535] text-sm">{time}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Apply Filters Button */}
                    <Button
                        onClick={onClose}
                        className="w-full bg-[#656b48] hover:bg-[#3b3535] text-white py-4 text-lg font-semibold flex items-center justify-center space-x-2"
                    >
                        <Check className="w-5 h-5" />
                        <span>Aplicar filtros</span>
                    </Button>
                </div>
            </div>
        </>
    );
}
