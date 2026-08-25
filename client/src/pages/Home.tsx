/**
 * Design: Compact Catholic image library. The homepage prioritizes a searchable, paginated album index and a clear chronological reading path; the Avatar remains a profile image while the quiet footer carries a concealed multi-tap owner shortcut.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronLeft, ChevronRight, Clock3, Search } from "lucide-react";
import { AlbumList } from "@/components/AlbumList";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { flattenAlbums, type Album } from "@/lib/albumData";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";

const PAGE_SIZE = 5;

const normalizeSearch = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("vi");

const searchAlbum = (album: Album, query: string): boolean => {
  const ownContent = [album.title, album.subtitle, ...album.photos.map((photo) => photo.title)].join(" ");
  return normalizeSearch(ownContent).includes(query) || (album.children ?? []).some((child) => searchAlbum(child, query));
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"created-desc" | "created-asc" | "name">("created-desc");
  const [page, setPage] = useState(1);
  const { registerTap } = useSyncWorkflowShortcut();
  const { albums, profile } = useArchiveManifest();
  const profileCover = profile.cover?.trim();
  const profileAvatar = profile.avatar?.trim();
  const normalizedQuery = useMemo(() => normalizeSearch(query.trim()), [query]);
  const filteredAlbums = useMemo(() => albums
    .filter((album) => !normalizedQuery || searchAlbum(album, normalizedQuery))
    .sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title, "vi");
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return sort === "created-desc" ? dateB - dateA : dateA - dateB;
    }), [albums, normalizedQuery, sort]);
  const assetCount = useMemo(() => flattenAlbums(albums).reduce((total, album) => total + album.photos.length, 0), [albums]);
  const pageCount = Math.max(1, Math.ceil(filteredAlbums.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageAlbums = filteredAlbums.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return <main className="archive-home">
    <section className="profile-shell" aria-label="Thông tin thư viện">
      <div className="profile-cover">{profileCover && <img src={profileCover} alt="Ảnh bìa thư viện" fetchPriority="high" />}</div>
      <div className="profile-summary">
        <div className="profile-avatar">{profileAvatar && <img src={profileAvatar} alt={`Avatar ${profile.name}`} />}</div>
        <div className="profile-copy"><h1>{profile.name}</h1>{profile.handle && <p className="profile-handle">{profile.handle}</p>}{profile.bio && <p className="profile-bio">{profile.bio}</p>}</div>
        <div className="profile-stats" aria-label="Thống Kê Thư Viện"><span><strong>{albums.length}</strong> Album</span><span><strong>{assetCount}</strong> Thiết Kế</span></div>
      </div>
    </section>
    <section className="archive-toolbar archive-toolbar--profile" id="albums">
      <div><p className="eyebrow">Danh Mục</p><h2>Album</h2><button className="archive-timeline-link" type="button" onClick={() => setLocation("/timeline")}><Clock3 size={15} strokeWidth={1.8} /> Xem Dòng Thời Gian</button></div>
      <div className="archive-toolbar__controls">
        <label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm Album hoặc tên hình</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm Album hoặc tên hình" /></label>
        <label className="archive-sort"><span>Sắp Xếp</span><select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setPage(1); }}><option value="created-desc">Mới Nhất</option><option value="created-asc">Cũ Nhất</option><option value="name">Tên A - Z</option></select><ChevronDown size={15} strokeWidth={1.8} /></label>
      </div>
    </section>
    <AlbumList albums={pageAlbums} startIndex={(currentPage - 1) * PAGE_SIZE} onOpen={(slug) => setLocation(`/album/${slug}`)} />
    {pageCount > 1 && <nav className="album-pagination" aria-label="Phân Trang Album"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /> Trước</button><span>Trang {currentPage} / {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount}>Sau <ChevronRight size={16} /></button></nav>}
    <footer className="site-footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button></footer>
  </main>;
}
