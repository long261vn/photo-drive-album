/**
 * Design: Long Nguyen personal image archive — an Explorer-inspired folder page.
 * Folder children use the same closed symbol at every level, while batch downloads send original files directly from Drive.
 */
import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, Check, ChevronRight, Download, Eye, EyeOff, FolderOpen, FolderTree, Grid2X2, Home, ImageIcon, List, Search, SlidersHorizontal, Square, X } from "lucide-react";
import { findAlbum, flattenAlbums, formatAlbumTitle, formatPhotoTitle, titleSearchText, type Album, type Photo } from "@/lib/albumData";
import { ArchiveProfileHeader } from "@/components/ArchiveProfileHeader";
import { ExplorerFolderPreview } from "@/components/ExplorerFolderPreview";
import { Lightbox } from "@/components/Lightbox";
import { LiturgicalFilters } from "@/components/LiturgicalFilters";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";
import { emptyLiturgicalFilters, getLiturgicalMetadata, liturgicalDetailLabels, liturgicalMetadataSearchText, matchesLiturgicalFilters, type LiturgicalFilters as LiturgicalFiltersState } from "@/lib/liturgicalMetadata";
import { downloadPhotosIndividually, type DirectDownloadProgress } from "@/lib/photoDownload";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type GalleryView = "large" | "small" | "details";

const galleryViews: Array<{ id: GalleryView; label: string; icon: typeof ImageIcon }> = [
  { id: "large", label: "Biểu tượng lớn", icon: FolderOpen },
  { id: "small", label: "Biểu tượng nhỏ", icon: Grid2X2 },
  { id: "details", label: "Chi tiết", icon: List },
];

type AlbumContentItem =
  | { kind: "collection"; album: Album }
  | { kind: "photo"; photo: Photo };

