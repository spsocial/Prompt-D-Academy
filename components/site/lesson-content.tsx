'use client';
import { useEffect, useRef } from 'react';

/** Lesson article HTML + a "คัดลอก" button on every code block (prompts, install commands). */
export function LessonContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.parentElement?.classList.contains('copy-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'copy-wrap';
      pre.replaceWith(wrap);
      wrap.appendChild(pre);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'คัดลอก';
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText.trim());
          btn.textContent = 'คัดลอกแล้ว ✓';
        } catch {
          btn.textContent = 'คัดลอกไม่ได้';
        }
        setTimeout(() => { btn.textContent = 'คัดลอก'; }, 1800);
      });
      wrap.appendChild(btn);
    });
  }, [html]);
  return <div ref={ref} className="prose prose-academy prose-lg mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
