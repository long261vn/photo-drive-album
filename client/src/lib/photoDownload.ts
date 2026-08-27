/**
 * Design: Personal image gallery — batch downloads remain direct Google Drive files.
 * This avoids cross-origin file reads and reports each request sent to the browser.
 */
import type { Photo } from "./albumData";

export type DirectDownloadProgress = { phase: "preparing" | "sending"; completed: number; total: number };
type DirectDownloadResult = { requested: number };

const DOWNLOAD_GAP_MS = 700;

const requestDownload = (downloadUrl: string) => {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "";
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export async function downloadPhotosIndividually(photos: Photo[], onProgress?: (progress: DirectDownloadProgress) => void): Promise<DirectDownloadResult> {
  const total = photos.length;
  onProgress?.({ phase: "preparing", completed: 0, total });

  for (let index = 0; index < total; index += 1) {
    onProgress?.({ phase: "sending", completed: index, total });
    requestDownload(photos[index].downloadUrl);
    onProgress?.({ phase: "sending", completed: index + 1, total });
    if (index < total - 1) await wait(DOWNLOAD_GAP_MS);
  }

  return { requested: total };
}
