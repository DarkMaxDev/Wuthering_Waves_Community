// @/components/VideoEmbed.tsx
export function VideoEmbed({ url }: { url?: string }) {
  if (!url) return null;

  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg my-4">
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="YouTube video player"
          className="absolute top-0 left-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (url.includes("twitter.com") || url.includes("x.com")) {
    return (
      <div className="my-4 p-4 border border-slate-700 rounded-lg bg-slate-900 text-sm">
        <p className="mb-2 text-slate-400 font-medium">Publicación de X (Twitter):</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-400 hover:underline break-all"
        >
          {url}
        </a>
      </div>
    );
  }

  return null;
}