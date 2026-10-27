import { NextResponse } from "next/server";

const GIPHY_KEY = process.env.GIPHY_API_KEY || "dc6zaTOxFJmzC";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "anime";

  try {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=12&rating=g`
    );

    if (!res.ok) {
      return NextResponse.json({ gifs: [] });
    }

    const data = await res.json();

    const gifs =
      data.data
        ?.map((item: any) => ({
          // preview para mostrar en la cuadrícula de búsqueda
          preview: item.images?.fixed_height_small?.url || item.images?.fixed_height?.url,
          // original para guardar permanentemente en el comentario de MongoDB
          original: item.images?.fixed_height?.url || item.images?.original?.url,
        }))
        .filter((g: any) => g.preview && g.original) || [];

    return NextResponse.json({ gifs });
  } catch (error) {
    return NextResponse.json({ gifs: [] }, { status: 500 });
  }
}