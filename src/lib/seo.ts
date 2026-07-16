/**
 * JSON-LD Structured Data for SEO.
 * Generates schema.org markup for tools and assets.
 */
import type { Tool } from '@/data/tools';
import type { Asset } from '@/data/assets';

const SITE_URL = 'https://ai-game-studio.vercel.app';

export function generateToolJsonLd(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: tool.name,
    description: tool.description,
    url: `${SITE_URL}/tools/${tool.slug}`,
    codeRepository: 'https://github.com/jordan-thirkle/ai-game-studio',
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'Browser (Three.js)',
    license: tool.license === 'mit' ? 'https://opensource.org/licenses/MIT' : tool.license,
    version: tool.version,
    keywords: tool.seoKeywords.join(', '),
    applicationCategory: 'Game Development Tool',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateAssetJsonLd(asset: Asset) {
  const licenseUrl =
    asset.license === 'cc0'
      ? 'https://creativecommons.org/publicdomain/zero/1.0/'
      : asset.license === 'cc-by'
        ? 'https://creativecommons.org/licenses/by/4.0/'
        : asset.license === 'mit'
          ? 'https://opensource.org/licenses/MIT'
          : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: asset.name,
    description: asset.description,
    url: `${SITE_URL}/assets/${asset.slug}`,
    ...(licenseUrl && { license: licenseUrl }),
    keywords: asset.seoKeywords.join(', '),
    dateCreated: asset.addedDate,
    fileFormat: asset.type,
    fileSize: `${asset.sizeKb}KB`,
    creator: {
      '@type': 'SoftwareApplication',
      name: asset.source,
      applicationCategory: 'AI Generation Tool',
    },
  };
}

export function generateCollectionJsonLd(
  items: (Tool | Asset)[],
  type: 'tools' | 'assets'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: type === 'tools' ? 'AI Game Studio Tool Library' : 'AI Game Studio Asset Library',
    description:
      type === 'tools'
        ? 'Reusable game development tools for AI agents and developers'
        : 'AI-generated game assets with full documentation and usage examples',
    url: `${SITE_URL}/${type}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${type}/${item.slug}`,
      name: item.name,
    })),
  };
}