const normalizeSearch = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("vi");

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const [, setLocation] = useLocation();
  const { albums, profile, isLoading } = useArchiveManifest();
  const album = findAlbum(albums, params?.slug ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryView, setGalleryView] = useState<GalleryView>("details");
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [liturgicalFilters, setLiturgicalFilters] = useState<LiturgicalFiltersState>(emptyLiturgicalFilters);
  const [query, setQuery] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [downloadProgress, setDownloadProgress] = useState<DirectDownloadProgress | null>(null);
  const [downloadNotice, setDownloadNotice] = useState("");
  const { registerTap } = useSyncWorkflowShortcut();
  const debouncedQuery = useDebouncedValue(query);
  const normalizedQuery = useMemo(() => normalizeSearch(debouncedQuery.trim()), [debouncedQuery]);
  const albumPhotos = useMemo(() => album ? flattenAlbums([album]).flatMap((entry) => entry.photos) : [], [album]);
  const seasons = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).season).filter((season): season is string => Boolean(season)))), [albumPhotos]);
  const years = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).liturgicalYear).filter((year): year is "A" | "B" | "C" => Boolean(year)))).sort(), [albumPhotos]);
  const weeks = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location)).filter((metadata) => !liturgicalFilters.season || metadata.season === liturgicalFilters.season).map((metadata) => metadata.week).filter((week): week is number => Number.isFinite(week)))).sort((first, second) => first - second), [albumPhotos, liturgicalFilters.season]);
  if (isLoading) return <main className="folder-page-loading" aria-busy="true" aria-live="polite"><p className="eyebrow">Đang mở Thư mục</p><h1>Đang chuẩn bị nội dung…</h1><span /><span /><span /></main>;
  if (!album) return <main className="not-found-page"><p className="eyebrow">Không tìm thấy</p><h1>Thư mục này chưa có trong danh mục.</h1><Link href="/folders" className="text-link">Quay về Thư mục gốc</Link></main>;

  const parentAlbum = album.parentSlug ? findAlbum(albums, album.parentSlug) : undefined;
  const childAlbums = album.children ?? [];
  const isVisiblePhoto = (photo: Photo) => (showBackgrounds || !photo.isBackground) && matchesLiturgicalFilters(getLiturgicalMetadata(photo.title, photo.location), liturgicalFilters);
  const matchesPhotoSearch = (photo: Photo) => !normalizedQuery || normalizeSearch([titleSearchText(photo.title), titleSearchText(photo.location), liturgicalMetadataSearchText(photo.title, photo.location)].join(" ")).includes(normalizedQuery);
  const visiblePhotos = album.photos.filter((photo) => isVisiblePhoto(photo) && matchesPhotoSearch(photo));
  const collectionHasMatch = (entry: Album) => !normalizedQuery || flattenAlbums([entry]).some((nested) => normalizeSearch(titleSearchText(nested.title)).includes(normalizedQuery) || nested.photos.some((photo) => isVisiblePhoto(photo) && matchesPhotoSearch(photo)));
  const visibleChildAlbums = childAlbums.filter(collectionHasMatch);
  const visibleAssetCount = (entry: Album): number => entry.photos.filter(isVisiblePhoto).length + (entry.children ?? []).reduce((total, child) => total + visibleAssetCount(child), 0);
  const visibleDesignCount = visibleAssetCount(album);
  const contentItemCount = visibleChildAlbums.length + visiblePhotos.length;
  const hasAlbumContent = childAlbums.length + album.photos.length > 0;
  const selectedIndex = selectedPhoto ? visiblePhotos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;
  const selectOffset = (offset: number) => setSelectedPhoto(visiblePhotos[(selectedIndex + offset + visiblePhotos.length) % visiblePhotos.length]);
  const selectedPhotos = visiblePhotos.filter((photo) => selectedPhotoIds.has(photo.id));
  const isDownloading = Boolean(downloadProgress);
  const downloadProgressMessage = !downloadProgress ? "" : downloadProgress.phase === "preparing"
    ? "Đang chuẩn bị gửi yêu cầu tải…"
    : `Đã gửi tải ${downloadProgress.completed}/${downloadProgress.total} hình từ Drive…`;
  const togglePhotoSelection = (photo: Photo) => setSelectedPhotoIds((current) => {
    const next = new Set(current);
    if (next.has(photo.id)) next.delete(photo.id);
    else next.add(photo.id);
    return next;
  });
  const closeSelection = () => { setSelectionMode(false); setSelectedPhotoIds(new Set()); };
  const downloadPhotos = async (photos: Photo[], source: "selection" | "folder") => {
    if (!photos.length || isDownloading) return;
    setDownloadNotice("");
    try {
      const result = await downloadPhotosIndividually(photos, setDownloadProgress);
      setDownloadNotice(`Đã gửi yêu cầu tải ${result.requested} hình. Hãy kiểm tra danh sách tải xuống của trình duyệt.`);
      if (source === "selection") closeSelection();
    } catch {
      setDownloadNotice("Chưa thể gửi yêu cầu tải các hình. Vui lòng thử lại.");
    } finally {
      setDownloadProgress(null);
    }
  };
  const downloadFolder = () => {
    if (albumPhotos.length > 20 && !window.confirm(`Thư mục này có ${albumPhotos.length} hình. Trình duyệt sẽ tải từng file và có thể hỏi cho phép tải nhiều tệp. Bạn muốn tiếp tục?`)) return;
    void downloadPhotos(albumPhotos, "folder");
  };
  const hasActiveOptions = showBackgrounds || Boolean(liturgicalFilters.season || liturgicalFilters.liturgicalYear || liturgicalFilters.week || liturgicalFilters.saintsOnly || liturgicalFilters.marianOnly || liturgicalFilters.childrenOnly);
  const renderCollectionDetail = (child: Album, index: number) => (
    <button className="folder-detail-row folder-detail-row--nested" key={child.id} type="button" role="listitem" onClick={() => setLocation(`/album/${child.slug}`)} aria-label={`Mở Thư mục ${formatAlbumTitle(child.title)}`}>
      <ExplorerFolderPreview album={child} size="detail" />
      <span className="folder-detail-row__name"><i>{String(index + 1).padStart(2, "0")}</i><strong>{formatAlbumTitle(child.title)}</strong></span>
      <span className="folder-detail-row__date"><CalendarDays size={14} strokeWidth={1.65} /> {child.date}</span>
      <span className="folder-detail-row__type"><FolderTree size={14} strokeWidth={1.65} /> Thư mục</span>
      <ChevronRight className="folder-detail-row__arrow" size={18} strokeWidth={1.75} />
    </button>
  );
  const renderPhotoDetail = (photo: Photo, index: number) => (
    <article className={`photo-list__row ${selectionMode && selectedPhotoIds.has(photo.id) ? "is-selected" : ""}`} key={photo.id} role="listitem">
      <button type="button" className="photo-list__preview" onClick={() => selectionMode ? togglePhotoSelection(photo) : setSelectedPhoto(photo)} aria-label={selectionMode ? `${selectedPhotoIds.has(photo.id) ? "Bỏ chọn" : "Chọn"} ${formatPhotoTitle(photo.title)}` : `Mở hình ${formatPhotoTitle(photo.title)}`}>
        {photo.src?.trim() ? <img src={photo.src} alt={formatPhotoTitle(photo.title)} loading="lazy" decoding="async" /> : <span className="photo-list__placeholder" aria-hidden="true" />}{selectionMode && <span className="photo-select-indicator" aria-hidden="true">{selectedPhotoIds.has(photo.id) ? <Check size={15} strokeWidth={2.2} /> : <Square size={15} strokeWidth={1.8} />}</span>}
      </button>
      <div className="photo-list__metadata"><span className="photo-list__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatPhotoTitle(photo.title)}</strong><span>{formatAlbumTitle(photo.location)} · {photo.date}</span><span className="photo-list__liturgical">{liturgicalDetailLabels(getLiturgicalMetadata(photo.title, photo.location)).join(" · ") || "Chưa phân loại"}</span>{getLiturgicalMetadata(photo.title, photo.location).celebrations[0] && <span className="photo-list__feast">{getLiturgicalMetadata(photo.title, photo.location).celebrations[0]}</span>}</div>
      <div className="photo-list__type"><span>{photo.mimeType?.replace("image/", "").toUpperCase() ?? "HÌNH ẢNH"}</span><span>Hình ảnh</span></div>
      <a href={photo.downloadUrl} target="_blank" rel="noreferrer" className="photo-list__download" aria-label={`Tải ${formatPhotoTitle(photo.title)}`}><Download size={16} strokeWidth={1.8} /><span>Tải</span></a>
    </article>
  );
  const renderCollectionTile = (child: Album, index: number) => (
    <button key={child.id} className="photo-tile photo-tile--collection explorer-content-folder" type="button" onClick={() => setLocation(`/album/${child.slug}`)} aria-label={`Mở Thư mục ${formatAlbumTitle(child.title)}`}>
      <ExplorerFolderPreview album={child} size={galleryView === "small" ? "small" : "large"} />
      <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatAlbumTitle(child.title)}</strong><em>Thư mục</em></span>
    </button>
  );
  const renderPhotoTile = (photo: Photo, index: number) => (
    <button key={photo.id} className={`photo-tile photo-tile--${photo.orientation}${selectionMode ? " is-selectable" : ""}${selectedPhotoIds.has(photo.id) ? " is-selected" : ""}`} type="button" onClick={() => selectionMode ? togglePhotoSelection(photo) : setSelectedPhoto(photo)} aria-label={selectionMode ? `${selectedPhotoIds.has(photo.id) ? "Bỏ chọn" : "Chọn"} ${formatPhotoTitle(photo.title)}` : `Mở hình ${formatPhotoTitle(photo.title)}`}>
      <span className="photo-tile__media">{photo.src?.trim() ? <img src={photo.src} alt={formatPhotoTitle(photo.title)} loading="lazy" decoding="async" /> : <span className="photo-tile__placeholder" aria-hidden="true" />}{selectionMode && <span className="photo-select-indicator" aria-hidden="true">{selectedPhotoIds.has(photo.id) ? <Check size={15} strokeWidth={2.2} /> : <Square size={15} strokeWidth={1.8} />}</span>}<span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" /><span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" /></span>
      <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatPhotoTitle(photo.title)}</strong><em>{formatAlbumTitle(photo.location)} · {photo.date}</em></span>
    </button>
  );

  return (
    <main className="album-page">
      <ArchiveProfileHeader profile={profile} />
      <header className="album-page__header"><button className="back-link" type="button" onClick={() => setLocation(parentAlbum ? `/album/${parentAlbum.slug}` : "/folders")}><ArrowLeft size={18} strokeWidth={1.8} /> {parentAlbum ? "Quay lại" : "Thư mục gốc"}</button><button className="album-page__home-link" type="button" onClick={() => setLocation("/")}><Home size={16} strokeWidth={1.8} /> Trở về Trang Chủ</button></header>
      <section className="album-intro"><div className="album-intro__copy"><p className="eyebrow">{album.subtitle}</p><h1>{formatAlbumTitle(album.title)}</h1><div className="album-intro__meta"><span><CalendarDays size={15} strokeWidth={1.7} /> {album.location}</span><span>{album.date}</span><span>{visibleDesignCount} hình</span></div></div></section>
      {isDownloading && downloadProgress && <section className="direct-download-progress" aria-live="polite" aria-label="Tiến trình gửi yêu cầu tải"><div className="direct-download-progress__heading"><span>{downloadProgressMessage}</span><strong>{downloadProgress.completed}/{downloadProgress.total}</strong></div><progress value={downloadProgress.completed} max={Math.max(downloadProgress.total, 1)} /><p>Mỗi hình được tải trực tiếp từ Google Drive. Nếu được hỏi, hãy cho phép trình duyệt tải nhiều tệp.</p></section>}
      {hasAlbumContent && <section className="contact-sheet" aria-label={`Nội dung trong Thư mục ${formatAlbumTitle(album.title)}`}>
        <div className="album-content-toolbar">
          <label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm trong Thư mục</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong Thư mục" />{query.trim() && query !== debouncedQuery && <span className="search-feedback">Đang tìm</span>}</label>
          <details className={`archive-options${hasActiveOptions ? " has-active-options" : ""}`}><summary><SlidersHorizontal size={16} strokeWidth={1.8} /> Lọc</summary><div className="archive-options__panel"><button className={`background-toggle ${showBackgrounds ? "is-active" : ""}`} type="button" onClick={() => setShowBackgrounds((visible) => !visible)} aria-pressed={showBackgrounds}>{showBackgrounds ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}<span>{showBackgrounds ? "Ẩn hình nền" : "Hiện hình nền"}</span></button><LiturgicalFilters filters={liturgicalFilters} seasons={seasons} years={years} weeks={weeks} onChange={setLiturgicalFilters} /></div></details>
          <div className="gallery-actions">
            {albumPhotos.length > 0 ? <button className="album-toolbar__download" type="button" onClick={downloadFolder} disabled={isDownloading}><Download size={15} strokeWidth={1.8} /> {isDownloading ? `Đã gửi ${downloadProgress?.completed ?? 0}/${downloadProgress?.total ?? albumPhotos.length}` : `Tải Thư mục (${albumPhotos.length})`}</button> : null}
            <button className={`gallery-selection-trigger ${selectionMode ? "is-active" : ""}`} type="button" onClick={() => selectionMode ? closeSelection() : setSelectionMode(true)} disabled={!visiblePhotos.length || isDownloading} aria-pressed={selectionMode}><Square size={15} strokeWidth={1.8} /><span>{selectionMode ? "Hủy chọn" : "Chọn nhiều hình"}</span></button>
            <div className="gallery-view-switch" role="group" aria-label="Kiểu hiển thị nội dung">
              {galleryViews.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" className={galleryView === id ? "is-active" : ""} onClick={() => setGalleryView(id)} aria-pressed={galleryView === id} title={label}>
                  <Icon size={15} strokeWidth={1.8} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {selectionMode && <div className="batch-download-bar" aria-live="polite"><span>{selectedPhotos.length} hình đã chọn</span><div><button type="button" onClick={() => setSelectedPhotoIds(new Set(visiblePhotos.map((photo) => photo.id)))} disabled={!visiblePhotos.length || isDownloading}>Chọn tất cả</button><button type="button" onClick={() => setSelectedPhotoIds(new Set())} disabled={!selectedPhotos.length || isDownloading}>Bỏ chọn</button><button className="batch-download-bar__primary" type="button" onClick={() => downloadPhotos(selectedPhotos, "selection")} disabled={!selectedPhotos.length || isDownloading}><Download size={15} strokeWidth={1.8} /> {downloadProgress ? `Đã gửi ${downloadProgress.completed}/${downloadProgress.total}` : `Tải từng hình (${selectedPhotos.length})`}</button><button className="batch-download-bar__close" type="button" onClick={closeSelection} disabled={isDownloading} aria-label="Đóng chọn nhiều hình"><X size={16} strokeWidth={1.8} /></button></div></div>}
        {downloadNotice && <p className="batch-download-notice" role="status">{downloadNotice}</p>}

        {contentItemCount > 0 ? galleryView === "details" ? <div className="folder-content-groups">
          {visibleChildAlbums.length > 0 && <section className="folder-content-group" aria-label="Thư mục con"><h2 className="folder-content-group__heading is-visually-hidden">Thư mục con</h2><div className="photo-list" role="list">{visibleChildAlbums.map(renderCollectionDetail)}</div></section>}
          {visiblePhotos.length > 0 && <section className="folder-content-group" aria-label="File hình"><h2 className="folder-content-group__heading is-visually-hidden">File hình</h2><div className="photo-list" role="list">{visiblePhotos.map(renderPhotoDetail)}</div></section>}
        </div> : <div className="folder-content-groups">
          {visibleChildAlbums.length > 0 && <section className="folder-content-group" aria-label="Thư mục con"><h2 className="folder-content-group__heading is-visually-hidden">Thư mục con</h2><div className={`photo-grid photo-grid--${galleryView}`}>{visibleChildAlbums.map(renderCollectionTile)}</div></section>}
          {visiblePhotos.length > 0 && <section className="folder-content-group" aria-label="File hình"><h2 className="folder-content-group__heading is-visually-hidden">File hình</h2><div className={`photo-grid photo-grid--${galleryView}`}>{visiblePhotos.map(renderPhotoTile)}</div></section>}
        </div> : <p className="empty-assets">{normalizedQuery ? "Chưa tìm thấy Thư mục hoặc hình phù hợp." : "Không có nội dung phù hợp với bộ lọc hiện tại."}</p>}
      </section>}
      {!hasAlbumContent && <section className="contact-sheet"><p className="empty-assets">Thư mục này chưa có hình ảnh hoặc Thư mục con công khai.</p></section>}
      <footer className="album-page__footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button><Link href="/folders">Về Thư mục gốc</Link></footer>
    {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={visiblePhotos.length} folderPath={formatAlbumTitle(album.title)} onOpenFolder={() => setSelectedPhoto(null)} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
    </main>
  );
}
