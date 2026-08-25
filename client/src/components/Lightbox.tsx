/**
 * Design: Liturgical Design Archive.
 * A reverent full-viewport viewing surface with staged loading and a gentle, interruptible transition.
 */
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import type { Photo } from "@/lib/albumData";

type LightboxProps = { photo: Photo; index: number; count: number; onClose: () => void; onPrevious: () => void; onNext: () => void };

export function Lightbox({ photo, index, count, onClose, onPrevious, onNext }: LightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => { setImageLoaded(false); }, [photo.id]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, 180);
  };

  if (!photo.src?.trim()) return null;

  return (
    <div className={`lightbox${isClosing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-label={`Xem thiết kế ${photo.title}`}>
      <div className="lightbox__bar">
        <div><p className="eyebrow">Thiết kế / {String(index + 1).padStart(2, "0")}</p><h2>{photo.title}</h2></div>
        <button className="icon-button lightbox__close" type="button" onClick={requestClose} aria-label="Đóng thiết kế"><X size={21} strokeWidth={1.8} /></button>
      </div>
      <div className={`lightbox__frame${imageLoaded ? " is-loaded" : ""}`}>
        <button className="lightbox__nav lightbox__nav--previous" type="button" onClick={onPrevious} aria-label="Thiết kế trước"><ChevronLeft size={28} strokeWidth={1.65} /></button>
        <img key={photo.id} src={photo.src} alt={photo.title} decoding="async" onLoad={() => setImageLoaded(true)} />
        <button className="lightbox__nav lightbox__nav--next" type="button" onClick={onNext} aria-label="Thiết kế tiếp theo"><ChevronRight size={28} strokeWidth={1.65} /></button>
      </div>
      <div className="lightbox__footer"><p>{photo.location} <span>—</span> {photo.date}</p><a className="download-button" href={photo.downloadUrl} target="_blank" rel="noreferrer"><Download size={16} strokeWidth={1.8} /> Tải thiết kế</a><span className="lightbox__position">{index + 1} / {count}</span></div>
    </div>
  );
}
