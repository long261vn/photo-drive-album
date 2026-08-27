/**
 * Design: Windows Explorer-inspired folder visual for Long Nguyen's archive.
 * Open folder previews reveal a few contained files; detail mode is deliberately a closed folder icon.
 */
import { Folder, FolderOpen } from "lucide-react";
import { type Album, type Photo } from "@/lib/albumData";

type FolderPreviewSize = "large" | "small" | "detail";

type ExplorerFolderPreviewProps = {
  album: Album;
  size?: FolderPreviewSize;
};

const previewPhotos = (album: Album): Photo[] => [
  ...album.photos.filter((photo) => !photo.isBackground),
  ...(album.children ?? []).flatMap(previewPhotos),
].slice(0, 3);

export function ExplorerFolderPreview({ album, size = "large" }: ExplorerFolderPreviewProps) {
  if (size === "detail") return <span className="explorer-folder-detail-icon" aria-hidden="true"><Folder size={25} strokeWidth={1.55} /></span>;

  const previews = previewPhotos(album);
  return <span className={`explorer-folder-preview explorer-folder-preview--${size}`} aria-hidden="true">
    <span className="explorer-folder-preview__tab" />
    <span className="explorer-folder-preview__body">
      {previews.length ? previews.map((photo, index) => <img key={photo.id} className={`explorer-folder-preview__file explorer-folder-preview__file--${index + 1}`} src={photo.src} alt="" loading="lazy" decoding="async" />) : <FolderOpen className="explorer-folder-preview__empty" strokeWidth={1.45} />}
    </span>
  </span>;
}
