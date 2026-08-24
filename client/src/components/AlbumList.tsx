/**
 * Design: Liturgical profile archive. Dense rows make a large, date-driven archive legible without losing image presence.
 */
import { ArrowUpRight, CalendarDays, Images } from "lucide-react";
import type { Album } from "@/lib/albumData";

type AlbumListProps = { albums: Album[]; onOpen: (slug: string) => void };

export function AlbumList({ albums, onOpen }: AlbumListProps) {
  return <div className="album-list" aria-label="Danh sách album thiết kế">
    {albums.map((album, index) => <article key={album.id} className="album-list__row">
      <button className="album-list__thumbnail" type="button" onClick={() => onOpen(album.slug)} aria-label={`Mở album ${album.title}`}>
        <img src={album.cover} alt="" loading="lazy" decoding="async" />
      </button>
      <div className="album-list__index">{String(index + 1).padStart(2, "0")}</div>
      <div className="album-list__copy"><div className="album-list__meta"><span>{album.subtitle}</span><span><CalendarDays size={13} strokeWidth={1.7} /> {album.date}</span></div><h3>{album.title}</h3><p>{album.description}</p></div>
      <div className="album-list__stats"><span><Images size={15} strokeWidth={1.7} /> {album.count}</span><span>thiết kế</span></div>
      <button className="album-list__open" type="button" onClick={() => onOpen(album.slug)} aria-label={`Mở album ${album.title}`}><span>Mở album</span><ArrowUpRight size={17} strokeWidth={1.8} /></button>
    </article>)}
    {albums.length === 0 && <div className="empty-archive"><p>Chưa tìm thấy bộ thiết kế phù hợp.</p></div>}
  </div>;
}
