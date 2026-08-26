/**
 * Design: Personal image gallery — downloads retain the original Drive files,
 * while selected images are bundled into a single, clearly named ZIP archive.
 */
import { zipSync } from "fflate";
import type { Photo } from "./albumData";

type DownloadProgress = { completed: number; total: number };
type DownloadResult = { downloaded: number; failed: number };

const extensionFor = (photo: Photo) => {
  const subtype = photo.mimeType?.split("/")[1]?.toLowerCase();
  if (subtype === "jpeg") return "jpg";
  if (subtype && /^[a-z0-9]+$/.test(subtype)) return subtype;
  return "jpg";
};

const safePart = (value: string, fallback: string) => value
  .trim()
  .replace(/[\\/:*?"<>|]/g, "-")
  .replace(/\s+/g, " ")
  .slice(0, 120) || fallback;

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

export async function downloadPhotosAsZip(photos: Photo[], archiveName: string, onProgress?: (progress: DownloadProgress) => void): Promise<DownloadResult> {
  const files: Record<string, Uint8Array> = {};
  const usedNames = new Set<string>();
  let completed = 0;
  let failed = 0;

  for (const photo of photos) {
    try {
      const response = await fetch(photo.downloadUrl);
      if (!response.ok) throw new Error(`Không thể tải ${photo.id}`);
      const baseName = safePart(photo.title, photo.id);
      const extension = extensionFor(photo);
      let fileName = `${baseName}.${extension}`;
      let copy = 2;
      while (usedNames.has(fileName)) {
        fileName = `${baseName}-${copy}.${extension}`;
        copy += 1;
      }
      usedNames.add(fileName);
      files[fileName] = new Uint8Array(await response.arrayBuffer());
    } catch {
      failed += 1;
    } finally {
      completed += 1;
      onProgress?.({ completed, total: photos.length });
    }
  }

  const downloaded = Object.keys(files).length;
  if (!downloaded) throw new Error("Không có hình nào tải được");
  const zip = zipSync(files, { level: 0 });
  saveBlob(new Blob([zip], { type: "application/zip" }), `${safePart(archiveName, "hinh-da-chon")}.zip`);
  return { downloaded, failed };
}
