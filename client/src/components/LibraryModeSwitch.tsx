/**
 * Design: Liturgical Design Archive — a clear two-path library switch.
 * Album browsing and all-design browsing are equal, deliberate reading modes.
 */
import { FolderTree, Images } from "lucide-react";
import { Link } from "wouter";

type LibraryModeSwitchProps = { active: "albums" | "all" };

export function LibraryModeSwitch({ active }: LibraryModeSwitchProps) {
  return <nav className="library-mode-switch" aria-label="Chế độ xem thư viện">
    <Link href="/" className={`library-mode-switch__option ${active === "albums" ? "is-active" : ""}`} aria-current={active === "albums" ? "page" : undefined}><FolderTree size={18} strokeWidth={1.75} /><span><small>Chế độ 01</small><strong>Xem theo Album</strong></span></Link>
    <Link href="/timeline" className={`library-mode-switch__option ${active === "all" ? "is-active" : ""}`} aria-current={active === "all" ? "page" : undefined}><Images size={18} strokeWidth={1.75} /><span><small>Chế độ 02</small><strong>Xem tất cả</strong></span></Link>
  </nav>;
}
