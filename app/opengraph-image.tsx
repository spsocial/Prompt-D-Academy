import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SITE } from '@/lib/config';

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const [bold, med] = await Promise.all(['Prompt-Bold.ttf', 'Prompt-Medium.ttf'].map((f) => readFile(path.join(process.cwd(), 'assets/fonts', f))));
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0a0b0e', color: '#ede9e1', fontFamily: 'Prompt',
        backgroundImage: 'radial-gradient(60% 80% at 0% 0%, rgba(76,132,255,.45), transparent 60%), radial-gradient(60% 80% at 100% 100%, rgba(255,122,51,.45), transparent 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, border: '3px solid #9468ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>PD</div>
          Prompt D Academy
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>เรียน AI ให้ใช้เป็นจริง</div>
          <div style={{ fontSize: 40, color: '#ff7a33', marginTop: 16 }}>ทุกคอร์สเรียนฟรี · ภาษาไทย</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Prompt', data: bold, weight: 700 }, { name: 'Prompt', data: med, weight: 500 }] },
  );
}
