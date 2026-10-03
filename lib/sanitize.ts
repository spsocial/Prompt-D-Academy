import 'server-only';
import sanitizeHtml from 'sanitize-html';

/** HTML จากตัวแก้ไขบทเรียน (TipTap) → ปลอดภัยก่อนแสดงผล */
export function cleanHtml(html: string) {
  return sanitizeHtml(html || '', {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'h1', 'h2', 'h3', 'h4', 'iframe', 'figure', 'figcaption', 'mark', 'u', 's'],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
      '*': ['class'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'drive.google.com', 'player.vimeo.com'],
    transformTags: {
      a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: 'noopener noreferrer', ...(attribs.href?.startsWith('http') ? { target: '_blank' } : {}) } }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    },
  });
}
