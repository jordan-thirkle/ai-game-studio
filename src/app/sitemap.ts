import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { assets } from '@/data/assets';

const SITE_URL = 'https://ai-game-studio.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${SITE_URL}/games`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/tools`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/assets`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/stats`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/docs/score-methodology`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/skills/graveyard`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/ledgers`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ];

  const toolPages = tools.map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: new Date(tool.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const assetPages = assets.map((asset) => ({
    url: `${SITE_URL}/assets/${asset.slug}`,
    lastModified: new Date(asset.addedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages, ...assetPages];
}
