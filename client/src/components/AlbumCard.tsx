/**
 * Design: Contemporary Editorial Archive.
 * Asymmetric album artifact with cobalt index tab and restrained metadata hierarchy.
 */
import { ArrowUpRight, Images } from "lucide-react";
import type { Album } from "@/lib/albumData";

type AlbumCardProps = {
  album: Album;
  order: number;
  onOpen: (slug: string) => void;
};

export function AlbumCard({ album, order, onOpen }: AlbumCardProps) {
  return (
    <article className={`album-card album-card--${order % 3}`}>
      <button
        className="album-card__image"
        type="button"
        onClick={() => onOpen(album.slug)}
        aria-label={`Mở album ${album.title}`}
      >
        <img src={album.cover} alt="" />
        <span className="album-card__wash" aria-hidden="true" />
        <span className="album-card__open" aria-hidden="true">
          <ArrowUpRight size={18} strokeWidth={1.7} />
        </span>
      </button>
      <div className="album-card__tab" aria-hidden="true">
        {String(order + 1).padStart(2, "0")}
      </div>
      <div className="album-card__body">
        <div className="album-card__meta">
          <span>{album.date}</span>
          <span>{album.location}</span>
        </div>
        <h2>{album.title}</h2>
        <div className="album-card__foot">
          <span>{album.subtitle}</span>
          <span className="album-card__count">
            <Images size={14} strokeWidth={1.7} /> {album.count} ảnh
          </span>
        </div>
      </div>
    </article>
  );
}
