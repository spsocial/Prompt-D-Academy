import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { AdSenseScript } from '@/components/site/ads';
import { JsonLd } from '@/components/site/json-ld';
import { ContactFab } from '@/components/site/contact-fab';
import { getNextLive, getSettings } from '@/lib/data';
import { LiveBanner } from '@/components/site/live-banner';
import { SITE } from '@/lib/config';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, next] = await Promise.all([getSettings(), getNextLive()]);
  return (
    <>
      <JsonLd data={[
        { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, url: SITE.url, logo: `${SITE.url}/logo-512.png`, description: SITE.description,
          sameAs: [settings.youtubeUrl, settings.facebookUrl, settings.tiktokUrl].filter(Boolean) },
        { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, inLanguage: 'th',
          potentialAction: { '@type': 'SearchAction', target: `${SITE.url}/courses?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
      ]} />
      <AdSenseScript client={settings.adsenseClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT} />
      <LiveBanner live={next && { slug: next.slug, title: next.title, startAt: next.startAt, durationMin: next.durationMin }} />
      <SiteHeader announcement={settings.announcement} announcementUrl={settings.announcementUrl} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
      <ContactFab lineUrl={settings.lineUrl} facebookUrl={settings.facebookUrl} />
    </>
  );
}
