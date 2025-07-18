import { env } from '~/env';

type SitemapEntry = {
  url: string;
  lastModified: Date | string;
  changeFreq?: string;
  priority?: number;
};

export default async function Sitemap(): Promise<SitemapEntry[]> {
  const baseUrl = env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
  const sitemap: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1,
      changeFreq: 'weekly'
    }
  ];

  return sitemap;
}
