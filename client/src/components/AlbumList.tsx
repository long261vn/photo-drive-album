/** Design: Compact Catholic image library. Album rows preserve complete artwork while reducing metadata for large collections. */
import { ArrowUpRight, CalendarDays, Images } from "lucide-react";
import { formatAlbumTitle, type Album } from "@/lib/albumData";

type AlbumListProps = { albums: Album[]; startIndex?: number; onOpen: (slug: string) => void };

export function AlbumList({ albums, startIndex = 0, onOpen }: AlbumListProps) {
  return <div className="album-list" aria-label="Danh sách Album">
    {albums.map((album, index) => <article key={album.id} className="album-list__row">
      <button className="album-list__thumbnail" type="button" onClick={() => onOpen(album.slug)} aria-label={`Mở Album ${album.title}`}><img src={album.cover} alt="" loading="lazy" decoding="async" /></button>
      <div className="album-list__index">{String(startIndex + index + 1).padStart(2, "0")}</div>
      <div className="album-list__copy"><div className="album-list__meta"><span>{album.subtitle}</span><span><CalendarDays size={13} strokeWidth={1.7} /> {album.date}</span></div><h3>{formatAlbumTitle(album.title)}</h3></div>
      <div className="album-list__stats"><span><Images size={15} strokeWidth={1.7} /> {album.count}</span><span>Thiết Kế</span></div>
      <button className="album-list__open" type="button" onClick={() => onOpen(album.slug)} aria-label={`Mở Album ${album.title}`}><span>Mở Album</span><ArrowUpRight size={17} strokeWidth={1.8} /></button>
    </article>)}
    {albums.length === 0 && <div className="empty-archive"><p>Chưa tìm thấy Album phù hợp.</p></div>}
  </div>;
}
