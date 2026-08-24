/**
 * Design: Liturgical Design Archive.
 * A contemporary sacred editorial homepage, organized by liturgical seasons rather than a generic image feed.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowDownRight, CalendarDays, FileImage, FolderOpen, Images, Search, Sparkles } from "lucide-react";
import { AlbumCard } from "@/components/AlbumCard";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const { albums, profile, isLive } = useArchiveManifest();
  const filteredAlbums = useMemo(() => albums.filter((album) => `${album.title} ${album.subtitle}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [albums, query]);
  const assetCount = useMemo(() => albums.reduce((total, album) => total + album.photos.length, 0), [albums]);

  return (
    <main className="archive-home">
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setLocation("/")} aria-label="Về trang chủ Thư viện Phụng vụ"><span className="brand-symbol" aria-hidden="true" /><span>Thư viện Phụng vụ</span></button>
        <div className="site-header__right"><span className={`sync-badge${isLive ? " is-live" : ""}`}><i /> {isLive ? "Drive đã đồng bộ" : "Chờ Drive đồng bộ"}</span><a href="#albums" className="header-jump">Duyệt thư viện <ArrowDownRight size={16} strokeWidth={1.8} /></a></div>
      </header>

      <section className="profile-shell" aria-label="Thông tin thư viện">
        <div className="profile-cover"><img src={profile.cover} alt="Ảnh bìa thư viện" fetchPriority="high" /></div>
        <div className="profile-summary">
          <div className="profile-avatar"><img src={profile.avatar} alt={`Avatar ${profile.name}`} /></div>
          <div className="profile-copy"><p className="eyebrow">Kho thiết kế Công giáo</p><h1>{profile.name}</h1>{profile.handle && <p className="profile-handle">{profile.handle}</p>}<p className="profile-bio">{profile.bio}</p>{profile.details.length > 0 && <div className="profile-details">{profile.details.map((detail) => <span key={detail}>{detail}</span>)}</div>}</div>
          <div className="profile-stats" aria-label="Thống kê thư viện"><span><strong>{albums.length}</strong> Album</span><span><strong>{assetCount}</strong> Thiết kế</span><span><CalendarDays size={14} strokeWidth={1.7} /> Drive</span></div>
        </div>
      </section>

      <section className="archive-toolbar archive-toolbar--profile" id="albums"><div><p className="eyebrow">Danh mục thư viện</p><h2>Tất cả bộ thiết kế</h2><p className="archive-toolbar__lede">Chọn một album để xem, tải hoặc trình chiếu toàn bộ thiết kế theo từng Chúa Nhật.</p></div><label className="archive-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm bộ thiết kế</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo Chúa Nhật hoặc mùa" /></label></section>

      <section className="archive-grid profile-album-grid" aria-label="Danh sách bộ thiết kế phụng vụ">
        {filteredAlbums.map((album, index) => <AlbumCard key={album.id} album={album} order={index} onOpen={(slug) => setLocation(`/album/${slug}`)} />)}
        {filteredAlbums.length === 0 && <div className="empty-archive"><FolderOpen size={30} strokeWidth={1.5} /><p>Chưa tìm thấy bộ thiết kế phù hợp.</p></div>}
      </section>

      <section className="archive-note"><Sparkles size={18} strokeWidth={1.6} /><p><strong>Ghi chú thư viện.</strong> Mỗi folder trong Google Drive là một bộ thiết kế. Avatar, cover và mô tả được lấy từ folder hồ sơ riêng; ảnh thêm hoặc xóa sẽ được phản ánh sau lần đồng bộ kế tiếp.</p><span>{isLive ? "Google Drive / manifest" : "Đang dùng dữ liệu mẫu"}</span></section>
      <footer className="site-footer"><span>Thư viện Phụng vụ © 2026</span><span>Lưu trữ bằng Google Drive</span></footer>
    </main>
  );
}
