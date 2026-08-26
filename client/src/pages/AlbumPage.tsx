/**
 * Design: Liturgical Design Archive.
 * A mobile-first Drive-like browser that keeps photos and nested collections in one coherent set of views.
 */
import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, Download, Eye, EyeOff, FolderOpen, Grid2X2, ImageIcon, List } from "lucide-react";
import { findAlbum, flattenAlbums, formatAlbumTitle, formatPhotoTitle, type Album, type Photo } from "@/lib/albumData";
import { Lightbox } from "@/components/Lightbox";
import { LiturgicalFilters } from "@/components/LiturgicalFilters";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";
import { emptyLiturgicalFilters, getLiturgicalMetadata, liturgicalDetailLabels, matchesLiturgicalFilters, type LiturgicalFilters as LiturgicalFiltersState } from "@/lib/liturgicalMetadata";

type GalleryView = "large" | "grid" | "list";

const galleryViews: Array<{ id: GalleryView; label: string; icon: typeof ImageIcon }> = [
  { id: "large", label: "Xem lớn", icon: ImageIcon },
  { id: "grid", label: "Lưới", icon: Grid2X2 },
  { id: "list", label: "Danh sách", icon: List },
];

type AlbumContentItem =
  | { kind: "collection"; album: Album }
  | { kind: "photo"; photo: Photo };

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const [, setLocation] = useLocation();
  const { albums, profile } = useArchiveManifest();
  const album = findAlbum(albums, params?.slug ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryView, setGalleryView] = useState<GalleryView>("grid");
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [liturgicalFilters, setLiturgicalFilters] = useState<LiturgicalFiltersState>(emptyLiturgicalFilters);
  const { registerTap } = useSyncWorkflowShortcut();
  const albumPhotos = useMemo(() => album ? flattenAlbums([album]).flatMap((entry) => entry.photos) : [], [album]);
  const seasons = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).season).filter((season): season is string => Boolean(season)))), [albumPhotos]);
  const weeks = useMemo(() => Array.from(new Set(albumPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location)).filter((metadata) => !liturgicalFilters.season || metadata.season === liturgicalFilters.season).map((metadata) => metadata.week).filter((week): week is number => Number.isFinite(week)))).sort((first, second) => first - second), [albumPhotos, liturgicalFilters.season]);

  if (!album) return <main className="not-found-page"><p className="eyebrow">Không tìm thấy</p><h1>Bộ thiết kế này chưa có trong thư viện.</h1><Link href="/" className="text-link">Quay về danh mục</Link></main>;

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

  return (
    <main className="album-page">
      <header className="album-page__header"><button className="back-link" type="button" onClick={() => setLocation(parentAlbum ? `/album/${parentAlbum.slug}` : "/")}><ArrowLeft size={18} strokeWidth={1.8} /> {parentAlbum ? "Quay Lại" : "Tất Cả Thiết Kế"}</button>{albumAvatar ? <span className="album-page__avatar"><img src={albumAvatar} alt={`Avatar ${profile.name}`} /></span> : <span className="header-mark brand-symbol" aria-hidden="true" />}</header>
      <section className="album-intro"><div className="album-intro__index" aria-hidden="true">{album.id}</div><div className="album-intro__copy"><p className="eyebrow">{album.subtitle}</p><h1>{formatAlbumTitle(album.title)}</h1><div className="album-intro__meta"><span><CalendarDays size={15} strokeWidth={1.7} /> {album.location}</span><span>{album.date}</span><span>{visibleDesignCount} Thiết Kế</span>{visibleChildAlbums.length > 0 && <span>{visibleChildAlbums.length} Bộ Sưu Tập</span>}</div></div>{album.downloadAll && <a className="album-intro__download" href={album.downloadAll.url} target="_blank" rel="noreferrer"><Download size={16} strokeWidth={1.8} /> Tải Toàn Bộ Album</a>}</section>
      {contentItems.length > 0 && <section className="contact-sheet" aria-label={`Nội dung trong ${formatAlbumTitle(album.title)}`}>
        <div className="contact-sheet__rule">
          <span>Nội Dung Trong Album</span>
          <div className="gallery-actions">
            <span>{String(contentItems.length).padStart(2, "0")} Mục</span>
            <button className={`background-toggle ${showBackgrounds ? "is-active" : ""}`} type="button" onClick={() => setShowBackgrounds((visible) => !visible)} aria-pressed={showBackgrounds} title={showBackgrounds ? "Ẩn ảnh Background" : "Hiện ảnh Background"}>{showBackgrounds ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}<span>{showBackgrounds ? "Ẩn BG" : "Hiện BG"}</span></button>
            <div className="gallery-view-switch" role="group" aria-label="Chế độ xem nội dung">
              {galleryViews.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" className={galleryView === id ? "is-active" : ""} onClick={() => setGalleryView(id)} aria-pressed={galleryView === id} title={label}>
                  <Icon size={15} strokeWidth={1.8} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <LiturgicalFilters filters={liturgicalFilters} seasons={seasons} weeks={weeks} onChange={setLiturgicalFilters} />

        {galleryView === "list" ? (
          <div className="photo-list" role="list">
            {contentItems.map((item, index) => item.kind === "collection" ? (
              <article className="photo-list__row photo-list__row--collection" key={item.album.id} role="listitem">
                <button type="button" className="photo-list__preview photo-list__preview--collection" onClick={() => setLocation(`/album/${item.album.slug}`)} aria-label={`Mở Bộ Sưu Tập ${formatAlbumTitle(item.album.title)}`}>
                  {item.album.cover?.trim() ? <img src={item.album.cover} alt="" loading="lazy" decoding="async" /> : <span className="photo-list__placeholder" aria-hidden="true" />}<FolderOpen className="collection-folder-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <div className="photo-list__metadata"><span className="photo-list__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatAlbumTitle(item.album.title)}</strong><span>Bộ Sưu Tập · {item.album.count} Thiết Kế</span></div>
                <div className="photo-list__type"><span>{item.album.count} Ảnh</span><span>Bộ Sưu Tập</span></div>
                <button type="button" className="photo-list__open" onClick={() => setLocation(`/album/${item.album.slug}`)} aria-label={`Mở ${formatAlbumTitle(item.album.title)}`}><FolderOpen size={16} strokeWidth={1.8} /><span>Mở</span></button>
              </article>
            ) : (
              <article className="photo-list__row" key={item.photo.id} role="listitem">
                <button type="button" className="photo-list__preview" onClick={() => setSelectedPhoto(item.photo)} aria-label={`Mở thiết kế ${formatPhotoTitle(item.photo.title)}`}>
                  {item.photo.src?.trim() ? <img src={item.photo.src} alt={formatPhotoTitle(item.photo.title)} loading="lazy" decoding="async" /> : <span className="photo-list__placeholder" aria-hidden="true" />}
                </button>
                <div className="photo-list__metadata"><span className="photo-list__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatPhotoTitle(item.photo.title)}</strong><span>{formatAlbumTitle(item.photo.location)} · {item.photo.date}</span><span className="photo-list__liturgical">{liturgicalDetailLabels(getLiturgicalMetadata(item.photo.title, item.photo.location)).join(" · ") || "Chưa phân loại"}</span>{getLiturgicalMetadata(item.photo.title, item.photo.location).celebrations[0] && <span className="photo-list__feast">{getLiturgicalMetadata(item.photo.title, item.photo.location).celebrations[0]}</span>}</div>
                <div className="photo-list__type"><span>{item.photo.mimeType?.replace("image/", "").toUpperCase() ?? "HÌNH ẢNH"}</span><span>Hình Ảnh</span></div>
                <a href={item.photo.downloadUrl} target="_blank" rel="noreferrer" className="photo-list__download" aria-label={`Tải ${formatPhotoTitle(item.photo.title)}`}><Download size={16} strokeWidth={1.8} /><span>Tải</span></a>
              </article>
            ))}
          </div>
        ) : (
          <div className={`photo-grid photo-grid--${galleryView}`}>
            {contentItems.map((item, index) => item.kind === "collection" ? (
              <button key={item.album.id} className="photo-tile photo-tile--collection" type="button" onClick={() => setLocation(`/album/${item.album.slug}`)} aria-label={`Mở Bộ Sưu Tập ${formatAlbumTitle(item.album.title)}`}>
                <span className="photo-tile__media">{item.album.cover?.trim() ? <img src={item.album.cover} alt="" loading="lazy" decoding="async" /> : <span className="photo-tile__placeholder" aria-hidden="true" />}<span className="collection-tile__badge"><FolderOpen size={16} strokeWidth={1.8} /> Bộ Sưu Tập</span><span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" /><span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" /></span>
                <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatAlbumTitle(item.album.title)}</strong><em>{item.album.count} Thiết Kế · Mở Bộ Sưu Tập</em></span>
              </button>
            ) : (
              <button key={item.photo.id} className={`photo-tile photo-tile--${item.photo.orientation}`} type="button" onClick={() => setSelectedPhoto(item.photo)} aria-label={`Mở thiết kế ${formatPhotoTitle(item.photo.title)}`}>
                <span className="photo-tile__media">{item.photo.src?.trim() ? <img src={item.photo.src} alt={formatPhotoTitle(item.photo.title)} loading="lazy" decoding="async" /> : <span className="photo-tile__placeholder" aria-hidden="true" />}<span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" /><span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" /></span>
                <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{formatPhotoTitle(item.photo.title)}</strong><em>{formatAlbumTitle(item.photo.location)} · {item.photo.date}</em></span>
              </button>
            ))}
          </div>
        )}
      </section>}
      {contentItems.length === 0 && <section className="contact-sheet"><p className="empty-assets">Album này chưa có hình ảnh hoặc Bộ Sưu Tập công khai.</p></section>}
      <footer className="album-page__footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button><Link href="/">Mở Album Khác</Link></footer>
    {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={visiblePhotos.length} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
    </main>
  );
}
