/**
 * Design: Compact Catholic image library. The homepage prioritizes a searchable, paginated album index; the Avatar remains a profile image while the quiet footer carries the owner shortcut.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowDownRight, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { AlbumList } from "@/components/AlbumList";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { flattenAlbums } from "@/lib/albumData";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";

const PAGE_SIZE = 5;

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"created-desc" | "created-asc" | "name">("created-desc");
  const [page, setPage] = useState(1);
  const { isHolding, beginHold, cancelHold } = useSyncWorkflowShortcut();
  const { albums, profile } = useArchiveManifest();
  const filteredAlbums = useMemo(() => albums
    .filter((album) => `${album.title} ${album.subtitle}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title, "vi");
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return sort === "created-desc" ? dateB - dateA : dateA - dateB;
    }), [albums, query, sort]);
  const assetCount = useMemo(() => flattenAlbums(albums).reduce((total, album) => total + album.photos.length, 0), [albums]);
  const pageCount = Math.max(1, Math.ceil(filteredAlbums.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageAlbums = filteredAlbums.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return <main className="archive-home">
    <header className="site-header">
      <button className="brand-lockup" type="button" onClick={() => setLocation("/")} aria-label="Về trang chủ Thư Viện Hình Công Giáo"><span className="brand-symbol" aria-hidden="true" /><span>Thư Viện Hình Công Giáo</span></button>
      <a href="#albums" className="header-jump">Danh Mục <ArrowDownRight size={15} strokeWidth={1.8} /></a>
    </header>
    <section className="profile-shell" aria-label="Thông tin thư viện">
      <div className="profile-cover"><img src={profile.cover} alt="Ảnh bìa thư viện" fetchPriority="high" /></div>
      <div className="profile-summary">
        <div className="profile-avatar"><img src={profile.avatar} alt={`Avatar ${profile.name}`} /></div>
        <div className="profile-copy"><h1>{profile.name}</h1>{profile.handle && <p className="profile-handle">{profile.handle}</p>}{profile.bio && <p className="profile-bio">{profile.bio}</p>}</div>
        <div className="profile-stats" aria-label="Thống Kê Thư Viện"><span><strong>{albums.length}</strong> Album</span><span><strong>{assetCount}</strong> Thiết Kế</span></div>
      </div>
    </section>
    <section className="archive-toolbar archive-toolbar--profile" id="albums">
      <div><p className="eyebrow">Danh Mục</p><h2>Album</h2></div>
      <div className="archive-toolbar__controls">
        <label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm Album</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm Album" /></label>
        <label className="archive-sort"><span>Sắp Xếp</span><select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setPage(1); }}><option value="created-desc">Mới Nhất</option><option value="created-asc">Cũ Nhất</option><option value="name">Tên A - Z</option></select><ChevronDown size={15} strokeWidth={1.8} /></label>
      </div>
    </section>
    <AlbumList albums={pageAlbums} startIndex={(currentPage - 1) * PAGE_SIZE} onOpen={(slug) => setLocation(`/album/${slug}`)} />
    {pageCount > 1 && <nav className="album-pagination" aria-label="Phân Trang Album"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /> Trước</button><span>Trang {currentPage} / {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount}>Sau <ChevronRight size={16} /></button></nav>}
    <footer className="site-footer"><button className={`site-footer__sync-shortcut${isHolding ? " is-holding" : ""}`} type="button" onPointerDown={(event) => { if (event.pointerType !== "mouse" || event.button === 0) beginHold(); }} onPointerUp={cancelHold} onPointerLeave={cancelHold} onPointerCancel={cancelHold} onContextMenu={(event) => { event.preventDefault(); cancelHold(); }} onKeyDown={(event) => { if (!event.repeat && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); beginHold(); } }} onKeyUp={cancelHold} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button></footer>
  </main>;
}
