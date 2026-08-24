/**
 * Design: Contemporary Editorial Archive.
 * Warm editorial landing page with asymmetric album rail, archive markers and carefully restrained cobalt interaction cues.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowDownRight, FolderOpen, Search, Sparkles } from "lucide-react";
import { AlbumCard } from "@/components/AlbumCard";
import { albums } from "@/lib/albumData";

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const filteredAlbums = useMemo(
    () => albums.filter((album) => `${album.title} ${album.location}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())),
    [query],
  );

  return (
    <main className="archive-home">
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setLocation("/")} aria-label="Về trang chủ Khoảnh Khắc">
          <img src="/manus-storage/khoanh-khac-logo_29843d1a.png" alt="" />
          <span>Khoảnh Khắc</span>
        </button>
        <div className="site-header__right">
          <span className="sync-badge"><i /> Drive sẵn sàng</span>
          <a href="#albums" className="header-jump">Duyệt kho <ArrowDownRight size={16} strokeWidth={1.8} /></a>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-section__image" aria-hidden="true" />
        <div className="hero-section__copy">
          <p className="eyebrow">Kho ảnh cá nhân / 2024—2026</p>
          <h1>Những ngày được giữ lại bằng ánh sáng.</h1>
          <p className="hero-section__lede">Một kho lưu trữ nhỏ của những chuyến đi, các bữa cơm và những điều bình thường đáng nhớ.</p>
          <a className="hero-section__action" href="#albums">
            Mở danh mục <ArrowDownRight size={19} strokeWidth={1.75} />
          </a>
        </div>
        <div className="hero-section__archive-rule" aria-hidden="true">
          <span>Public archive</span>
          <i />
          <span>Records / 03</span>
        </div>
        <div className="hero-section__marker">
          <span>Archive no.</span>
          <strong>001—03</strong>
          <span>Public view</span>
        </div>
      </section>

      <section className="archive-toolbar" id="albums">
        <div>
          <p className="eyebrow">Mục lục</p>
          <h2>Album đã mở</h2>
        </div>
        <label className="archive-search">
          <Search size={17} strokeWidth={1.75} />
          <span className="sr-only">Tìm album</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong danh mục" />
        </label>
      </section>

      <section className="archive-grid" aria-label="Danh sách album ảnh">
        {filteredAlbums.map((album, index) => (
          <AlbumCard key={album.id} album={album} order={index} onOpen={(slug) => setLocation(`/album/${slug}`)} />
        ))}
        {filteredAlbums.length === 0 && (
          <div className="empty-archive">
            <FolderOpen size={30} strokeWidth={1.5} />
            <p>Chưa có album nào trùng với từ khóa này.</p>
          </div>
        )}
      </section>

      <section className="archive-note">
        <Sparkles size={18} strokeWidth={1.6} />
        <p><strong>Ghi chú lưu trữ.</strong> Đây là dữ liệu minh họa. Khi Drive được kết nối, mỗi folder sẽ trở thành một album riêng với ảnh thật của bạn.</p>
        <span>v0.1 / demo gallery</span>
      </section>

      <footer className="site-footer">
        <span>Khoảnh Khắc © 2026</span>
        <span>Được lưu bằng Google Drive</span>
      </footer>
    </main>
  );
}
