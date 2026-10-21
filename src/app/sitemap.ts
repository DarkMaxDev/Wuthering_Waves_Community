import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Character from "@/models/Character";
import Post from "@/models/Post";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BACKEND;

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
    await connectDB();

    const characters = await Character.find({}, "_id updatedAt").lean();
    const characterRoutes: MetadataRoute.Sitemap = characters.map(
      (char: any) => ({
        url: `${baseUrl}/characters/${char._id}`,
        lastModified: char.updatedAt ? new Date(char.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }),
    );

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
    return staticRoutes;
  }
}
