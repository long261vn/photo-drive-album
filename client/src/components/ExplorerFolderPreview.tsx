/**
 * Design: Long Nguyen folder browser uses one compact, closed folder symbol at every level and in every view.
 * Folder artwork never appears inside this symbol, so the hierarchy stays calm and easy to scan.
 */
import { Folder } from "lucide-react";
import { type Album } from "@/lib/albumData";

type FolderPreviewSize = "large" | "small" | "detail";

type ExplorerFolderPreviewProps = {
  album: Album;
  size?: FolderPreviewSize;
};

export function ExplorerFolderPreview({ album, size = "large" }: ExplorerFolderPreviewProps) {
  const iconSize = size === "large" ? 80 : size === "small" ? 48 : 28;
  return <span className={`explorer-folder-icon explorer-folder-icon--${size}`} data-folder-id={album.id} aria-hidden="true"><Folder size={iconSize} strokeWidth={1.45} /></span>;
}
