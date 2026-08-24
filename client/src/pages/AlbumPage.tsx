/**
 * Design: Liturgical Design Archive.
 * A mobile-first contact sheet that lets visitors view and download assets from one liturgical collection.
 */
import { useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, Download } from "lucide-react";
import { findAlbum, type Photo } from "@/lib/albumData";
import { Lightbox } from "@/components/Lightbox";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const [, setLocation] = useLocation();
  const { albums, isLive } = useArchiveManifest();
  const album = findAlbum(albums, params?.slug ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (!album) return <main className="not-found-page"><p className="eyebrow">Không tìm thấy</p><h1>Bộ thiết kế này chưa có trong thư viện.</h1><Link href="/" className="text-link">Quay về danh mục</Link></main>;

  const selectedIndex = selectedPhoto ? album.photos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;
  const selectOffset = (offset: number) => setSelectedPhoto(album.photos[(selectedIndex + offset + album.photos.length) % album.photos.length]);

  return (
    <main className="album-page">
      <header className="album-page__header"><button className="back-link" type="button" onClick={() => setLocation("/")}><ArrowLeft size={18} strokeWidth={1.8} /> Tất cả thiết kế</button><span className="header-mark brand-symbol" aria-hidden="true" /><span className="header-note">{isLive ? "Google Drive" : "Lịch phụng vụ"}</span></header>
      <section className="album-intro"><div className="album-intro__index" aria-hidden="true">{album.id}</div><div className="album-intro__copy"><p className="eyebrow">{album.subtitle}</p><h1>{album.title}</h1><p className="album-intro__description">{album.description}</p><div className="album-intro__meta"><span><CalendarDays size={15} strokeWidth={1.7} /> {album.location}</span><span>{album.date}</span><span>{album.count} thiết kế</span></div></div>{album.photos[0] && <a className="album-intro__download" href={album.photos[0].downloadUrl} target="_blank" rel="noreferrer"><Download size={16} strokeWidth={1.8} /> Tải thiết kế bìa</a>}</section>
      <section className="contact-sheet" aria-label={`Thiết kế trong ${album.title}`}><div className="contact-sheet__rule"><span>Chọn một thiết kế để xem</span><span>{String(album.photos.length).padStart(2, "0")} tệp đã lưu</span></div><div className="photo-grid">{album.photos.map((photo, index) => <button key={photo.id} className={`photo-tile photo-tile--${photo.orientation}`} type="button" onClick={() => setSelectedPhoto(photo)} aria-label={`Mở thiết kế ${photo.title}`}><img src={photo.src} alt={photo.title} loading="lazy" decoding="async" /><span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" /><span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" /><span className="photo-tile__caption"><span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span><strong>{photo.title}</strong><em>{photo.location} · {photo.date}</em></span></button>)}</div>{album.photos.length === 0 && <p className="empty-assets">Folder này chưa có ảnh thiết kế công khai.</p>}</section>
      <footer className="album-page__footer"><span>Thư viện Phụng vụ © 2026</span><Link href="/">Mở bộ khác</Link></footer>
      {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={album.photos.length} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
    </main>
  );
}
