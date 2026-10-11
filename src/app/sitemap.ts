import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Character from "@/models/Character";
import Post from "@/models/Post";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://wuthering-waves-community.onrender.com";

  // 1. Rutas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/characters",
    "/community",
    "/news",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // 2. Conexión a la base de datos
    await connectDB();

    // 3. Obtener dinámicamente los personajes
    const characters = await Character.find({}, "_id updatedAt").lean();
    const characterRoutes: MetadataRoute.Sitemap = characters.map((char: any) => ({
      url: `${baseUrl}/characters/${char._id}`,
      lastModified: char.updatedAt ? new Date(char.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // 4. Obtener dinámicamente las publicaciones (noticias y comunidad)
    const posts = await Post.find({}, "_id kind updatedAt").lean();
    const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => {
      const routePrefix = post.kind === "news" ? "/news" : "/community";
      return {
        url: `${baseUrl}${routePrefix}/${post._id}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...characterRoutes, ...postRoutes];
  } catch (error) {
    console.error("Error al generar el sitemap dinámico:", error);
    // En caso de fallo en la BD, retorna al menos las rutas estáticas
    return staticRoutes;
  }
}