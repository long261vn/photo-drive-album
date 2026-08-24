/**
 * Design: Contemporary Editorial Archive.
 * A mobile-first photo contact sheet with large editorial breathing room and clear archive metadata.
 */
import { useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, Download, MapPin } from "lucide-react";
import { findAlbum, type Photo } from "@/lib/albumData";
import { Lightbox } from "@/components/Lightbox";

export default function AlbumPage() {
  const [, params] = useRoute("/album/:slug");
  const [, setLocation] = useLocation();
  const album = findAlbum(params?.slug ?? "");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (!album) {
    return (
      <main className="not-found-page">
        <p className="eyebrow">04 / không tìm thấy</p>
        <h1>Album này chưa có trong kho lưu trữ.</h1>
        <Link href="/" className="text-link">Quay về trang album</Link>
      </main>
    );
  }

  const selectedIndex = selectedPhoto ? album.photos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;
  const selectOffset = (offset: number) => {
    const nextIndex = (selectedIndex + offset + album.photos.length) % album.photos.length;
    setSelectedPhoto(album.photos[nextIndex]);
  };

  return (
    <main className="album-page">
      <header className="album-page__header">
        <button className="back-link" type="button" onClick={() => setLocation("/")}> 
          <ArrowLeft size={18} strokeWidth={1.8} /> Tất cả album
        </button>
        <img className="header-mark" src="/manus-storage/khoanh-khac-logo_29843d1a.png" alt="" />
        <span className="header-note">Drive archive</span>
      </header>

      <section className="album-intro">
        <div className="album-intro__index" aria-hidden="true">{album.id}</div>
        <div className="album-intro__copy">
          <p className="eyebrow">{album.subtitle}</p>
          <h1>{album.title}</h1>
          <p className="album-intro__description">{album.description}</p>
          <div className="album-intro__meta">
            <span><MapPin size={15} strokeWidth={1.7} /> {album.location}</span>
            <span>{album.date}</span>
            <span>{album.count} khung hình</span>
          </div>
        </div>
        <a className="album-intro__download" href={album.photos[0]?.downloadUrl} target="_blank" rel="noreferrer">
          <Download size={16} strokeWidth={1.8} /> Tải ảnh bìa
        </a>
      </section>

      <section className="contact-sheet" aria-label={`Ảnh trong album ${album.title}`}>
        <div className="contact-sheet__rule">
          <span>Chọn một khung hình để xem</span>
          <span>{String(album.photos.length).padStart(2, "0")} ảnh mẫu</span>
        </div>
        <div className="photo-grid">
          {album.photos.map((photo, index) => (
            <button
              key={photo.id}
              className={`photo-tile photo-tile--${photo.orientation}`}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`Mở ảnh ${photo.title}`}
            >
              <img src={photo.src} alt={photo.title} loading="lazy" decoding="async" />
              <span className="photo-tile__corner photo-tile__corner--one" aria-hidden="true" />
              <span className="photo-tile__corner photo-tile__corner--two" aria-hidden="true" />
              <span className="photo-tile__caption">
                <span className="photo-tile__index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{photo.title}</strong>
                <em>{photo.location} · {photo.date}</em>
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer className="album-page__footer">
        <span>Khoảnh Khắc © 2026</span>
        <Link href="/">Mở album khác</Link>
      </footer>

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          index={selectedIndex}
          count={album.photos.length}
          onClose={() => setSelectedPhoto(null)}
          onPrevious={() => selectOffset(-1)}
          onNext={() => selectOffset(1)}
        />
      )}
    </main>
  );
}
