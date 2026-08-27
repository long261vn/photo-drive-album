/**
 * Design: Long Nguyen personal image archive — the home is a Windows Explorer-inspired folder browser.
 * Folder navigation is intentionally distinct from the visual “Xem tất cả” timeline; it opens in a practical Details view by default.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, FolderOpen, Grid2X2, ImageIcon, List, Search, SlidersHorizontal } from "lucide-react";
import { AlbumList, type FolderBrowserView } from "@/components/AlbumList";
import { ArchiveProfileHeader } from "@/components/ArchiveProfileHeader";
import { ExplorerFolderPreview } from "@/components/ExplorerFolderPreview";
import { LibraryModeSwitch } from "@/components/LibraryModeSwitch";
import { Lightbox } from "@/components/Lightbox";
import { LiturgicalFilters } from "@/components/LiturgicalFilters";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { flattenAlbums, formatAlbumTitle, formatPhotoTitle, titleSearchText, type Album, type Photo } from "@/lib/albumData";
import { emptyLiturgicalFilters, getLiturgicalMetadata, liturgicalDetailLabels, liturgicalMetadataSearchText, matchesLiturgicalFilters, type LiturgicalFilters as LiturgicalFiltersState } from "@/lib/liturgicalMetadata";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";

const PAGE_SIZE = 24;
const SEARCH_PAGE_SIZE = 12;

const normalizeSearch = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("vi");

type SearchResult = { kind: "folder"; album: Album } | { kind: "photo"; album: Album; photo: Photo };

const folderViews: Array<{ id: FolderBrowserView; label: string; icon: typeof FolderOpen }> = [
  { id: "large", label: "Biểu tượng lớn", icon: FolderOpen },
  { id: "small", label: "Biểu tượng nhỏ", icon: Grid2X2 },
  { id: "details", label: "Chi tiết", icon: List },
];

const albumMatchesFilters = (album: Album, filters: LiturgicalFiltersState, showBackgrounds: boolean) => flattenAlbums([album]).some((entry) => entry.photos.some((photo) => (showBackgrounds || !photo.isBackground) && matchesLiturgicalFilters(getLiturgicalMetadata(photo.title, photo.location), filters)));

const searchArchive = (albums: Album[], query: string, showBackgrounds: boolean, filters: LiturgicalFiltersState): SearchResult[] => albums.flatMap((album) => {
  const folderMatches = normalizeSearch([titleSearchText(album.title), album.subtitle, album.description].join(" ")).includes(query);
  const directMatches = album.photos
    .filter((photo) => (showBackgrounds || !photo.isBackground) && matchesLiturgicalFilters(getLiturgicalMetadata(photo.title, photo.location), filters) && normalizeSearch([titleSearchText(photo.title), titleSearchText(photo.location), liturgicalMetadataSearchText(photo.title, photo.location)].join(" ")).includes(query))
    .map((photo) => ({ kind: "photo" as const, album, photo }));
  return [
    ...(folderMatches && albumMatchesFilters(album, filters, showBackgrounds) ? [{ kind: "folder" as const, album }] : []),
    ...directMatches,
    ...searchArchive(album.children ?? [], query, showBackgrounds, filters),
  ];
});

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"created-desc" | "created-asc" | "name">("created-desc");
  const [page, setPage] = useState(1);
  const [folderView, setFolderView] = useState<FolderBrowserView>("details");
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [liturgicalFilters, setLiturgicalFilters] = useState<LiturgicalFiltersState>(emptyLiturgicalFilters);
  const [selectedSearchPhoto, setSelectedSearchPhoto] = useState<Photo | null>(null);
  const { registerTap } = useSyncWorkflowShortcut();
  const { albums, profile } = useArchiveManifest();
  const debouncedQuery = useDebouncedValue(query);
  const normalizedQuery = useMemo(() => normalizeSearch(debouncedQuery.trim()), [debouncedQuery]);
  const allPhotos = useMemo(() => flattenAlbums(albums).flatMap((album) => album.photos), [albums]);
  const seasons = useMemo(() => Array.from(new Set(allPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).season).filter((season): season is string => Boolean(season)))), [allPhotos]);
  const years = useMemo(() => Array.from(new Set(allPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).liturgicalYear).filter((year): year is "A" | "B" | "C" => Boolean(year)))).sort(), [allPhotos]);
  const weeks = useMemo(() => Array.from(new Set(allPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location)).filter((metadata) => !liturgicalFilters.season || metadata.season === liturgicalFilters.season).map((metadata) => metadata.week).filter((week): week is number => Number.isFinite(week)))).sort((first, second) => first - second), [allPhotos, liturgicalFilters.season]);
  const sortedAlbums = useMemo(() => [...albums]
    .filter((album) => albumMatchesFilters(album, liturgicalFilters, showBackgrounds))
    .sort((a, b) => {
      if (sort === "name") return formatAlbumTitle(a.title).localeCompare(formatAlbumTitle(b.title), "vi");
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return sort === "created-desc" ? dateB - dateA : dateA - dateB;
    }), [albums, sort, liturgicalFilters, showBackgrounds]);
  const searchResults = useMemo(() => normalizedQuery ? searchArchive(albums, normalizedQuery, showBackgrounds, liturgicalFilters) : [], [albums, normalizedQuery, showBackgrounds, liturgicalFilters]);
  const searchPhotos = useMemo(() => searchResults.flatMap((result) => result.kind === "photo" ? [result.photo] : []), [searchResults]);
  const isSearching = normalizedQuery.length > 0;
  const pageSize = isSearching ? SEARCH_PAGE_SIZE : PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil((isSearching ? searchResults.length : sortedAlbums.length) / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageAlbums = sortedAlbums.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageResults = searchResults.slice((currentPage - 1) * SEARCH_PAGE_SIZE, currentPage * SEARCH_PAGE_SIZE);
  const selectedSearchIndex = selectedSearchPhoto ? searchPhotos.findIndex((photo) => photo.id === selectedSearchPhoto.id) : -1;
  const selectedSearchResult = selectedSearchPhoto ? searchResults.find((result): result is Extract<SearchResult, { kind: "photo" }> => result.kind === "photo" && result.photo.id === selectedSearchPhoto.id) : undefined;
  const hasActiveOptions = showBackgrounds || sort !== "created-desc" || Boolean(liturgicalFilters.season || liturgicalFilters.liturgicalYear || liturgicalFilters.week || liturgicalFilters.saintsOnly || liturgicalFilters.marianOnly || liturgicalFilters.childrenOnly);
  const moveSearchPhoto = (offset: number) => setSelectedSearchPhoto(searchPhotos[(selectedSearchIndex + offset + searchPhotos.length) % searchPhotos.length]);

  return <main className="archive-home">
    <ArchiveProfileHeader profile={profile} />
    <LibraryModeSwitch active="albums" />
    <section className="archive-toolbar archive-toolbar--profile folder-browser-toolbar" id="folders">
      <div className="archive-toolbar__controls">
        <label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm Thư mục hoặc tên hình</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Tìm Thư mục hoặc tên hình" />{query.trim() && query !== debouncedQuery && <span className="search-feedback">Đang tìm</span>}</label>
        <details className={`archive-options${hasActiveOptions ? " has-active-options" : ""}`}><summary><SlidersHorizontal size={16} strokeWidth={1.8} /> Tùy chọn</summary><div className="archive-options__panel"><button className={`background-toggle archive-background-toggle ${showBackgrounds ? "is-active" : ""}`} type="button" onClick={() => { setShowBackgrounds((visible) => !visible); setPage(1); }} aria-pressed={showBackgrounds}>{showBackgrounds ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}<span>{showBackgrounds ? "Ẩn hình nền" : "Hiện hình nền"}</span></button><label className="archive-sort"><span>Sắp xếp</span><select value={sort} onChange={(event) => { setSort(event.target.value as typeof sort); setPage(1); }}><option value="created-desc">Mới nhất</option><option value="created-asc">Cũ nhất</option><option value="name">Tên A - Z</option></select><ChevronDown size={15} strokeWidth={1.8} /></label><LiturgicalFilters filters={liturgicalFilters} seasons={seasons} years={years} weeks={weeks} onChange={(next) => { setLiturgicalFilters(next); setPage(1); }} /></div></details>
      </div>
      {!isSearching && <div className="folder-view-toolbar" role="group" aria-label="Kiểu hiển thị Thư mục">{folderViews.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={folderView === id ? "is-active" : ""} onClick={() => setFolderView(id)} aria-pressed={folderView === id} title={label}><Icon size={16} strokeWidth={1.8} /><span>{label}</span></button>)}</div>}
    </section>
    {isSearching ? <section className="search-results" aria-label="Kết quả tìm kiếm"><div className="search-results__rule"><span>{searchResults.length} Kết quả</span><span>Thư mục và hình ảnh</span></div><div className="search-results__list">{pageResults.map((result) => {
      const isPhoto = result.kind === "photo";
      const title = isPhoto ? formatPhotoTitle(result.photo.title) : formatAlbumTitle(result.album.title);
      const image = isPhoto ? result.photo.src : result.album.cover;
      const typeLabel = isPhoto ? "Hình ảnh" : result.album.parentSlug ? "Thư mục con" : "Thư mục";
      const details = isPhoto ? liturgicalDetailLabels(getLiturgicalMetadata(result.photo.title, result.photo.location)).join(" · ") : "";
      return <article className={`search-result ${isPhoto ? "search-result--photo" : "search-result--folder"}`} key={isPhoto ? result.photo.id : result.album.id}><button className="search-result__thumbnail" type="button" onClick={() => isPhoto ? setSelectedSearchPhoto(result.photo) : setLocation(`/album/${result.album.slug}`)} aria-label={isPhoto ? `Xem ảnh ${title}` : `Mở Thư mục ${title}`}>{isPhoto && image?.trim() ? <img src={image} alt="" loading="lazy" decoding="async" /> : isPhoto ? <span className="album-list__thumbnail-placeholder" aria-hidden="true" /> : <ExplorerFolderPreview album={result.album} size="detail" />}{isPhoto ? <ImageIcon size={15} strokeWidth={1.8} /> : null}</button><div className="search-result__copy"><span>{typeLabel}</span><h3>{title}</h3><p>Trong {formatAlbumTitle(result.album.title)} · {details || result.album.date}</p></div><button className="search-result__open" type="button" onClick={() => isPhoto ? setSelectedSearchPhoto(result.photo) : setLocation(`/album/${result.album.slug}`)}>{isPhoto ? "Xem ảnh" : "Mở thư mục"}<ChevronRight size={16} strokeWidth={1.8} /></button></article>;
    })}{pageResults.length === 0 && <div className="empty-archive"><p>Chưa tìm thấy Thư mục hoặc hình phù hợp.</p></div>}</div></section> : <AlbumList albums={pageAlbums} onOpen={(slug) => setLocation(`/album/${slug}`)} view={folderView} />}
    {pageCount > 1 && <nav className="album-pagination" aria-label={isSearching ? "Phân trang kết quả" : "Phân trang Thư mục"}><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /> Trước</button><span>{isSearching ? "Kết quả" : "Trang"} {currentPage} / {pageCount}</span><button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount}>Sau <ChevronRight size={16} /></button></nav>}
    <footer className="site-footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button></footer>
    {selectedSearchPhoto && <Lightbox photo={selectedSearchPhoto} folderPath={selectedSearchResult ? formatAlbumTitle(selectedSearchResult.album.title) : formatAlbumTitle(selectedSearchPhoto.location)} onOpenFolder={() => { setSelectedSearchPhoto(null); if (selectedSearchResult) setLocation(`/album/${selectedSearchResult.album.slug}`); }} onClose={() => setSelectedSearchPhoto(null)} onPrevious={() => moveSearchPhoto(-1)} onNext={() => moveSearchPhoto(1)} />}
  </main>;
}
