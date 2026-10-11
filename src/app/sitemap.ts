import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wuthering-waves-community.onrender.com';

  // Aquí puedes agregar tus rutas estáticas principales
  const staticRoutes = [
    '',
    '/characters',
    '/community',
    '/news',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes];
}