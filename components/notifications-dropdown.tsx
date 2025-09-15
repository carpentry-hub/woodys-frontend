'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
}

const notifications = [
    {
        id: 1,
        type: 'comment_reply',
        project: 'Biblioteca En Madera Maciza',
        user: {
            name: 'Agustín Sánchez',
            avatar: '/placeholder.svg?height=40&width=40',
        },
        time: 'hace 3 semanas',
        preview:
      'Te falto aclarar en el instructivo que la madera maciza puede ser roble, fresno, pino, o Guatambú que recomiendo mucho por .....',
        isRead: false,
    },
    {
        id: 2,
        type: 'comment_reply',
        project: 'Biblioteca En Madera Maciza',
        user: {
            name: 'Tiago Di Stefano',
            avatar: '/placeholder.svg?height=40&width=40',
        },
        time: 'hace 3 semanas',
        preview: 'yo lo hice con fibrofácil y quedó bastante bien no soporta tanto peso, pero reduce costos',
        isRead: false,
    },
];

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-96 bg-[#f2f0eb] rounded-2xl shadow-xl z-50 border border-[#f6f6f6]">
                <div className="p-6">
                    {/* Header */}
                    <h3 className="text-xl font-semibold text-[#3b3535] mb-6">Notificaciones</h3>

                    {/* Notifications List */}
                    <div className="space-y-6">
                        {notifications.map((notification) => (
                            <div key={notification.id}>
                                {/* Project Context */}
                                <p className="text-[#3b3535] text-sm mb-3">Te han respondido en &quot;{notification.project}&quot;</p>

                                {/* Notification Card */}
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-10 h-10 flex-shrink-0">
                                            <AvatarImage src={notification.user.avatar || '/placeholder.svg'} />
                                            <AvatarFallback>
                                                {notification.user.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-[#c1835a] font-medium text-sm">{notification.user.name}</h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[#adadad] hover:text-[#3b3535] text-xs px-3 py-1 h-auto"
                                                >
                          Ver más
                                                </Button>
                                            </div>

                                            <p className="text-[#adadad] text-xs mb-2">{notification.time}</p>

                                            <p className="text-[#3b3535] text-sm leading-relaxed">{notification.preview}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className="mt-6 text-center">
                        <Button variant="ghost" className="text-[#c1835a] hover:text-[#3b3535] font-medium" onClick={onClose}>
              Ver todas las notificaciones
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
