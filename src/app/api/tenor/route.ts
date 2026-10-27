import { NextResponse } from "next/server";

// Usa tu variable de entorno en producción o el fallback para desarrollo local
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
          preview: item.images?.fixed_height_small?.url || item.images?.fixed_height?.url,
          original: item.images?.fixed_height?.url || item.images?.original?.url,
        }))
        .filter((g: any) => g.preview) || [];

    return NextResponse.json({ gifs });
  } catch (error) {
    return NextResponse.json({ gifs: [] }, { status: 500 });
  }
}