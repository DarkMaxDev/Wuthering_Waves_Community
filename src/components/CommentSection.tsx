"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmtDate } from "@/lib/utils";
import { Trash2, Image as ImageIcon, Search } from "lucide-react";

export default function CommentSection({ 
  postId, 
  comments, 
  meId, 
  isAdmin = false 
}: { 
  postId: string; 
  comments: any[]; 
  meId?: string; 
  isAdmin?: boolean; 
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"" | "image" | "gif" | "youtube" | "twitter">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [gifResults, setGifResults] = useState<any[]>([]);
  const [searchingGifs, setSearchingGifs] = useState(false);

  async function searchGifs(query: string) {
    if (!query.trim()) return;
    setSearchingGifs(true);
    try {
      const res = await fetch(`/api/tenor?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setGifResults(data.gifs || []);
    } catch (e) {
      console.error("Error al buscar GIFs", e);
    } finally {
      setSearchingGifs(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType: "post",
        target: postId,
        body,
        mediaUrl,
        mediaType,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      return setError(data.error || "Error al publicar comentario");
    }

    setBody("");
    setMediaUrl("");
    setMediaType("");
    setShowGifPicker(false);
    router.refresh();
  }

  // Función para eliminar comentario corregida
  async function handleRemove(commentId: string) {
    if (!confirm("¿Seguro que deseas eliminar este comentario?")) return;

    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Error al eliminar el comentario");
      return;
    }
    router.refresh();
  }

  return (
    <section className="mt-10 border-t border-slate-800 pt-6 max-w-2xl">
      <h3 className="text-2xl font-bold mb-4">Comentarios ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribe un comentario..."
          className="input min-h-24 w-full"
          required
        />
        
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => {
              const val = e.target.value;
              setMediaUrl(val);
              setMediaType(val.toLowerCase().includes("giphy.com") || val.toLowerCase().includes("tenor.com") || val.match(/\.gif$/i) ? "gif" : val ? "image" : "");
            }}
            placeholder="URL de imagen o GIF opcional..."
            className="input w-full text-sm flex-1"
          />
          <button
            type="button"
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              if (!showGifPicker && gifResults.length === 0) searchGifs("anime");
            }}
            className="btn text-xs flex items-center gap-1 bg-slate-800 text-slate-200 hover:bg-slate-700 whitespace-nowrap px-3 py-2"
          >
            <ImageIcon size={14} /> GIFs
          </button>
        </div>

        {showGifPicker && (
          <div className="p-3 bg-slate-900 rounded-md border border-slate-700 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={gifSearchQuery}
                onChange={(e) => setGifSearchQuery(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === "Enter") { 
                    e.preventDefault(); 
                    searchGifs(gifSearchQuery); 
                  } 
                }}
                placeholder="Busca un GIF..."
                className="input text-xs flex-1"
              />
              <button
                type="button"
                onClick={() => searchGifs(gifSearchQuery)}
                className="btn text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
              >
                <Search size={14} /> Buscar
              </button>
            </div>

            {searchingGifs && <p className="text-xs text-slate-400 text-center py-2">Buscando GIFs...</p>}
            
            {gifResults.length > 0 && (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {gifResults.map((gif, i) => (
                  <img
                    key={i}
                    src={gif.preview}
                    alt="GIF"
                    onClick={() => {
                      setMediaUrl(gif.original);
                      setMediaType("gif");
                      setShowGifPicker(false);
                    }}
                    className="h-20 w-full object-cover rounded cursor-pointer hover:opacity-80 border border-transparent hover:border-white transition-all"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Enviando..." : "Comentar"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((c: any) => {
          const authorId = c.author?._id || c.author;
          const canDelete = !!meId && (isAdmin || authorId === meId);

          return (
            <div key={c._id} className="card bg-slate-900/50 p-4 rounded-lg space-y-2 relative group">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{c.author?.username || "Usuario"}</span>
                <div className="flex items-center gap-2">
                  <span>{fmtDate(c.createdAt)}</span>
                  {canDelete && (
                    <button
                      onClick={() => handleRemove(c._id)}
                      className="text-red-400 hover:text-red-300 p-1 transition-colors"
                      title="Eliminar comentario"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm whitespace-pre-wrap">{c.body}</p>

              {c.mediaUrl && (
                <div className="mt-2">
                  {c.mediaType === "gif" || c.mediaUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <img 
                      src={c.mediaUrl} 
                      alt="Multimedia del comentario" 
                      className="h-48 w-full max-w-sm rounded-md object-cover border border-slate-800"
                    />
                  ) : (
                    <a 
                      href={c.mediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-400 underline break-all block"
                    >
                      🔗 {c.mediaUrl}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {!comments.length && <p className="text-slate-400 text-sm">Sé el primero en comentar esta noticia.</p>}
      </div>
    </section>
  );
}