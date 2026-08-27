/**
 * Design: Long Nguyen personal image archive — an Explorer-inspired folder page.
 * Folder children use the same closed symbol at every level, while batch downloads send original files directly from Drive.
 */
import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, Check, Download, Eye, EyeOff, FolderOpen, Grid2X2, ImageIcon, List, Square, X } from "lucide-react";
import { findAlbum, flattenAlbums, formatAlbumTitle, formatPhotoTitle, type Album, type Photo } from "@/lib/albumData";
import { ExplorerFolderPreview } from "@/components/ExplorerFolderPreview";
import { Lightbox } from "@/components/Lightbox";
import { LiturgicalFilters } from "@/components/LiturgicalFilters";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";
import { emptyLiturgicalFilters, getLiturgicalMetadata, liturgicalDetailLabels, matchesLiturgicalFilters, type LiturgicalFilters as LiturgicalFiltersState } from "@/lib/liturgicalMetadata";
import { downloadPhotosIndividually, type DirectDownloadProgress } from "@/lib/photoDownload";

type GalleryView = "large" | "small" | "details";

const galleryViews: Array<{ id: GalleryView; label: string; icon: typeof ImageIcon }> = [
  { id: "large", label: "Biểu tượng lớn", icon: FolderOpen },
  { id: "small", label: "Biểu tượng nhỏ", icon: Grid2X2 },
  { id: "details", label: "Chi tiết", icon: List },
];

