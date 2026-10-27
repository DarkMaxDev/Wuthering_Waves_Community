import { connectDB } from "@/lib/db";
import { handle, json } from "@/lib/api";
import Comment from "@/models/Comment";

export const GET = handle(async () => {
  await connectDB();
  
  // Buscar los últimos comentarios que contengan una mediaUrl (puedes filtrar por los que terminen en .gif o contengan tenor/giphy)
  const commentsWithGifs = await Comment.find(
    { mediaUrl: { $ne: "" }, mediaType: "gif" },
    { mediaUrl: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Filtrar para obtener una lista única de URLs de GIFs sin repetir
  const uniqueGifs = Array.from(new Set(commentsWithGifs.map((c) => c.mediaUrl)));

  return json({ gifs: uniqueGifs });
});