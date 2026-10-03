// Brand marks drawn as inline SVG (lucide has no brand icons) — consistent 24px grid, currentColor.
type P = { className?: string; title?: string };
const S = ({ className, title, children, viewBox = '0 0 24 24' }: P & { children: React.ReactNode; viewBox?: string }) => (
  <svg viewBox={viewBox} className={className} fill="currentColor" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
    {children}
  </svg>
);

export const YouTubeIcon = (p: P) => (
  <S {...p}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" /></S>
);
export const FacebookIcon = (p: P) => (
  <S {...p}><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" /></S>
);
export const TikTokIcon = (p: P) => (
  <S {...p}><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.77.12V9.77a5.7 5.7 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15.4V9.06a7.33 7.33 0 0 0 4.29 1.37V7.35a4.29 4.29 0 0 1-3.23-1.53Z" /></S>
);
export const LineIcon = (p: P) => (
  <S {...p}><path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.56 7.39 8.36 8.03.33.07.77.22.88.5.1.25.07.65.03.9l-.14.86c-.04.25-.2.99.87.54 1.07-.45 5.77-3.4 7.87-5.82C21.31 13.55 22 11.92 22 10.13 22 5.64 17.52 2 12 2ZM8.08 12.6H6.1a.52.52 0 0 1-.52-.52V8.1a.52.52 0 0 1 1.04 0v3.46h1.46a.52.52 0 0 1 0 1.04Zm2.05-.52a.52.52 0 0 1-1.04 0V8.1a.52.52 0 0 1 1.04 0v3.98Zm4.78 0a.52.52 0 0 1-.94.31l-2.04-2.78v2.47a.52.52 0 0 1-1.04 0V8.1a.52.52 0 0 1 .94-.31l2.04 2.78V8.1a.52.52 0 0 1 1.04 0v3.98Zm3.2-2.51a.52.52 0 0 1 0 1.04h-1.46v.95h1.46a.52.52 0 0 1 0 1.04h-1.98a.52.52 0 0 1-.52-.52V8.1c0-.29.23-.52.52-.52h1.98a.52.52 0 0 1 0 1.04h-1.46v.95h1.46Z" /></S>
);
export const GoogleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.57.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4.01-3.1Z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77Z" />
  </svg>
);

/** Prompt D monogram — "P" bowl + "D" arc with the brand spectrum */
export const PDMark = ({ className }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <defs>
      <linearGradient id="pdg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="var(--blue)" /><stop offset=".55" stopColor="var(--violet)" /><stop offset="1" stopColor="var(--orange)" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="38" height="38" rx="11" fill="none" stroke="url(#pdg)" strokeWidth="2" />
    <path d="M11 30V10h7.2a6 6 0 0 1 0 12H11" fill="none" stroke="url(#pdg)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21.5 30h1.8a8.5 8.5 0 0 0 6.2-14.3" fill="none" stroke="url(#pdg)" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="30.6" cy="12.2" r="2.1" fill="var(--orange)" />
  </svg>
);