type AlbumContentItem =
  | { kind: "collection"; album: Album }
  | { kind: "photo"; photo: Photo };

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const [, setLocation] = useLocation();
  const { albums, profile, isLoading } = useArchiveManifest();
  const album = findAlbum(albums, params?.slug ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryView, setGalleryView] = useState<GalleryView>("details");
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [liturgicalFilters, setLiturgicalFilters] = useState<LiturgicalFiltersState>(emptyLiturgicalFilters);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [downloadProgress, setDownloadProgress] = useState<DirectDownloadProgress | null>(null);
  const [downloadNotice, setDownloadNotice] = useState("");
  const { registerTap } = useSyncWorkflowShortcut();
  const albumPhotos = useMemo(() => album ? flattenAlbums([album]).flatMap((entry) => entry.photos) : [], [album]);
  const seasons = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).season).filter((season): season is string => Boolean(season)))), [albumPhotos]);
  const years = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).liturgicalYear).filter((year): year is "A" | "B" | "C" => Boolean(year)))).sort(), [albumPhotos]);
  const weeks = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location)).filter((metadata) => !liturgicalFilters.season || metadata.season === liturgicalFilters.season).map((metadata) => metadata.week).filter((week): week is number => Number.isFinite(week)))).sort((first, second) => first - second), [albumPhotos, liturgicalFilters.season]);

  if (isLoading) return <main className="folder-page-loading" aria-busy="true" aria-live="polite"><p className="eyebrow">Đang mở Thư mục</p><h1>Đang chuẩn bị nội dung…</h1><span /><span /><span /></main>;
  if (!album) return <main className="not-found-page"><p className="eyebrow">Không tìm thấy</p><h1>Thư mục này chưa có trong danh mục.</h1><Link href="/" className="text-link">Quay về Thư mục gốc</Link></main>;

  const parentAlbum = album.parentSlug ? findAlbum(albums, album.parentSlug) : undefined;
  const childAlbums = album.children ?? [];
  const isVisiblePhoto = (photo: Photo) => (showBackgrounds || !photo.isBackground) && matchesLiturgicalFilters(getLiturgicalMetadata(photo.title, photo.location), liturgicalFilters);
  const visiblePhotos = album.photos.filter(isVisiblePhoto);
  const collectionHasMatch = (entry: Album) => flattenAlbums([entry]).some((nested) => nested.photos.some(isVisiblePhoto));
  const visibleChildAlbums = childAlbums.filter(collectionHasMatch);
  const visibleAssetCount = (entry: Album): number => entry.photos.filter(isVisiblePhoto).length + (entry.children ?? []).reduce((total, child) => total + visibleAssetCount(child), 0);
  const visibleDesignCount = visibleAssetCount(album);
  const contentItems: AlbumContentItem[] = [
    ...visibleChildAlbums.map((child) => ({ kind: "collection" as const, album: child })),
    ...visiblePhotos.map((photo) => ({ kind: "photo" as const, photo })),
  ];
  const albumAvatar = profile.avatar?.trim();
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

  return (
    <main className="album-page">
      <header className="album-page__header"><button className="back-link" type="button" onClick={() => setLocation(parentAlbum ? `/album/${parentAlbum.slug}` : "/")}><ArrowLeft size={18} strokeWidth={1.8} /> {parentAlbum ? "Quay lại" : "Thư mục gốc"}</button>{albumAvatar ? <span className="album-page__avatar"><img src={albumAvatar} alt={`Avatar ${profile.name}`} /></span> : <span className="header-mark brand-symbol" aria-hidden="true" />}</header>
      <section className="album-intro"><div className="album-intro__index" aria-hidden="true">{album.id}</div><div className="album-intro__copy"><p className="eyebrow">{album.subtitle}</p><h1>{formatAlbumTitle(album.title)}</h1><div className="album-intro__meta"><span><CalendarDays size={15} strokeWidth={1.7} /> {album.location}</span><span>{album.date}</span><span>{visibleDesignCount} hình</span></div></div>{albumPhotos.length > 0 ? <button className="album-intro__download" type="button" onClick={downloadFolder} disabled={isDownloading}><Download size={16} strokeWidth={1.8} /> {isDownloading ? `Đã gửi ${downloadProgress?.completed ?? 0}/${downloadProgress?.total ?? albumPhotos.length}` : `Tải Thư mục (${albumPhotos.length})`}</button> : null}</section>
      {isDownloading && downloadProgress && <section className="direct-download-progress" aria-live="polite" aria-label="Tiến trình gửi yêu cầu tải"><div className="direct-download-progress__heading"><span>{downloadProgressMessage}</span><strong>{downloadProgress.completed}/{downloadProgress.total}</strong></div><progress value={downloadProgress.completed} max={Math.max(downloadProgress.total, 1)} /><p>Mỗi hình được tải trực tiếp từ Google Drive. Nếu được hỏi, hãy cho phép trình duyệt tải nhiều tệp.</p></section>}
      {contentItems.length > 0 && <section className="contact-sheet" aria-label={`Nội dung trong Thư mục ${formatAlbumTitle(album.title)}`}>
        <div className="contact-sheet__rule">
          <span>Nội dung Thư mục</span>
          <div className="gallery-actions">
            <span>{String(contentItems.length).padStart(2, "0")} Mục</span>
            <button className={`gallery-selection-trigger ${selectionMode ? "is-active" : ""}`} type="button" onClick={() => selectionMode ? closeSelection() : setSelectionMode(true)} disabled={!visiblePhotos.length || isDownloading} aria-pressed={selectionMode}><Square size={15} strokeWidth={1.8} /><span>{selectionMode ? "Hủy chọn" : "Chọn nhiều hình"}</span></button>
            <button className={`background-toggle ${showBackgrounds ? "is-active" : ""}`} type="button" onClick={() => setShowBackgrounds((visible) => !visible)} aria-pressed={showBackgrounds} title={showBackgrounds ? "Ẩn hình nền" : "Hiện hình nền"}>{showBackgrounds ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}<span>{showBackgrounds ? "Ẩn nền" : "Hiện nền"}</span></button>
            <div className="gallery-view-switch" role="group" aria-label="Kiểu hiển thị nội dung">
              {galleryViews.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" className={galleryView === id ? "is-active" : ""} onClick={() => setGalleryView(id)} aria-pressed={galleryView === id} title={label}>
                  <Icon size={15} strokeWidth={1.8} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <LiturgicalFilters filters={liturgicalFilters} seasons={seasons} years={years} weeks={weeks} onChange={setLiturgicalFilters} />
        {selectionMode && <div className="batch-download-bar" aria-live="polite"><span>{selectedPhotos.length} hình đã chọn</span><div><button type="button" onClick={() => setSelectedPhotoIds(new Set(visiblePhotos.map((photo) => photo.id)))} disabled={!visiblePhotos.length || isDownloading}>Chọn tất cả</button><button type="button" onClick={() => setSelectedPhotoIds(new Set())} disabled={!selectedPhotos.length || isDownloading}>Bỏ chọn</button><button className="batch-download-bar__primary" type="button" onClick={() => downloadPhotos(selectedPhotos, "selection")} disabled={!selectedPhotos.length || isDownloading}><Download size={15} strokeWidth={1.8} /> {downloadProgress ? `Đã gửi ${downloadProgress.completed}/${downloadProgress.total}` : `Tải từng hình (${selectedPhotos.length})`}</button><button className="batch-download-bar__close" type="button" onClick={closeSelection} disabled={isDownloading} aria-label="Đóng chọn nhiều hình"><X size={16} strokeWidth={1.8} /></button></div></div>}
        {downloadNotice && <p className="batch-download-notice" role="status">{downloadNotice}</p>}

        {galleryView === "details" ? (
          <div className="photo-list" role="list">
            {contentItems.map((item, index) => item.kind === "collection" ? (
              <article className="photo-list__row photo-list__row--collection" key={item.album.id} role="listitem">
                <button type="button" className="photo-list__preview photo-list__preview--collection" onClick={() => setLocation(`/album/${item.album.slug}`)} aria-label={`Mở Thư mục ${formatAlbumTitle(item.album.title)}`}><ExplorerFolderPreview album={item.album} size="detail" /></button>
                <div className="photo-list__metadata"><span className="photo-list__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatAlbumTitle(item.album.title)}</strong><span>Thư mục</span></div>
                <div className="photo-list__type"><span>Thư mục</span></div>
                <button type="button" className="photo-list__open" onClick={() => setLocation(`/album/${item.album.slug}`)} aria-label={`Mở Thư mục ${formatAlbumTitle(item.album.title)}`}><FolderOpen size={16} strokeWidth={1.8} /><span>Mở</span></button>
              </article>
            ) : (
              <article className={`photo-list__row ${selectionMode && selectedPhotoIds.has(item.photo.id) ? "is-selected" : ""}`} key={item.photo.id} role="listitem">
                <button type="button" className="photo-list__preview" onClick={() => selectionMode ? togglePhotoSelection(item.photo) : setSelectedPhoto(item.photo)} aria-label={selectionMode ? `${selectedPhotoIds.has(item.photo.id) ? "Bỏ chọn" : "Chọn"} ${formatPhotoTitle(item.photo.title)}` : `Mở hình ${formatPhotoTitle(item.photo.title)}`}>
                  {item.photo.src?.trim() ? <img src={item.photo.src} alt={formatPhotoTitle(item.photo.title)} loading="lazy" decoding="async" /> : <span className="photo-list__placeholder" aria-hidden="true" />}{selectionMode && <span className="photo-select-indicator" aria-hidden="true">{selectedPhotoIds.has(item.photo.id) ? <Check size={15} strokeWidth={2.2} /> : <Square size={15} strokeWidth={1.8} />}</span>}
                </button>
                <div className="photo-list__metadata"><span className="photo-list__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatPhotoTitle(item.photo.title)}</strong><span>{formatAlbumTitle(item.photo.location)} · {item.photo.date}</span><span className="photo-list__liturgical">{liturgicalDetailLabels(getLiturgicalMetadata(item.photo.title, item.photo.location)).join(" · ") || "Chưa phân loại"}</span>{getLiturgicalMetadata(item.photo.title, item.photo.location).celebrations[0] && <span className="photo-list__feast">{getLiturgicalMetadata(item.photo.title, item.photo.location).celebrations[0]}</span>}</div>
                <div className="photo-list__type"><span>{item.photo.mimeType?.replace("image/", "").toUpperCase() ?? "HÌNH ẢNH"}</span><span>Hình ảnh</span></div>
                <a href={item.photo.downloadUrl} target="_blank" rel="noreferrer" className="photo-list__download" aria-label={`Tải ${formatPhotoTitle(item.photo.title)}`}><Download size={16} strokeWidth={1.8} /><span>Tải</span></a>
              </article>
            ))}
          </div>
        ) : (
          <div className={`photo-grid photo-grid--${galleryView}`}>
            {contentItems.map((item, index) => item.kind === "collection" ? (
              <button key={item.album.id} className="photo-tile photo-tile--collection explorer-content-folder" type="button" onClick={() => setLocation(`/album/${item.album.slug}`)} aria-label={`Mở Thư mục ${formatAlbumTitle(item.album.title)}`}>
                <ExplorerFolderPreview album={item.album} size={galleryView === "small" ? "small" : "large"} />
                <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatAlbumTitle(item.album.title)}</strong><em>Thư mục</em></span>
              </button>
            ) : (
              <button key={item.photo.id} className={`photo-tile photo-tile--${item.photo.orientation}${selectionMode ? " is-selectable" : ""}${selectedPhotoIds.has(item.photo.id) ? " is-selected" : ""}`} type="button" onClick={() => selectionMode ? togglePhotoSelection(item.photo) : setSelectedPhoto(item.photo)} aria-label={selectionMode ? `${selectedPhotoIds.has(item.photo.id) ? "Bỏ chọn" : "Chọn"} ${formatPhotoTitle(item.photo.title)}` : `Mở hình ${formatPhotoTitle(item.photo.title)}`}>
                <span className="photo-tile__media">{item.photo.src?.trim() ? <img src={item.photo.src} alt={formatPhotoTitle(item.photo.title)} loading="lazy" decoding="async" /> : <span className="photo-tile__placeholder" aria-hidden="true" />}{selectionMode && <span className="photo-select-indicator" aria-hidden="true">{selectedPhotoIds.has(item.photo.id) ? <Check size={15} strokeWidth={2.2} /> : <Square size={15} strokeWidth={1.8} />}</span>}<span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" /><span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" /></span>
                <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatPhotoTitle(item.photo.title)}</strong><em>{formatAlbumTitle(item.photo.location)} · {item.photo.date}</em></span>
              </button>
            ))}
          </div>
        )}
      </section>}
      {contentItems.length === 0 && <section className="contact-sheet"><p className="empty-assets">Thư mục này chưa có hình ảnh hoặc Thư mục con công khai.</p></section>}
      <footer className="album-page__footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button><Link href="/">Về Thư mục gốc</Link></footer>
    {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={visiblePhotos.length} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
    </main>
  );
}
