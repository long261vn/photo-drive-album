/** Design: Liturgical Design Archive. Compact semantic filters use the archive's hairline controls and keep the primary image reading path unobstructed. */
import { CalendarDays, RotateCcw, Sparkles } from "lucide-react";
import type { LiturgicalFilters as LiturgicalFiltersState, LiturgicalYear } from "@/lib/liturgicalMetadata";

type LiturgicalFiltersProps = {
  filters: LiturgicalFiltersState;
  seasons: string[];
  years: LiturgicalYear[];
  weeks: number[];
  onChange: (next: LiturgicalFiltersState) => void;
};

export function LiturgicalFilters({ filters, seasons, years, weeks, onChange }: LiturgicalFiltersProps) {
  const hasActiveFilter = Boolean(filters.season || filters.liturgicalYear || filters.week || filters.saintsOnly || filters.marianOnly);
  return <div className="liturgical-filters" aria-label="Lọc theo lịch phụng vụ">
    <label className="liturgical-filters__select"><CalendarDays size={14} strokeWidth={1.8} /><span className="sr-only">Lọc theo Mùa Phụng Vụ</span><select value={filters.season} onChange={(event) => onChange({ ...filters, season: event.target.value, week: "" })}><option value="">Mùa Phụng Vụ</option>{seasons.map((season) => <option value={season} key={season}>{season}</option>)}</select></label>
    <label className="liturgical-filters__select"><span className="liturgical-filters__week-mark">A</span><span className="sr-only">Lọc theo Năm Phụng Vụ</span><select value={filters.liturgicalYear} onChange={(event) => onChange({ ...filters, liturgicalYear: event.target.value as "" | LiturgicalYear })}><option value="">Năm A/B/C</option>{years.map((year) => <option value={year} key={year}>Năm {year}</option>)}</select></label>
    <label className="liturgical-filters__select"><span className="liturgical-filters__week-mark">W</span><span className="sr-only">Lọc theo tuần phụng vụ</span><select value={filters.week} onChange={(event) => onChange({ ...filters, week: event.target.value })}><option value="">Tuần</option>{weeks.map((week) => <option value={String(week)} key={week}>Tuần {String(week).padStart(2, "0")}</option>)}</select></label>
    <button className={`liturgical-filters__chip${filters.saintsOnly ? " is-active" : ""}`} type="button" onClick={() => onChange({ ...filters, saintsOnly: !filters.saintsOnly })} aria-pressed={filters.saintsOnly}><Sparkles size={14} strokeWidth={1.8} /> Các Thánh</button>
    <button className={`liturgical-filters__chip${filters.marianOnly ? " is-active" : ""}`} type="button" onClick={() => onChange({ ...filters, marianOnly: !filters.marianOnly })} aria-pressed={filters.marianOnly}>Đức Mẹ</button>
    {hasActiveFilter && <button className="liturgical-filters__reset" type="button" onClick={() => onChange({ season: "", liturgicalYear: "", week: "", saintsOnly: false, marianOnly: false })}><RotateCcw size={13} strokeWidth={1.8} /> Bỏ lọc</button>}
  </div>;
}
