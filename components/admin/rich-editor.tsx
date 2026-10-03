'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Placeholder } from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Code, Link2, ImagePlus,
  Undo2, Redo2, Minus, Loader2, Pilcrow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/lib/admin-api';
import { useToast } from './ui';
import { YouTubeIcon as YtIcon } from '@/components/ui/brand-icons';

function Btn({ on, onClick, label, children, disabled }: { on?: boolean; onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} disabled={disabled} title={label} aria-label={label}
      className={cn('grid size-8 place-items-center rounded-lg transition disabled:opacity-30', on ? 'bg-fg text-bg' : 'text-fg-2 hover:bg-surface-2 hover:text-fg')}>
      {children}
    </button>
  );
}
const Sep = () => <span className="mx-1 h-5 w-px bg-line-strong" />;

function Toolbar({ ed, folder }: { ed: Editor; folder: string }) {
  const toast = useToast();
  const inp = useRef<HTMLInputElement>(null);
  const [up, setUp] = useState<number | null>(null);
  const [, force] = useState(0);
  useEffect(() => { const f = () => force((x) => x + 1); ed.on('transaction', f); return () => { ed.off('transaction', f); }; }, [ed]);
  const c = () => ed.chain().focus();
  const i = 'size-4';
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-line bg-surface/95 p-1.5 backdrop-blur">
      <Btn label="ย่อหน้าปกติ" on={ed.isActive('paragraph')} onClick={() => c().setParagraph().run()}><Pilcrow className={i} /></Btn>
      <Btn label="หัวข้อใหญ่" on={ed.isActive('heading', { level: 2 })} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className={i} /></Btn>
      <Btn label="หัวข้อย่อย" on={ed.isActive('heading', { level: 3 })} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className={i} /></Btn>
      <Sep />
      <Btn label="ตัวหนา" on={ed.isActive('bold')} onClick={() => c().toggleBold().run()}><Bold className={i} /></Btn>
      <Btn label="ตัวเอียง" on={ed.isActive('italic')} onClick={() => c().toggleItalic().run()}><Italic className={i} /></Btn>
      <Btn label="ขีดเส้นใต้" on={ed.isActive('underline')} onClick={() => c().toggleUnderline().run()}><Underline className={i} /></Btn>
      <Btn label="ขีดฆ่า" on={ed.isActive('strike')} onClick={() => c().toggleStrike().run()}><Strikethrough className={i} /></Btn>
      <Sep />
      <Btn label="รายการจุด" on={ed.isActive('bulletList')} onClick={() => c().toggleBulletList().run()}><List className={i} /></Btn>
      <Btn label="รายการตัวเลข" on={ed.isActive('orderedList')} onClick={() => c().toggleOrderedList().run()}><ListOrdered className={i} /></Btn>
      <Btn label="กล่องเน้น / คำพูด" on={ed.isActive('blockquote')} onClick={() => c().toggleBlockquote().run()}><Quote className={i} /></Btn>
      <Btn label="กล่องโค้ด / Prompt" on={ed.isActive('codeBlock')} onClick={() => c().toggleCodeBlock().run()}><Code className={i} /></Btn>
      <Btn label="เส้นคั่น" onClick={() => c().setHorizontalRule().run()}><Minus className={i} /></Btn>
      <Sep />
      <Btn label="ใส่ลิงก์" on={ed.isActive('link')} onClick={() => {
        const prev = ed.getAttributes('link').href as string | undefined;
        const url = window.prompt('วางลิงก์ (เว้นว่างเพื่อเอาลิงก์ออก)', prev ?? 'https://');
        if (url === null) return;
        if (!url) c().unsetLink().run(); else c().extendMarkRange('link').setLink({ href: url }).run();
      }}><Link2 className={i} /></Btn>
      <Btn label="ใส่รูป" disabled={up !== null} onClick={() => inp.current?.click()}>{up !== null ? <Loader2 className={cn(i, 'animate-spin')} /> : <ImagePlus className={i} />}</Btn>
      <Btn label="ฝังคลิป YouTube" onClick={() => { const u = window.prompt('วางลิงก์ YouTube'); if (u) c().setYoutubeVideo({ src: u }).run(); }}><YtIcon className={i} /></Btn>
      <Sep />
      <Btn label="ย้อนกลับ" disabled={!ed.can().undo()} onClick={() => c().undo().run()}><Undo2 className={i} /></Btn>
      <Btn label="ทำซ้ำ" disabled={!ed.can().redo()} onClick={() => c().redo().run()}><Redo2 className={i} /></Btn>
      {up !== null && <span className="ml-2 font-mono text-xs text-muted">อัปโหลดรูป {up}%</span>}
      <input ref={inp} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0]; e.target.value = ''; if (!f) return;
        setUp(0);
        try { const url = await uploadFile(folder, f, setUp); c().setImage({ src: url, alt: f.name }).run(); } catch (er) { toast((er as Error).message, 'err'); } finally { setUp(null); }
      }} />
    </div>
  );
}

export function RichEditor({ value, onChange, folder = 'content', placeholder = 'เขียนสรุปบทเรียน… (ใส่หัวข้อ รูป ลิงก์ และกล่อง Prompt ได้)' }: { value: string; onChange: (html: string) => void; folder?: string; placeholder?: string }) {
  const ed = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      Youtube.configure({ nocookie: true, width: 1280, height: 720 }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: { attributes: { class: 'prose prose-academy max-w-none px-5 py-4 focus:outline-none' } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  });
  // sync external value changes (e.g. after load)
  useEffect(() => { if (ed && value !== ed.getHTML() && !ed.isFocused) ed.commands.setContent(value || '', { emitUpdate: false }); }, [value, ed]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-bg focus-within:border-fg/40">
      {ed ? <Toolbar ed={ed} folder={folder} /> : <div className="h-11 border-b border-line" />}
      <EditorContent editor={ed} />
    </div>
  );
}
