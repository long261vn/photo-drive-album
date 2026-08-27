/** Design: Long Nguyen folder browser keeps one compact folder symbol and allows important folder names to occupy two calm lines. */
import { ChevronRight, Clock3, FolderTree } from "lucide-react";
import { formatAlbumTitle, type Album } from "@/lib/albumData";
import { ExplorerFolderPreview } from "@/components/ExplorerFolderPreview";

export type FolderBrowserView = "large" | "small" | "details";

type AlbumListProps = { albums: Album[]; onOpen: (slug: string) => void; view?: FolderBrowserView };

export function AlbumList({ albums, onOpen, view = "details" }: AlbumListProps) {
  if (view !== "details") return <div className={`folder-browser-grid folder-browser-grid--${view}`} aria-label="Danh sách Thư mục">
    {albums.map((album) => {
      return <button key={album.id} className="folder-browser-card" type="button" onClick={() => onOpen(album.slug)} aria-label={`Mở Thư mục ${formatAlbumTitle(album.title)}`}>
        <ExplorerFolderPreview album={album} size={view} />
        <span className="folder-browser-card__copy"><strong>{formatAlbumTitle(album.title)}</strong><em>Thư mục</em></span>
      </button>;
    })}
    {albums.length === 0 && <div className="empty-archive"><p>Chưa tìm thấy Thư mục phù hợp.</p></div>}
  </div>;

  return <div className="folder-detail-list" role="list" aria-label="Chi tiết Thư mục">
    <div className="folder-detail-list__heading" aria-hidden="true"><span>Tên</span><span>Ngày</span><span>Loại</span></div>
    {albums.map((album) => {
      return <button key={album.id} className="folder-detail-row" type="button" role="listitem" onClick={() => onOpen(album.slug)} aria-label={`Mở Thư mục ${formatAlbumTitle(album.title)}`}>
        <ExplorerFolderPreview album={album} size="detail" />
        <span className="folder-detail-row__name"><strong>{formatAlbumTitle(album.title)}</strong></span>
        <span className="folder-detail-row__date"><Clock3 size={14} strokeWidth={1.65} /> {album.date}</span>
        <span className="folder-detail-row__type"><FolderTree size={14} strokeWidth={1.65} /> Thư mục</span>
        <ChevronRight className="folder-detail-row__arrow" size={18} strokeWidth={1.75} />
      </button>;
    })}
    {albums.length === 0 && <div className="empty-archive"><p>Chưa tìm thấy Thư mục phù hợp.</p></div>}
  </div>;
}
