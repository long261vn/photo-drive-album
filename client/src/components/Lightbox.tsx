/**
 * Design: Contemporary Editorial Archive.
 * Full-viewport viewing surface with explicit touch targets and minimal visual chrome.
 */
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import type { Photo } from "@/lib/albumData";

type LightboxProps = {
  photo: Photo;
  index: number;
  count: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function Lightbox({ photo, index, count, onClose, onPrevious, onNext }: LightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Xem ảnh ${photo.title}`}>
      <div className="lightbox__bar">
        <div>
          <p className="eyebrow">Khoảnh khắc / {String(index + 1).padStart(2, "0")}</p>
          <h2>{photo.title}</h2>
        </div>
        <button className="icon-button lightbox__close" type="button" onClick={onClose} aria-label="Đóng ảnh">
          <X size={21} strokeWidth={1.8} />
        </button>
      </div>

      <div className="lightbox__frame">
        <button className="lightbox__nav lightbox__nav--previous" type="button" onClick={onPrevious} aria-label="Ảnh trước">
          <ChevronLeft size={28} strokeWidth={1.65} />
        </button>
        <img src={photo.src} alt={photo.title} />
        <button className="lightbox__nav lightbox__nav--next" type="button" onClick={onNext} aria-label="Ảnh tiếp theo">
          <ChevronRight size={28} strokeWidth={1.65} />
        </button>
      </div>

      <div className="lightbox__footer">
        <p>
          {photo.location} <span>—</span> {photo.date}
        </p>
        <a className="download-button" href={photo.downloadUrl} target="_blank" rel="noreferrer">
          <Download size={16} strokeWidth={1.8} /> Tải ảnh
        </a>
        <span className="lightbox__position">{index + 1} / {count}</span>
      </div>
    </div>
  );
}
