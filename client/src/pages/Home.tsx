/**
 * Design: Compact Catholic image library. The homepage prioritizes a searchable, paginated album index and a clear chronological reading path; the Avatar remains a profile image while the quiet footer carries a concealed multi-tap owner shortcut.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, FolderOpen, ImageIcon, Search } from "lucide-react";
import { AlbumList } from "@/components/AlbumList";
import { LibraryModeSwitch } from "@/components/LibraryModeSwitch";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { flattenAlbums, formatAlbumTitle, type Album, type Photo } from "@/lib/albumData";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";

const PAGE_SIZE = 5;
const SEARCH_PAGE_SIZE = 12;

const normalizeSearch = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("vi");

type SearchResult = { kind: "folder"; album: Album } | { kind: "photo"; album: Album; photo: Photo };

const searchArchive = (albums: Album[], query: string, showBackgrounds: boolean): SearchResult[] => albums.flatMap((album) => {
  const folderMatches = normalizeSearch([album.title, album.subtitle, album.description].join(" ")).includes(query);
  const directMatches = album.photos
    .filter((photo) => (showBackgrounds || !photo.isBackground) && normalizeSearch([photo.title, photo.location].join(" ")).includes(query))
    .map((photo) => ({ kind: "photo" as const, album, photo }));
  return [
    ...(folderMatches ? [{ kind: "folder" as const, album }] : []),
    ...directMatches,
    ...searchArchive(album.children ?? [], query, showBackgrounds),
  ];
});

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"created-desc" | "created-asc" | "name">("created-desc");
  const [page, setPage] = useState(1);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const { registerTap } = useSyncWorkflowShortcut();
  const { albums, profile } = useArchiveManifest();
  const profileCover = profile.cover?.trim();
  const profileAvatar = profile.avatar?.trim();
  const normalizedQuery = useMemo(() => normalizeSearch(query.trim()), [query]);
  const sortedAlbums = useMemo(() => albums
    .sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title, "vi");
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return sort === "created-desc" ? dateB - dateA : dateA - dateB;
    }), [albums, sort]);
  const searchResults = useMemo(() => normalizedQuery ? searchArchive(albums, normalizedQuery, showBackgrounds) : [], [albums, normalizedQuery, showBackgrounds]);
  const isSearching = normalizedQuery.length > 0;
  const assetCount = useMemo(() => flattenAlbums(albums).reduce((total, album) => total + album.photos.filter((photo) => showBackgrounds || !photo.isBackground).length, 0), [albums, showBackgrounds]);
  const pageSize = isSearching ? SEARCH_PAGE_SIZE : PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil((isSearching ? searchResults.length : sortedAlbums.length) / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageAlbums = sortedAlbums.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageResults = searchResults.slice((currentPage - 1) * SEARCH_PAGE_SIZE, currentPage * SEARCH_PAGE_SIZE);

  return <main className="archive-home">
    <section className="profile-shell" aria-label="Thông tin thư viện">
      <div className="profile-cover">{profileCover && <img src={profileCover} alt="Ảnh bìa thư viện" fetchPriority="high" />}</div>
      <div className="profile-summary">
        <div className="profile-avatar">{profileAvatar && <img src={profileAvatar} alt={`Avatar ${profile.name}`} />}</div>
        <div className="profile-copy"><h1>Thư Viện Hình Công Giáo</h1><p className="profile-copy__owner">{profile.name}</p>{profile.handle && <p className="profile-handle">{profile.handle}</p>}{profile.bio && <p className="profile-bio">{profile.bio}</p>}</div>
        <div className="profile-stats" aria-label="Thống Kê Thư Viện"><span><strong>{albums.length}</strong> Album</span><span><strong>{assetCount}</strong> Thiết Kế</span></div>
      </div>
    </section>
    <LibraryModeSwitch active="albums" />
    <section className="archive-toolbar archive-toolbar--profile" id="albums">
      <div><p className="eyebrow">Chế độ 01 · Danh mục</p><h2>Album</h2></div>
      <div className="archive-toolbar__controls">
        <label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm Album, Bộ Sưu Tập hoặc tên hình</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm Album, folder hoặc tên hình" /></label>
        <button className={`background-toggle archive-background-toggle ${showBackgrounds ? "is-active" : ""}`} type="button" onClick={() => { setShowBackgrounds((visible) => !visible); setPage(1); }} aria-pressed={showBackgrounds}>{showBackgrounds ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}<span>{showBackgrounds ? "Ẩn BG" : "Hiện BG"}</span></button>
        <label className="archive-sort"><span>Sắp Xếp</span><select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setPage(1); }}><option value="created-desc">Mới Nhất</option><option value="created-asc">Cũ Nhất</option><option value="name">Tên A - Z</option></select><ChevronDown size={15} strokeWidth={1.8} /></label>
      </div>
    </section>
    {isSearching ? <section className="search-results" aria-label="Kết quả tìm kiếm"><div className="search-results__rule"><span>{searchResults.length} Kết Quả</span><span>Tên folder và tên hình</span></div><div className="search-results__list">{pageResults.map((result, index) => {
      const isPhoto = result.kind === "photo";
      const title = isPhoto ? result.photo.title : formatAlbumTitle(result.album.title);
      const image = isPhoto ? result.photo.src : result.album.cover;
      const typeLabel = isPhoto ? "Hình Ảnh" : result.album.parentSlug ? "Bộ Sưu Tập" : "Album";
      return <article className="search-result" key={isPhoto ? result.photo.id : result.album.id}><button className="search-result__thumbnail" type="button" onClick={() => setLocation(`/album/${result.album.slug}`)} aria-label={`Mở ${title}`}>{image?.trim() ? <img src={image} alt="" loading="lazy" decoding="async" /> : <span className="album-list__thumbnail-placeholder" aria-hidden="true" />}{isPhoto ? <ImageIcon size={15} strokeWidth={1.8} /> : <FolderOpen size={15} strokeWidth={1.8} />}</button><div className="search-result__copy"><span>{String((currentPage - 1) * SEARCH_PAGE_SIZE + index + 1).padStart(2, "0")} · {typeLabel}</span><h3>{title}</h3><p>Trong {formatAlbumTitle(result.album.title)} · {result.album.date}</p></div><button className="search-result__open" type="button" onClick={() => setLocation(`/album/${result.album.slug}`)}>{isPhoto ? "Mở Album" : "Mở"}<ChevronRight size={16} strokeWidth={1.8} /></button></article>;
    })}{pageResults.length === 0 && <div className="empty-archive"><p>Chưa tìm thấy Album, Bộ Sưu Tập hoặc hình phù hợp.</p></div>}</div></section> : <AlbumList albums={pageAlbums} startIndex={(currentPage - 1) * PAGE_SIZE} onOpen={(slug) => setLocation(`/album/${slug}`)} />}
    {pageCount > 1 && <nav className="album-pagination" aria-label={isSearching ? "Phân Trang Kết Quả" : "Phân Trang Album"}><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /> Trước</button><span>{isSearching ? "Kết quả" : "Trang"} {currentPage} / {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount}>Sau <ChevronRight size={16} /></button></nav>}
    <footer className="site-footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button></footer>
  </main>;
}
