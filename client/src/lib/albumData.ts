/**
 * Data contract: Contemporary Editorial Archive.
 * Replace this demo data with the generated Google Drive manifest in the next integration phase.
 */
export type Photo = {
  id: string;
  title: string;
  location: string;
  date: string;
  src: string;
  downloadUrl: string;
  orientation: "portrait" | "landscape" | "square";
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
  photos: Photo[];
};

const image = (id: string, width: number, quality = 86) =>
  ["https://images", "unsplash", "com"].join(".") + `/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const albums: Album[] = [
  {
    id: "01",
    slug: "da-lat-2024",
    title: "Những vùng cao, những ngày sương",
    subtitle: "Tập mẫu / đường xa",
    date: "11.2024",
    location: "Kho ảnh minh họa",
    count: 24,
    cover: image("photo-1500534314209-a25ddb2bd429", 1500),
    accent: "cobalt",
    description:
      "Một tập ảnh minh họa cho cấu trúc album. Khi folder Google Drive được kết nối, hình ảnh và metadata của bạn sẽ thay thế dữ liệu mẫu này.",
    photos: [
      {
        id: "dl-01",
        title: "Đường thông sau mưa",
        location: "Đèo Prenn",
        date: "14.11.2024",
        src: image("photo-1500534314209-a25ddb2bd429", 1600),
        downloadUrl: image("photo-1500534314209-a25ddb2bd429", 2400, 95),
        orientation: "landscape",
      },
      {
        id: "dl-02",
        title: "Sương qua mái nhà",
        location: "Đà Lạt",
        date: "15.11.2024",
        src: image("photo-1519681393784-d120267933ba", 1200),
        downloadUrl: image("photo-1519681393784-d120267933ba", 2200, 95),
        orientation: "portrait",
      },
      {
        id: "dl-03",
        title: "Hồ yên lúc sáu giờ",
        location: "Tuyền Lâm",
        date: "15.11.2024",
        src: image("photo-1482192596544-9eb780fc7f66", 1400),
        downloadUrl: image("photo-1482192596544-9eb780fc7f66", 2400, 95),
        orientation: "landscape",
      },
      {
        id: "dl-04",
        title: "Một góc hiên nhỏ",
        location: "Trại Mát",
        date: "16.11.2024",
        src: image("photo-1501785888041-af3ef285b470", 1200),
        downloadUrl: image("photo-1501785888041-af3ef285b470", 2200, 95),
        orientation: "portrait",
      },
      {
        id: "dl-05",
        title: "Màu xanh của rừng",
        location: "Đèo Mimosa",
        date: "16.11.2024",
        src: image("photo-1454496522488-7a8e488e8606", 1400),
        downloadUrl: image("photo-1454496522488-7a8e488e8606", 2400, 95),
        orientation: "landscape",
      },
    ],
  },
  {
    id: "02",
    slug: "nhung-bua-com",
    title: "Những bữa cơm ở nhà",
    subtitle: "Tập hai / thân thuộc",
    date: "03.2025",
    location: "Hồ Chí Minh, Việt Nam",
    count: 18,
    cover: image("photo-1547592180-85f173990554", 1500),
    accent: "terracotta",
    description:
      "Những bàn tay đã quen với nhau, tiếng bát đũa và ánh nắng đi qua một bữa trưa không cần dịp đặc biệt.",
    photos: [
      {
        id: "nbc-01",
        title: "Món rau đầu mùa",
        location: "Bếp nhà",
        date: "02.03.2025",
        src: image("photo-1547592180-85f173990554", 1400),
        downloadUrl: image("photo-1547592180-85f173990554", 2400, 95),
        orientation: "landscape",
      },
      {
        id: "nbc-02",
        title: "Nắng trên khăn bàn",
        location: "Bếp nhà",
        date: "02.03.2025",
        src: image("photo-1498837167922-ddd27525d352", 1200),
        downloadUrl: image("photo-1498837167922-ddd27525d352", 2200, 95),
        orientation: "portrait",
      },
      {
        id: "nbc-03",
        title: "Một phần cho người đến muộn",
        location: "Bếp nhà",
        date: "02.03.2025",
        src: image("photo-1551218808-94e220e084d2", 1400),
        downloadUrl: image("photo-1551218808-94e220e084d2", 2400, 95),
        orientation: "landscape",
      },
    ],
  },
  {
    id: "03",
    slug: "bo-bien-2026",
    title: "Bờ biển cuối mùa gió",
    subtitle: "Tập ba / phía chân trời",
    date: "02.2026",
    location: "Bình Thuận, Việt Nam",
    count: 16,
    cover: image("photo-1500530855697-b586d89ba3ee", 1500),
    accent: "slate",
    description:
      "Một buổi chiều nước rút rất chậm, khi mọi câu chuyện đều có thể để lại trên cát rồi chờ sóng mang đi.",
    photos: [
      {
        id: "bb-01",
        title: "Lúc thuyền về",
        location: "Mũi Né",
        date: "18.02.2026",
        src: image("photo-1500530855697-b586d89ba3ee", 1400),
        downloadUrl: image("photo-1500530855697-b586d89ba3ee", 2400, 95),
        orientation: "landscape",
      },
      {
        id: "bb-02",
        title: "Gió ngang vai",
        location: "Mũi Né",
        date: "18.02.2026",
        src: image("photo-1476673160081-cf065607f449", 1200),
        downloadUrl: image("photo-1476673160081-cf065607f449", 2200, 95),
        orientation: "portrait",
      },
      {
        id: "bb-03",
        title: "Một điểm xanh xa",
        location: "Bình Thuận",
        date: "19.02.2026",
        src: image("photo-1464822759023-fed622ff2c3b", 1400),
        downloadUrl: image("photo-1464822759023-fed622ff2c3b", 2400, 95),
        orientation: "landscape",
      },
    ],
  },
];

export const findAlbum = (slug: string) => albums.find((album) => album.slug === slug);
