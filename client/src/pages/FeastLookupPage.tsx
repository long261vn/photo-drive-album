/**
 * Design: Liturgical Design Archive.
 * This page turns the editable annual feast catalog into a right-hand index and a calm, image-first reading area.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, CalendarDays, ChevronRight, FolderOpen, Search } from "lucide-react";
import liturgicalRules from "@/data/liturgical-rules.json";
import { useArchiveManifest } from "@/hooks/useArchiveManifest";
import { flattenAlbums, formatAlbumTitle, formatPhotoTitle, titleSearchText, type Album, type Photo } from "@/lib/albumData";
import { getLiturgicalMetadata, liturgicalDetailLabels } from "@/lib/liturgicalMetadata";
import { useSyncWorkflowShortcut } from "@/hooks/useSyncWorkflowShortcut";

type FeastEntry = { id: string; title: string; group: "Lễ Chính" | "Mùa Phụng Vụ" | "Lễ Theo Ngày"; date?: string };
type MatchedAsset = { album: Album; photo: Photo };

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/gi, "").toLocaleLowerCase("vi");
const dateLabel = (date: string) => `${date.slice(3)}/${date.slice(0, 2)}`;
const dateFromMetadata = (date: string | null) => date ? `${date.slice(3, 5)}-${date.slice(0, 2)}` : "";
const seasonForCatalogTitle: Record<string, string> = { "Mùa Vọng": "Mùa Vọng", "Mùa Giáng Sinh": "Mùa Giáng Sinh", "Mùa Chay": "Mùa Chay", "Mùa Phục Sinh": "Phục Sinh", "Mùa Thường Niên": "Thường Niên" };

function buildCatalog(): FeastEntry[] {
  const majorEntries = liturgicalRules.calendar.leChinh.map((title, index) => ({ id: `major-${index + 1}`, title, group: "Lễ Chính" as const }));
  const seasonalEntries = liturgicalRules.calendar.muaPhungVu.map((title, index) => ({ id: `season-${index + 1}`, title, group: "Mùa Phụng Vụ" as const }));
  const fixedEntries = liturgicalRules.fixedFeasts.flatMap((feast) => feast.celebrations.map((title, index) => ({ id: `date-${feast.date}-${index + 1}`, title, date: feast.date, group: "Lễ Theo Ngày" as const })));
  return [...majorEntries, ...seasonalEntries, ...fixedEntries];
}

function matchesFeast(asset: MatchedAsset, entry: FeastEntry) {
  const metadata = getLiturgicalMetadata(asset.photo.title, asset.photo.location);
  if (entry.date) return dateFromMetadata(metadata.feastDate) === entry.date;
  if (entry.group === "Mùa Phụng Vụ") return metadata.season === seasonForCatalogTitle[entry.title];
  const entryTitle = normalize(entry.title.replace(/\s*-\s*Năm\s*A\/B\/C/gi, ""));
  const candidate = normalize([formatPhotoTitle(asset.photo.title), formatAlbumTitle(asset.album.title), asset.photo.location, ...metadata.celebrations].join(" "));
  if (candidate.includes(entryTitle)) return true;
  const aliasEntry = liturgicalRules.displayAliases.find((alias) => normalize(alias.label) === entryTitle);
  return aliasEntry?.aliases.some((alias) => candidate.includes(normalize(alias))) ?? false;
}

export default function FeastLookupPage() {
  const [, params] = useRoute("/tra-cuu-le/:entryId");
  const [, setLocation] = useLocation();
  const { albums } = useArchiveManifest();
  const { registerTap } = useSyncWorkflowShortcut();
  const [query, setQuery] = useState("");
  const activeEntryRef = useRef<HTMLButtonElement | null>(null);
  const catalog = useMemo(buildCatalog, []);
  const selectedEntry = catalog.find((entry) => entry.id === params?.entryId) ?? catalog[0];
  const normalizedQuery = normalize(query);
  const filteredCatalog = useMemo(() => catalog.filter((entry) => !normalizedQuery || normalize([entry.title, entry.group, entry.date ?? ""].join(" ")).includes(normalizedQuery)), [catalog, normalizedQuery]);
  const groupedCatalog = useMemo(() => (["Lễ Chính", "Mùa Phụng Vụ", "Lễ Theo Ngày"] as const).map((group) => ({ group, entries: filteredCatalog.filter((entry) => entry.group === group) })).filter(({ entries }) => entries.length), [filteredCatalog]);
  const assets = useMemo(() => flattenAlbums(albums).flatMap((album) => album.photos.filter((photo) => !photo.isBackground).map((photo) => ({ album, photo }))).filter((asset) => matchesFeast(asset, selectedEntry)), [albums, selectedEntry]);
  useEffect(() => { activeEntryRef.current?.scrollIntoView({ block: "center", behavior: "auto" }); }, [selectedEntry.id]);

  return <main className="feast-lookup-page">
    <header className="feast-lookup__header"><Link href="/" className="back-link"><ArrowLeft size={18} strokeWidth={1.8} /> Về Thư Viện</Link><span className="header-mark brand-symbol" aria-hidden="true" /></header>
    <section className="feast-lookup__intro"><p className="eyebrow">Tra cứu · Năm phụng vụ</p><h1>Danh Sách Lễ</h1><p>Chọn một Lễ trong mục lục để xem các thiết kế đang có từ Google Drive. Danh mục dùng cùng file quy ước với bộ tìm kiếm của thư viện.</p></section>
    <section className="feast-lookup__layout" aria-label="Tra cứu danh sách Lễ">
      <article className={`feast-reader ${selectedEntry.group === "Lễ Theo Ngày" ? "is-fixed-feast" : ""}`}>
        <div className="feast-reader__rule"><span>{selectedEntry.group}</span>{selectedEntry.date && <span><CalendarDays size={14} strokeWidth={1.8} /> {dateLabel(selectedEntry.date)}</span>}</div>
        <h2>{selectedEntry.title}</h2>
        <p className="feast-reader__lede">{assets.length ? `${assets.length} thiết kế đã được tìm thấy trong thư viện cho mục này.` : "Chưa có thiết kế được nhận diện cho mục này trong Drive."}</p>
        {assets.length > 0 && <div className="feast-assets">{assets.map(({ album, photo }, index) => <article className="feast-asset" key={photo.id}>
          <button type="button" className="feast-asset__image" onClick={() => setLocation(`/album/${album.slug}`)} aria-label={`Mở Album chứa ${formatPhotoTitle(photo.title)}`}>{photo.src?.trim() ? <img src={photo.src} alt={formatPhotoTitle(photo.title)} loading="lazy" decoding="async" /> : <span className="photo-list__placeholder" aria-hidden="true" />}<span>{String(index + 1).padStart(2, "0")}</span></button>
          <div className="feast-asset__copy"><p>{liturgicalDetailLabels(getLiturgicalMetadata(photo.title, photo.location)).join(" · ")}</p><h3>{formatPhotoTitle(photo.title)}</h3><button type="button" onClick={() => setLocation(`/album/${album.slug}`)}><FolderOpen size={14} strokeWidth={1.8} /> {formatAlbumTitle(album.title)} <ChevronRight size={14} strokeWidth={1.8} /></button></div>
        </article>)}</div>}
      </article>
      <aside className="feast-catalog" aria-label="Mục lục Danh sách Lễ">
        <label className="feast-catalog__search"><Search size={16} strokeWidth={1.8} /><span className="sr-only">Tìm trong Danh sách Lễ</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm Lễ hoặc ngày" /></label>
        <div className="feast-catalog__scroll">{groupedCatalog.map(({ group, entries }) => <section key={group}><h2>{group}</h2>{entries.map((entry) => <button ref={selectedEntry.id === entry.id ? activeEntryRef : undefined} key={entry.id} type="button" className={selectedEntry.id === entry.id ? "is-active" : ""} onClick={() => setLocation(`/tra-cuu-le/${entry.id}`)} aria-current={selectedEntry.id === entry.id ? "page" : undefined}><span>{entry.date ? dateLabel(entry.date) : "·"}</span><strong>{entry.title}</strong><ChevronRight size={13} strokeWidth={1.8} /></button>)}</section>)}</div>
      </aside>
    </section>
    <footer className="site-footer"><button className="site-footer__sync-shortcut" type="button" onClick={registerTap} aria-label="Long Nguyen © 2026"><span>Long Nguyen © 2026</span></button></footer>
  </main>;
}
