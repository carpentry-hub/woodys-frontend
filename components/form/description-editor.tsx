'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useCallback, useState } from 'react';

import {
    Bold, Italic, Underline as LucideUnderline, List, Link2, Pilcrow, Heading1, Heading2, Heading3, X, Check,
} from 'lucide-react';

interface DescriptionEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const handleSetLink = useCallback(() => {
        if (!editor) return;
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        }
        setIsLinkInputVisible(false);
        setLinkUrl('');
    }, [editor, linkUrl]);


    if (!editor) {
        return null;
    }
    
   
    const colors = ['#C89C6B', '#C1835A', '#656B48'];
    const btnClass = (isActive: boolean = false) => `p-2 rounded ${isActive ? 'bg-[#c89c6b] text-white' : 'hover:bg-neutral-100'}`;
    const iconClass = 'w-4 h-4';

    return (
        <div className="border border-[#c89c6b] rounded-t-lg bg-white p-2 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1">
                {/* Estilos de Texto */}
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Negrita"><Bold className={iconClass} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Itálica"><Italic className={iconClass} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Subrayar"><LucideUnderline className={iconClass} /></button>
                
                <div className="w-[1px] h-6 bg-neutral-200 mx-2"></div>

                {/* Encabezados */}
                <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={btnClass(editor.isActive('paragraph'))} title="Texto Normal"><Pilcrow className={iconClass} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Encabezado 1"><Heading1 className={iconClass} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Encabezado 2"><Heading2 className={iconClass} /></button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Encabezado 3"><Heading3 className={iconClass} /></button>

                <div className="w-[1px] h-6 bg-neutral-200 mx-2"></div>
                
                {/* Lista y Link */}
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Lista"><List className={iconClass} /></button>
                <button type="button" onClick={() => { setIsLinkInputVisible(!isLinkInputVisible); setLinkUrl(editor.getAttributes('link').href || ''); }} className={btnClass(editor.isActive('link'))} title="Link"><Link2 className={iconClass} /></button>

                <div className="w-[1px] h-6 bg-neutral-200 mx-2"></div>

                {/* Colores */}
                {colors.map(color => (
                    <button key={color} type="button" onClick={() => editor.chain().setColor(color).run()} 
                        className={btnClass(editor.isActive('textStyle', { color }))} 
                        title={color}>
                        <div className="w-4 h-4 rounded-full border border-neutral-300" style={{ backgroundColor: color }}></div>
                    </button>
                ))}
                <button type="button" onClick={() => editor.chain().unsetColor().run()} 
                    title="Quitar Color" 
                    className="p-2 hover:bg-neutral-100 rounded"><X className={iconClass} /></button>
            </div>
            {isLinkInputVisible && (
                <div className="flex items-center gap-2 mt-2">
                    <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://ejemplo.com" className="bg-white border-[#c89c6b] focus:ring-[#c89c6b] focus:border-[#c89c6b] rounded px-2 py-1 text-sm flex-grow"/>
                    <button type="button" onClick={handleSetLink} className="p-2 bg-green-500 text-white rounded hover:bg-green-600"><Check className="w-4 h-4" /></button>
                    <button type="button" onClick={() => setIsLinkInputVisible(false)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><X className="w-4 h-4" /></button>
                </div>
            )}
        </div>
    );
};

export default function DescriptionEditor({ value, onChange }: DescriptionEditorProps) {
    const [, setForceRender] = useState(0);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: false }), // Desactivamos heading de StarterKit para configurarlo aparte
            Heading.configure({ levels: [1, 2, 3] }),
            Underline,
            Link.configure({ openOnClick: true, autolink: true }),
            TextStyle,
            Color,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onSelectionUpdate: () => {
            setForceRender(Date.now());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full p-3 outline-none prose prose-sm max-w-none',
            },
        },
    });

    return (
        <div>
            <EditorToolbar editor={editor} />
            <div className="border border-[#c89c6b] border-t-0 rounded-b-lg bg-white">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}