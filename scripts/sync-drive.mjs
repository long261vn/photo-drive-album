/**
 * Liturgical Design Archive — Google Drive to static manifest synchronizer.
 * Requires a public Drive folder and GOOGLE_DRIVE_API_KEY in the execution environment.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const ROOT_FOLDER_ID = process.env.DRIVE_ROOT_FOLDER_ID || "1ua5LsDU7yv-Y_ZFyFA7lx4LoKiXcGwUw";
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const OUTPUT_FILE = resolve(process.cwd(), "client/public/data/albums.json");
const FOLDER_MIME = "application/vnd.google-apps.folder";

if (!API_KEY) {
  console.error("GOOGLE_DRIVE_API_KEY is required. Add it as a GitHub Actions secret before syncing.");
  process.exit(1);
}

const driveUrl = new URL("https://www.googleapis.com/drive/v3/files");

const toSlug = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/đ/g, "d")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const titleFromFileName = (name) => name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

const titleFromFolderName = (name) => {
  const ordinaryMatch = name.match(/^CN\s*(\d{1,2})\s*[_-]?\s*TN\s*[_-]?\s*([ABC])$/i);
  if (ordinaryMatch) return `Chúa Nhật thứ ${ordinaryMatch[1]} Thường Niên — Năm ${ordinaryMatch[2].toUpperCase()}`;
  return titleFromFileName(name);
};

const subtitleFromFolderName = (name) => {
  const ordinaryMatch = name.match(/^CN\s*\d{1,2}\s*[_-]?\s*TN\s*[_-]?\s*([ABC])$/i);
  if (ordinaryMatch) return `Mùa Thường Niên / Năm ${ordinaryMatch[1].toUpperCase()}`;
  return "Thiết kế phụng vụ";
};

const formatMonthYear = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
};

const orientationFrom = (metadata = {}) => {
  const width = Number(metadata.width || 0);
  const height = Number(metadata.height || 0);
  if (!width || !height) return "landscape";
  if (Math.abs(width - height) / Math.max(width, height) < 0.1) return "square";
  return width > height ? "landscape" : "portrait";
};

async function listFiles(parentId, onlyFolders = false) {
  const files = [];
  let pageToken = "";
  do {
    const params = new URLSearchParams({
      key: API_KEY,
      q: `'${parentId}' in parents and trashed = false${onlyFolders ? ` and mimeType = '${FOLDER_MIME}'` : ""}`,
      orderBy: onlyFolders ? "folder,name_natural" : "name_natural",
      pageSize: "1000",
      fields: "nextPageToken,files(id,name,mimeType,modifiedTime,createdTime,description,imageMediaMetadata(width,height),webViewLink,webContentLink)",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const response = await fetch(`${driveUrl}?${params}`);
    if (!response.ok) throw new Error(`Drive API ${response.status}: ${await response.text()}`);
    const body = await response.json();
    files.push(...(body.files ?? []));
    pageToken = body.nextPageToken || "";
  } while (pageToken);
  return files;
}

function photoFromDriveFile(file, folderTitle) {
  const previewUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`;
  return {
    id: file.id,
    title: titleFromFileName(file.name),
    location: folderTitle,
    date: formatMonthYear(file.modifiedTime || file.createdTime),
    src: previewUrl,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
    orientation: orientationFrom(file.imageMediaMetadata),
    mimeType: file.mimeType,
  };
}

async function sync() {
  const folders = await listFiles(ROOT_FOLDER_ID, true);
  const albums = await Promise.all(folders.map(async (folder, index) => {
    const files = (await listFiles(folder.id)).filter((file) => file.mimeType?.startsWith("image/"));
    const title = titleFromFolderName(folder.name);
    const photos = files.map((file) => photoFromDriveFile(file, title));
    const cover = photos.find((photo) => /^cover(?:\s|$)/i.test(photo.title)) ?? photos[0];
    return {
      id: String(index + 1).padStart(2, "0"),
      slug: toSlug(folder.name) || folder.id,
      title,
      subtitle: subtitleFromFolderName(folder.name),
      date: formatMonthYear(folder.modifiedTime || folder.createdTime),
      location: "Thiết kế phụng vụ",
      count: photos.length,
      cover: cover?.src || "",
      accent: "green",
      description: folder.description || `Bộ thiết kế ${title.toLocaleLowerCase("vi-VN")}.`,
      photos,
    };
  }));

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: { rootFolderId: ROOT_FOLDER_ID, rootFolderName: "Website_LHN", mode: "google-drive" },
    albums,
  };
  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Synced ${albums.length} folders and ${albums.reduce((total, album) => total + album.photos.length, 0)} image files.`);
}

sync().catch((error) => { console.error(error); process.exit(1); });
