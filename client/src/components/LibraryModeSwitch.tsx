/**
 * Design: Long Nguyen's personal image archive — clear separation between file browsing and image browsing.
 * “Theo thư mục” is Explorer-like navigation; “Xem tất cả” remains a visual timeline.
 */
import { FolderTree, Images } from "lucide-react";
import { Link } from "wouter";

type LibraryModeSwitchProps = { active: "albums" | "all" };

export function LibraryModeSwitch({ active }: LibraryModeSwitchProps) {
  return <nav className="library-mode-switch" aria-label="Chế độ xem thư viện">
    <Link href="/" className={`library-mode-switch__option ${active === "albums" ? "is-active" : ""}`} aria-current={active === "albums" ? "page" : undefined}><FolderTree size={18} strokeWidth={1.75} /><span><small>Duyệt tệp</small><strong>Theo thư mục</strong></span></Link>
    <Link href="/timeline" className={`library-mode-switch__option ${active === "all" ? "is-active" : ""}`} aria-current={active === "all" ? "page" : undefined}><Images size={18} strokeWidth={1.75} /><span><small>Xem ảnh</small><strong>Xem tất cả</strong></span></Link>
  </nav>;
}
