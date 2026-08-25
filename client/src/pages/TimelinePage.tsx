/**
 * Design: Liturgical Design Archive — a chronological, image-first reading path.
 * The timeline keeps the warm editorial paper system while making each Drive creation date and source Album easy to trace.
 */
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CalendarDays, FolderOpen, Images, Plus } from "lucide-react";
import { Lightbox } from "@/components/Lightbox";
import { flattenAlbums, formatAlbumTitle, type Album, type Photo } from "@/lib/albumData";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";

type TimelinePhoto = Photo & {
  albumSlug: string;
  albumTitle: string;
  timelineDate: Date;
};

type TimelineGroup = {
  key: string;
  label: string;
  photos: TimelinePhoto[];
};

const groupFormatter = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

function fallbackDate(date = "") {
  const [month, year] = date.split(".");
  return month && year ? new Date(`${year}-${month.padStart(2, "0")}-01T00:00:00`) : new Date(0);
}

function dateForTimeline(photo: Photo, album: Album) {
  const candidate = photo.createdAt || album.createdAt || fallbackDate(photo.date).toISOString();
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function groupTimeline(albums: Album[]) {
  const groupMap = new Map<string, TimelinePhoto[]>();
  flattenAlbums(albums).forEach((album) => {
    album.photos.forEach((photo) => {
      const timelineDate = dateForTimeline(photo, album);
      const key = `${timelineDate.getFullYear()}-${String(timelineDate.getMonth() + 1).padStart(2, "0")}`;
      const asset: TimelinePhoto = { ...photo, albumSlug: album.slug, albumTitle: album.title, timelineDate };
      groupMap.set(key, [...(groupMap.get(key) ?? []), asset]);
    });
  });

  return Array.from(groupMap.entries())
    .sort(([first], [second]) => second.localeCompare(first))
    .map(([key, photos]) => ({
      key,
      label: groupFormatter.format(photos[0].timelineDate),
      photos: [...photos].sort((first, second) => second.timelineDate.getTime() - first.timelineDate.getTime()),
    }));
}

export default function TimelinePage() {
  const [, setLocation] = useLocation();
  const { albums, profile } = useArchiveManifest();
  const { registerTap } = useSyncWorkflowShortcut();
  const [selectedPhoto, setSelectedPhoto] = useState<TimelinePhoto | null>(null);
  const [visibleGroupCount, setVisibleGroupCount] = useState(4);
  const groups = useMemo(() => groupTimeline(albums), [albums]);
  const visibleGroups = groups.slice(0, visibleGroupCount);
  const timelinePhotos = useMemo(() => groups.flatMap((group) => group.photos), [groups]);
  const selectedIndex = selectedPhoto ? timelinePhotos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;
  const selectOffset = (offset: number) => setSelectedPhoto(timelinePhotos[(selectedIndex + offset + timelinePhotos.length) % timelinePhotos.length]);
  const avatar = profile.avatar?.trim();

  return <main className="timeline-page">
    <header className="timeline-page__header"><button className="back-link" type="button" onClick={() => setLocation("/")}><ArrowLeft size={18} strokeWidth={1.8} /> Tất Cả Album</button>{avatar && <span className="album-page__avatar"><img src={avatar} alt={`Avatar ${profile.name}`} /></span>}</header>
    <section className="timeline-hero">
      <p className="eyebrow">Dòng Thời Gian</p>
      <div className="timeline-hero__copy"><h1>Tất Cả Thiết Kế</h1><p>Các thiết kế được sắp theo <strong>ngày tạo trên Google Drive</strong>, mới nhất ở trên cùng.</p></div>
      <div className="timeline-hero__stats"><span><Images size={17} strokeWidth={1.7} /> {timelinePhotos.length} Thiết Kế</span><span><CalendarDays size={17} strokeWidth={1.7} /> {groups.length} Tháng Lưu Trữ</span></div>
    </section>

    {visibleGroups.length > 0 ? <div className="timeline-rail">
      {visibleGroups.map((group) => <section className="timeline-group" key={group.key} aria-label={`Thiết kế ${group.label}`}>
        <div className="timeline-group__heading"><span className="timeline-group__marker" aria-hidden="true" /><div><p className="eyebrow">{group.key}</p><h2>{group.label}</h2></div><span>{String(group.photos.length).padStart(2, "0")} Thiết Kế</span></div>
        <div className="timeline-grid">
          {group.photos.map((photo) => <article className="timeline-tile" key={photo.id}>
            <button type="button" className="timeline-tile__media" onClick={() => setSelectedPhoto(photo)} aria-label={`Mở thiết kế ${photo.title}`}>
              {photo.src?.trim() ? <img src={photo.src} alt={photo.title} loading="lazy" decoding="async" /> : <span className="photo-tile__placeholder" aria-hidden="true" />}
              <span className="timeline-tile__date"><CalendarDays size={12} strokeWidth={1.8} /> {dateFormatter.format(photo.timelineDate)}</span>
            </button>
            <div className="timeline-tile__copy"><strong title={photo.title}>{photo.title}</strong><button type="button" onClick={() => setLocation(`/album/${photo.albumSlug}`)}><FolderOpen size={13} strokeWidth={1.8} /> {formatAlbumTitle(photo.albumTitle)}</button></div>
          </article>)}
        </div>
      </section>)}
    </div> : <section className="timeline-empty"><p className="eyebrow">Chưa có thiết kế</p><h1>Dòng thời gian sẽ xuất hiện sau lần đồng bộ Drive đầu tiên.</h1><Link href="/" className="text-link">Quay về Album</Link></section>}

    {visibleGroupCount < groups.length && <div className="timeline-load-more"><button type="button" onClick={() => setVisibleGroupCount((count) => count + 4)}><Plus size={16} strokeWidth={1.8} /> Tải Thêm Tháng</button><span>Đã hiển thị {visibleGroups.length} / {groups.length} tháng</span></div>}
    <footer className="album-page__footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button><Link href="/">Mở Album Khác</Link></footer>
    {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={timelinePhotos.length} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
  </main>;
}
