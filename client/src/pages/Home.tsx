/**
 * Design: Liturgical Design Archive.
 * A contemporary sacred editorial homepage, organized by liturgical seasons rather than a generic image feed.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowDownRight, FolderOpen, Search, Sparkles } from "lucide-react";
import { AlbumCard } from "@/components/AlbumCard";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const { albums, isLive } = useArchiveManifest();
  const filteredAlbums = useMemo(() => albums.filter((album) => `${album.title} ${album.subtitle}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [albums, query]);

  return (
    <main className="archive-home">
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setLocation("/")} aria-label="Về trang chủ Thư viện Phụng vụ"><img src="/manus-storage/liturgical-logo_d82d1f4f.png" alt="" /><span>Thư viện Phụng vụ</span></button>
        <div className="site-header__right"><span className={`sync-badge${isLive ? " is-live" : ""}`}><i /> {isLive ? "Drive đã đồng bộ" : "Chờ Drive đồng bộ"}</span><a href="#albums" className="header-jump">Duyệt thư viện <ArrowDownRight size={16} strokeWidth={1.8} /></a></div>
      </header>

      <section className="hero-section">
        <div className="hero-section__image" aria-hidden="true" />
        <div className="hero-section__copy"><p className="eyebrow">Kho thiết kế Công giáo / Chu kỳ Năm A</p><h1>Thiết kế cho từng mùa của Năm Phụng Vụ.</h1><p className="hero-section__lede">Nơi lưu giữ các thiết kế truyền thông được sắp theo Chúa Nhật, mùa phụng vụ và nhịp sống của cộng đoàn.</p><a className="hero-section__action" href="#albums">Mở danh mục <ArrowDownRight size={19} strokeWidth={1.75} /></a></div>
        <div className="hero-section__archive-rule" aria-hidden="true"><span>Lịch phụng vụ</span><i /><span>Năm A / 2026</span></div>
        <div className="hero-section__marker"><span>Danh mục</span><strong>{String(albums.length).padStart(2, "0")}</strong><span>Bộ thiết kế</span></div>
      </section>

      <section className="archive-toolbar" id="albums"><div><p className="eyebrow">Lịch lưu trữ</p><h2>Bộ thiết kế đã mở</h2></div><label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm bộ thiết kế</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo Chúa Nhật hoặc mùa" /></label></section>

      <section className="archive-grid" aria-label="Danh sách bộ thiết kế phụng vụ">
        {filteredAlbums.map((album, index) => <AlbumCard key={album.id} album={album} order={index} onOpen={(slug) => setLocation(`/album/${slug}`)} />)}
        {filteredAlbums.length === 0 && <div className="empty-archive"><FolderOpen size={30} strokeWidth={1.5} /><p>Chưa tìm thấy bộ thiết kế phù hợp.</p></div>}
      </section>

      <section className="archive-note"><Sparkles size={18} strokeWidth={1.6} /><p><strong>Ghi chú thư viện.</strong> Mỗi folder trong Google Drive là một bộ thiết kế. Khi đồng bộ hoàn tất, ảnh thêm hoặc xóa trong folder sẽ được phản ánh trong thư viện này.</p><span>{isLive ? "Google Drive / manifest" : "Đang dùng dữ liệu mẫu"}</span></section>
      <footer className="site-footer"><span>Thư viện Phụng vụ © 2026</span><span>Lưu trữ bằng Google Drive</span></footer>
    </main>
  );
}
