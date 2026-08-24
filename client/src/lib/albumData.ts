/**
 * Design: Liturgical Design Archive.
 * The production source is /data/albums.json, generated from Google Drive. These samples only protect the UI before the first sync.
 */
export type Photo = {
  id: string;
  title: string;
  location: string;
  date: string;
  src: string;
  downloadUrl: string;
  orientation: "portrait" | "landscape" | "square";
  mimeType?: string;
};

export type Album = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  count: number;
  cover: string;
  accent: string;
  description: string;
  createdAt?: string;
  photos: Photo[];
};

export type ArchiveManifest = {
  generatedAt: string | null;
  source: { rootFolderId: string; rootFolderName?: string; profileFolderId?: string; mode: "sample" | "google-drive" };
  albums: Album[];
  profile?: ArchiveProfile;
};

export type ArchiveProfile = {
  name: string;
  handle: string;
  bio: string;
  details: string[];
  avatar: string;
  cover: string;
  coverPosition?: { x: number; y: number };
};

const image = (id: string, width: number, quality = 86) =>
  ["https://images", "unsplash", "com"].join(".") + `/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

const samplePhoto = (id: string, title: string, location: string, date: string, sourceId: string, orientation: Photo["orientation"]): Photo => ({
  id,
  title,
  location,
  date,
  src: image(sourceId, 1600),
  downloadUrl: image(sourceId, 2400, 95),
  orientation,
});

export const sampleAlbums: Album[] = [
  {
    id: "01",
    slug: "cn20-tn-a",
    title: "Chúa Nhật thứ 20 Thường Niên — Năm A",
    subtitle: "Mùa Thường Niên / Năm A",
    date: "08.2026",
    location: "Thiết kế phụng vụ",
    count: 3,
    cover: image("photo-1438032005730-c779502df39b", 1500),
    accent: "green",
    description: "Bộ thiết kế mẫu cho Chúa Nhật Thường Niên, dành cho truyền thông giáo xứ và các kênh mục vụ.",
    photos: [
      samplePhoto("cn20-a-01", "Banner Lời Chúa", "Chúa Nhật XX Thường Niên", "08.2026", "photo-1504052434569-70ad5836ab65", "landscape"),
      samplePhoto("cn20-a-02", "Lời nguyện đầu lễ", "Chúa Nhật XX Thường Niên", "08.2026", "photo-1444723121867-7a241cacace9", "portrait"),
      samplePhoto("cn20-a-03", "Lịch cử hành", "Chúa Nhật XX Thường Niên", "08.2026", "photo-1466442929976-97f336a657be", "square"),
    ],
  },
  {
    id: "02",
    slug: "cn21-tn-a",
    title: "Chúa Nhật thứ 21 Thường Niên — Năm A",
    subtitle: "Mùa Thường Niên / Năm A",
    date: "08.2026",
    location: "Thiết kế phụng vụ",
    count: 3,
    cover: image("photo-1498623116890-37e912163d5d", 1500),
    accent: "green",
    description: "Một mẫu kho trình bày cách sắp xếp thiết kế theo từng Chúa Nhật trong chu kỳ phụng vụ.",
    photos: [
      samplePhoto("cn21-a-01", "Hành trình đức tin", "Chúa Nhật XXI Thường Niên", "08.2026", "photo-1473177104440-ffee2f376098", "landscape"),
      samplePhoto("cn21-a-02", "Trích đoạn Tin Mừng", "Chúa Nhật XXI Thường Niên", "08.2026", "photo-1464822759023-fed622ff2c3b", "portrait"),
      samplePhoto("cn21-a-03", "Thông báo mục vụ", "Chúa Nhật XXI Thường Niên", "08.2026", "photo-1519491050282-cf00c82424b4", "square"),
    ],
  },
];

export const sampleProfile: ArchiveProfile = {
  name: "Thư viện Phụng vụ",
  handle: "Kho thiết kế Công giáo",
  bio: "Nơi lưu trữ các thiết kế truyền thông được sắp theo Chúa Nhật, mùa phụng vụ và nhịp sống của cộng đoàn.",
  details: ["Thiết kế · Google Drive · Cập nhật tự động"],
  avatar: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=320&q=88",
  cover: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1800&q=88",
};

export const findAlbum = (albums: Album[], slug: string) => albums.find((album) => album.slug === slug);
