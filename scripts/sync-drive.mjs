/**
 * Liturgical Design Archive — Google Drive to static manifest synchronizer.
 * Requires public Drive folders, folder IDs supplied by the workflow, and GOOGLE_DRIVE_API_KEY only in the execution environment.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const ROOT_FOLDER_ID = process.env.DRIVE_ROOT_FOLDER_ID;
const PROFILE_FOLDER_ID = process.env.DRIVE_PROFILE_FOLDER_ID;
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const OUTPUT_FILE = resolve(process.cwd(), "client/public/data/albums.json");
const FOLDER_MIME = "application/vnd.google-apps.folder";
const GOOGLE_DOC_MIME = "application/vnd.google-apps.document";
const NON_GALLERY_IMAGE_MIME = /(photoshop|psd|xcf|illustrator|postscript|eps)/i;
const WORK_FOLDER_SEGMENTS = new Set(["psd", "ai", "font", "fonts", "file-thiet-ke", "files-thiet-ke", "file-design", "design-files", "source", "nguon", "layers", "pdf-layers"]);

if (!API_KEY) {
  console.error("GOOGLE_DRIVE_API_KEY is required. Add it as a GitHub Actions secret before syncing.");
  process.exit(1);
}

if (!ROOT_FOLDER_ID || !PROFILE_FOLDER_ID) {
  console.error("DRIVE_ROOT_FOLDER_ID and DRIVE_PROFILE_FOLDER_ID are required. Set them as GitHub Actions secrets before syncing.");
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
const isBackgroundFile = (name = "") => /(?:_|\s|-)BG(?:[_\s.-]|$)/i.test(name);

const isWorkFolder = (folderName = "") => {
  const normalized = toSlug(folderName);
  return [...WORK_FOLDER_SEGMENTS].some((segment) => normalized === segment || normalized.startsWith(`${segment}-`) || normalized.endsWith(`-${segment}`) || normalized.includes(`-${segment}-`));
};

const isGalleryImage = (file) => Boolean(file.mimeType?.startsWith("image/")) && !NON_GALLERY_IMAGE_MIME.test(file.mimeType);

const titleFromFolderName = (name) => {
  const ordinaryMatch = name.match(/^CN\s*(\d{1,2})\s*[_-]?\s*TN\s*[_-]?\s*([ABC])$/i);
  if (ordinaryMatch) return `Chúa Nhật Thứ ${ordinaryMatch[1]} Thường Niên - Năm ${ordinaryMatch[2].toUpperCase()}`;
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

const thumbnailFor = (fileId, width = 1600) => `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;

async function readTextFile(fileId) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`);
  if (!response.ok) throw new Error(`Unable to read profile text (${response.status}): ${await response.text()}`);
  return response.text();
}

async function readProfileInfoFile(file) {
  if (file.mimeType === GOOGLE_DOC_MIME) {
    const params = new URLSearchParams({ mimeType: "text/plain", key: API_KEY });
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}/export?${params}`);
    if (!response.ok) throw new Error(`Unable to export Google Doc info (${response.status}): ${await response.text()}`);
    return response.text();
  }
  return readTextFile(file.id);
}

function parseProfileInfo(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const fields = new Map();
  for (const line of lines) {
    const match = line.match(/^([^:]{1,40}):\s*(.+)$/);
    if (match) fields.set(toSlug(match[1]), match[2].trim());
  }
  const field = (...keys) => keys.map((key) => fields.get(toSlug(key))).find(Boolean) || "";
  const name = field("Tên", "Name", "Tiêu đề", "Title", "Thư viện") || lines[0] || "Thư Viện Hình Công Giáo";
  const handle = field("Tên ngắn", "Handle", "Website", "Đường dẫn");
  const bio = field("Giới thiệu", "Mô tả", "Bio", "Description") || lines.slice(1).filter((line) => !line.match(/^([^:]{1,40}):\s*(.+)$/)).join("\n") || "Thư viện hình ảnh theo lịch phụng vụ.";
  const details = lines.filter((line) => line !== name && line !== bio && !line.match(/^(Tên|Name|Tiêu đề|Title|Thư viện|Tên ngắn|Handle|Website|Đường dẫn|Giới thiệu|Mô tả|Bio|Description):/i)).slice(0, 4);
  return { name, handle, bio, details };
}

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
    createdAt: file.createdTime || file.modifiedTime || null,
    modifiedAt: file.modifiedTime || file.createdTime || null,
    src: previewUrl,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
    orientation: orientationFrom(file.imageMediaMetadata),
    mimeType: file.mimeType,
    isBackground: isBackgroundFile(file.name),
  };
}

function totalAlbumCount(albums) {
  return albums.reduce((total, album) => total + 1 + totalAlbumCount(album.children ?? []), 0);
}

function totalPhotoCount(albums) {
  return albums.reduce((total, album) => total + album.photos.length + totalPhotoCount(album.children ?? []), 0);
}

async function albumFromDriveFolder(folder, index, parent = null) {
  const entries = await listFiles(folder.id);
  const childFolders = entries.filter((file) => file.mimeType === FOLDER_MIME && !isWorkFolder(file.name));
  const imageFiles = entries.filter(isGalleryImage);
  const zipFile = entries.find((file) => file.mimeType === "application/zip" || /\.zip$/i.test(file.name ?? ""));
  const title = titleFromFolderName(folder.name);
  const slugSegment = toSlug(folder.name) || folder.id;
  const slug = parent ? `${parent.slug}--${slugSegment}` : slugSegment;
  const id = parent ? `${parent.id}.${String(index + 1).padStart(2, "0")}` : String(index + 1).padStart(2, "0");
  const photos = imageFiles.map((file) => photoFromDriveFile(file, title));
  const childCandidates = await Promise.all(childFolders.map((childFolder, childIndex) => albumFromDriveFolder(childFolder, childIndex, { id, slug })));
  const children = childCandidates.filter((child) => child.count > 0 || child.children?.length);
  // Cover order is deliberate: cover image in this folder, first image in this folder, then the first visible descendant cover.
  const coverCandidates = photos.filter((photo) => !photo.isBackground);
  const localCover = coverCandidates.find((photo) => /^cover(?:\s|$)/i.test(photo.title)) ?? coverCandidates[0];
  const cover = localCover?.src || children.find((child) => child.cover)?.cover || "";

  return {
    id,
    slug,
    ...(parent ? { parentSlug: parent.slug } : {}),
    title,
    subtitle: subtitleFromFolderName(folder.name),
    date: formatMonthYear(folder.modifiedTime || folder.createdTime),
    location: "Thiết kế phụng vụ",
    createdAt: folder.createdTime,
    count: photos.length + children.reduce((total, child) => total + child.count, 0),
    cover,
    accent: "green",
    description: folder.description || `Album ${title}.`,
    photos,
    ...(zipFile ? { downloadAll: { name: titleFromFileName(zipFile.name), url: `https://drive.google.com/uc?export=download&id=${zipFile.id}` } } : {}),
    ...(children.length ? { children } : {}),
  };
}

async function sync() {
  const folders = (await listFiles(ROOT_FOLDER_ID, true)).filter((folder) => !isWorkFolder(folder.name));
  const profileFiles = await listFiles(PROFILE_FOLDER_ID);
  const fileNamed = (name) => profileFiles.find((file) => file.name?.toLowerCase() === name.toLowerCase());
  const avatarFile = fileNamed("Avatar.png");
  const coverFile = fileNamed("Cover.png");
  const infoFile = profileFiles.find((file) => file.name?.trim().toLowerCase() === "info" && file.mimeType === GOOGLE_DOC_MIME);
  const parsedProfile = infoFile ? parseProfileInfo(await readProfileInfoFile(infoFile)) : parseProfileInfo("");
  const albums = await Promise.all(folders.map((folder, index) => albumFromDriveFolder(folder, index)));

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: { rootFolderId: ROOT_FOLDER_ID, rootFolderName: "Website_LHN", profileFolderId: PROFILE_FOLDER_ID, mode: "google-drive" },
    profile: {
      ...parsedProfile,
      avatar: avatarFile ? thumbnailFor(avatarFile.id, 700) : "",
      cover: coverFile ? thumbnailFor(coverFile.id, 1800) : "",
      infoSource: infoFile ? { id: infoFile.id, name: infoFile.name, modifiedAt: infoFile.modifiedTime } : null,
    },
    albums,
  };
  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Synced ${totalAlbumCount(albums)} folders and ${totalPhotoCount(albums)} image files.`);
}

sync().catch((error) => { console.error(error); process.exit(1); });
