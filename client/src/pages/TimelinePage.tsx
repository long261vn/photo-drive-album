/**
 * Design: Liturgical Design Archive — a chronological, image-first reading path.
 * The timeline keeps the warm editorial paper system while presenting Long Nguyen's images chronologically.
 */
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CalendarDays, Eye, EyeOff, FolderOpen, Images, Plus, Search } from "lucide-react";
import { LibraryModeSwitch } from "@/components/LibraryModeSwitch";
import { Lightbox } from "@/components/Lightbox";
import { LiturgicalFilters } from "@/components/LiturgicalFilters";
import { flattenAlbums, formatAlbumTitle, formatPhotoTitle, titleSearchText, type Album, type Photo } from "@/lib/albumData";
import { emptyLiturgicalFilters, getLiturgicalMetadata, liturgicalDetailLabels, liturgicalMetadataSearchText, matchesLiturgicalFilters, type LiturgicalFilters as LiturgicalFiltersState } from "@/lib/liturgicalMetadata";
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
const LOAD_SIZE = 80;
const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");

function fallbackDate(date = "") {
  const [month, year] = date.split(".");
  return month && year ? new Date(`${year}-${month.padStart(2, "0")}-01T00:00:00`) : new Date(0);
}

function dateForTimeline(photo: Photo, album: Album) {
  const candidate = photo.createdAt || album.createdAt || fallbackDate(photo.date).toISOString();
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function groupTimeline(albums: Album[], showBackgrounds: boolean, query: string, filters: LiturgicalFiltersState) {
  const groupMap = new Map<string, TimelinePhoto[]>();
  flattenAlbums(albums).forEach((album) => {
    album.photos.filter((photo) => (showBackgrounds || !photo.isBackground) && matchesLiturgicalFilters(getLiturgicalMetadata(photo.title, photo.location), filters) && (!query || normalizeSearch([titleSearchText(photo.title), titleSearchText(photo.location), titleSearchText(album.title), album.subtitle, liturgicalMetadataSearchText(photo.title, photo.location)].join(" ")).includes(query))).forEach((photo) => {
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
  const [visibleItemCount, setVisibleItemCount] = useState(LOAD_SIZE);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [query, setQuery] = useState("");
  const [liturgicalFilters, setLiturgicalFilters] = useState<LiturgicalFiltersState>(emptyLiturgicalFilters);
  const normalizedQuery = useMemo(() => normalizeSearch(query.trim()), [query]);
  const allPhotos = useMemo(() => flattenAlbums(albums).flatMap((album) => album.photos), [albums]);
  const seasons = useMemo(() => Array.from(new Set(allPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).season).filter((season): season is string => Boolean(season)))), [allPhotos]);
  const years = useMemo(() => Array.from(new Set(allPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location).liturgicalYear).filter((year): year is "A" | "B" | "C" => Boolean(year)))).sort(), [allPhotos]);
  const weeks = useMemo(() => Array.from(new Set(allPhotos.map((photo) => getLiturgicalMetadata(photo.title, photo.location)).filter((metadata) => !liturgicalFilters.season || metadata.season === liturgicalFilters.season).map((metadata) => metadata.week).filter((week): week is number => Number.isFinite(week)))).sort((first, second) => first - second), [allPhotos, liturgicalFilters.season]);
  const groups = useMemo(() => groupTimeline(albums, showBackgrounds, normalizedQuery, liturgicalFilters), [albums, showBackgrounds, normalizedQuery, liturgicalFilters]);
  const timelinePhotos = useMemo(() => groups.flatMap((group) => group.photos), [groups]);
  const visibleGroups = useMemo(() => {
    let remaining = visibleItemCount;
    return groups.flatMap((group) => {
      const photos = group.photos.slice(0, Math.max(0, remaining));
      remaining -= photos.length;
      return photos.length ? [{ ...group, photos }] : [];
    });
  }, [groups, visibleItemCount]);
  const hasMoreItems = timelinePhotos.length > visibleItemCount;
  const selectedIndex = selectedPhoto ? timelinePhotos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;
  const selectOffset = (offset: number) => setSelectedPhoto(timelinePhotos[(selectedIndex + offset + timelinePhotos.length) % timelinePhotos.length]);
  const avatar = profile.avatar?.trim();

  return <main className="timeline-page">
    <header className="timeline-page__header"><button className="back-link" type="button" onClick={() => setLocation("/")}><ArrowLeft size={18} strokeWidth={1.8} /> Xem theo Album</button>{avatar && <span className="album-page__avatar"><img src={avatar} alt={`Avatar ${profile.name}`} /></span>}</header>
    <LibraryModeSwitch active="all" />
    <section className="timeline-hero">
      <p className="eyebrow">Chế độ 02 · Toàn thư viện</p>
      <div className="timeline-hero__copy"><h1>Xem Tất Cả</h1></div>
      <div className="timeline-hero__utility"><label className="timeline-search"><Search size={17} strokeWidth={1.75} /><span className="sr-only">Tìm trong toàn bộ thiết kế</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleItemCount(LOAD_SIZE); }} placeholder="Tìm Mùa, Tuần, Lễ hoặc thiết kế" /></label><button className={`background-toggle ${showBackgrounds ? "is-active" : ""}`} type="button" onClick={() => setShowBackgrounds((visible) => !visible)} aria-pressed={showBackgrounds}>{showBackgrounds ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}<span>{showBackgrounds ? "Ẩn BG" : "Hiện BG"}</span></button></div>
      <LiturgicalFilters filters={liturgicalFilters} seasons={seasons} years={years} weeks={weeks} onChange={(next) => { setLiturgicalFilters(next); setVisibleItemCount(LOAD_SIZE); }} />
      <div className="timeline-hero__stats"><span><Images size={17} strokeWidth={1.7} /> {timelinePhotos.length} Thiết Kế</span><span><CalendarDays size={17} strokeWidth={1.7} /> {groups.length} Tháng Lưu Trữ</span>{normalizedQuery && <span>Kết quả cho “{query.trim()}”</span>}</div>
    </section>

    {visibleGroups.length > 0 ? <div className="timeline-rail">
      {visibleGroups.map((group) => <section className="timeline-group" key={group.key} aria-label={`Thiết kế ${group.label}`}>
        <div className="timeline-group__heading"><span className="timeline-group__marker" aria-hidden="true" /><div><p className="eyebrow">{group.key}</p><h2>{group.label}</h2></div><span>{String(group.photos.length).padStart(2, "0")} Thiết Kế</span></div>
        <div className="timeline-grid">
          {group.photos.map((photo, photoIndex) => <article className={`timeline-tile ${photoIndex === 0 ? "timeline-tile--anchor" : ""}`} key={photo.id}>
            <button type="button" className="timeline-tile__media" onClick={() => setSelectedPhoto(photo)} aria-label={`Mở thiết kế ${formatPhotoTitle(photo.title)}`}>
              {photo.src?.trim() ? <img src={photo.src} alt={formatPhotoTitle(photo.title)} loading="lazy" decoding="async" /> : <span className="photo-tile__placeholder" aria-hidden="true" />}
              <span className="timeline-tile__index" aria-hidden="true">{String(photoIndex + 1).padStart(2, "0")}</span>
              <span className="timeline-tile__date"><CalendarDays size={12} strokeWidth={1.8} /> {dateFormatter.format(photo.timelineDate)}</span>
            </button>
            <div className="timeline-tile__copy"><strong title={formatPhotoTitle(photo.title)}>{formatPhotoTitle(photo.title)}</strong><span className="timeline-tile__metadata">{liturgicalDetailLabels(getLiturgicalMetadata(photo.title, photo.location)).slice(0, 2).join(" · ")}</span><button type="button" onClick={() => setLocation(`/album/${photo.albumSlug}`)}><FolderOpen size={13} strokeWidth={1.8} /> {formatAlbumTitle(photo.albumTitle)}</button></div>
          </article>)}
        </div>
      </section>)}
    </div> : <section className="timeline-empty"><p className="eyebrow">Chưa có hình phù hợp</p><h1>Chưa có hình để hiển thị.</h1></section>}

    {hasMoreItems && <div className="timeline-load-more"><button type="button" onClick={() => setVisibleItemCount((count) => count + LOAD_SIZE)}><Plus size={16} strokeWidth={1.8} /> Tải Thêm {LOAD_SIZE} Thiết Kế</button><span>Đã hiển thị {Math.min(visibleItemCount, timelinePhotos.length)} / {timelinePhotos.length} thiết kế</span></div>}
    <footer className="album-page__footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button></footer>
    {selectedPhoto && <Lightbox photo={selectedPhoto} index={selectedIndex} count={timelinePhotos.length} onClose={() => setSelectedPhoto(null)} onPrevious={() => selectOffset(-1)} onNext={() => selectOffset(1)} />}
  </main>;
}
