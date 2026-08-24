/**
 * Design: Liturgical Design Archive.
 * A mobile-first contact sheet that lets visitors view and download assets from one liturgical collection.
 */
import { useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, Download, Grid2X2, ImageIcon, List } from "lucide-react";
import { AlbumCard } from "@/components/AlbumCard";
import { findAlbum, formatAlbumTitle, type Photo } from "@/lib/albumData";
import { Lightbox } from "@/components/Lightbox";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";

type GalleryView = "large" | "grid" | "list";

const galleryViews: Array<{ id: GalleryView; label: string; icon: typeof ImageIcon }> = [
  { id: "large", label: "Ảnh lớn", icon: ImageIcon },
  { id: "grid", label: "Lưới ảnh", icon: Grid2X2 },
  { id: "list", label: "Danh sách", icon: List },
];

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const [, setLocation] = useLocation();
  const { albums } = useArchiveManifest();
  const album = findAlbum(albums, params?.slug ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [galleryView, setGalleryView] = useState<GalleryView>("grid");

  if (!album) return <main className="not-found-page"><p className="eyebrow">Không tìm thấy</p><h1>Bộ thiết kế này chưa có trong thư viện.</h1><Link href="/" className="text-link">Quay về danh mục</Link></main>;

  const parentAlbum = album.parentSlug ? findAlbum(albums, album.parentSlug) : undefined;
  const childAlbums = album.children ?? [];
  const hasChildAlbums = childAlbums.length > 0;
  const selectedIndex = selectedPhoto ? album.photos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;
  const selectOffset = (offset: number) => setSelectedPhoto(album.photos[(selectedIndex + offset + album.photos.length) % album.photos.length]);

  return (
    <main className="album-page">
      <header className="album-page__header"><button className="back-link" type="button" onClick={() => setLocation(parentAlbum ? `/album/${parentAlbum.slug}` : "/")}><ArrowLeft size={18} strokeWidth={1.8} /> {parentAlbum ? "Quay Về Album Cha" : "Tất Cả Thiết Kế"}</button><span className="header-mark brand-symbol" aria-hidden="true" /></header>
      <section className="album-intro"><div className="album-intro__index" aria-hidden="true">{album.id}</div><div className="album-intro__copy"><p className="eyebrow">{album.subtitle}</p><h1>{formatAlbumTitle(album.title)}</h1><div className="album-intro__meta"><span><CalendarDays size={15} strokeWidth={1.7} /> {album.location}</span><span>{album.date}</span><span>{hasChildAlbums ? `${childAlbums.length} Album Con` : `${album.count} Thiết Kế`}</span></div></div>{album.photos[0] && <a className="album-intro__download" href={album.photos[0].downloadUrl} target="_blank" rel="noreferrer"><Download size={16} strokeWidth={1.8} /> Tải Thiết Kế Bìa</a>}</section>
      {hasChildAlbums && <section className="parent-album" aria-label={`Album Con trong ${album.title}`}><div className="parent-album__rule"><span>Album Con</span><span>{String(childAlbums.length).padStart(2, "0")} Bộ Sưu Tập</span></div><div className="archive-grid">{childAlbums.map((child, index) => <AlbumCard key={child.id} album={child} order={index} onOpen={(slug) => setLocation(`/album/${slug}`)} />)}</div></section>}
      {album.photos.length > 0 && <section className="contact-sheet" aria-label={`Thiết kế trong ${album.title}`}>
        <div className="contact-sheet__rule">
          <span>{hasChildAlbums ? "Thiết Kế Đặt Trực Tiếp Trong Album Cha" : "Chọn một thiết kế để xem"}</span>
          <div className="gallery-actions">
            <span>{String(album.photos.length).padStart(2, "0")} tệp đã lưu</span>
            <div className="gallery-view-switch" role="group" aria-label="Chế độ xem ảnh">
              {galleryViews.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" className={galleryView === id ? "is-active" : ""} onClick={() => setGalleryView(id)} aria-pressed={galleryView === id} title={label}>
                  <Icon size={15} strokeWidth={1.8} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {galleryView === "list" ? (
          <div className="photo-list" role="list">
            {album.photos.map((photo, index) => (
              <article className="photo-list__row" key={photo.id} role="listitem">
                <button type="button" className="photo-list__preview" onClick={() => setSelectedPhoto(photo)} aria-label={`Mở thiết kế ${photo.title}`}>
                  <img src={photo.src} alt={photo.title} loading="lazy" decoding="async" />
                </button>
                <div className="photo-list__metadata"><span className="photo-list__index">{String(index + 1).padStart(2, "0")}</span><strong>{photo.title}</strong><span>{photo.location} · {photo.date}</span></div>
                <div className="photo-list__type"><span>{photo.mimeType?.replace("image/", "").toUpperCase() ?? "HÌNH ẢNH"}</span><span>Tệp Thiết Kế</span></div>
                <a href={photo.downloadUrl} target="_blank" rel="noreferrer" className="photo-list__download" aria-label={`Tải ${photo.title}`}><Download size={16} strokeWidth={1.8} /><span>Tải</span></a>
              </article>
            ))}
          </div>
        ) : (
          <div className={`photo-grid photo-grid--${galleryView}`}>
            {album.photos.map((photo, index) => (
              <button key={photo.id} className={`photo-tile photo-tile--${photo.orientation}`} type="button" onClick={() => setSelectedPhoto(photo)} aria-label={`Mở thiết kế ${photo.title}`}>
                <span className="photo-tile__media"><img src={photo.src} alt={photo.title} loading="lazy" decoding="async" /><span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" /><span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" /></span>
                <span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{photo.title}</strong><em>{photo.location} · {photo.date}</em></span>
              </button>
            ))}
          </div>
        )}
      </section>}
      {!hasChildAlbums && album.photos.length === 0 && <section className="contact-sheet"><p className="empty-assets">Folder này chưa có Album Con hoặc ảnh thiết kế công khai.</p></section>}
      <footer className="album-page__footer"><span>Long Nguyen © 2026</span><Link href="/">Mở Album Khác</Link></footer>
      {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={album.photos.length} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
    </main>
  );
}
