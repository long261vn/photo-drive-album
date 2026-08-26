/**
 * Design: Liturgical Design Archive.
 * A reverent full-viewport viewing surface with staged loading and a gentle, interruptible transition.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Expand, Minimize, Minus, Plus, RotateCcw, X } from "lucide-react";
import { formatAlbumTitle, formatPhotoTitle, type Photo } from "@/lib/albumData";

type LightboxProps = { photo: Photo; index: number; count: number; onClose: () => void; onPrevious: () => void; onNext: () => void };

export function Lightbox({ photo, index, count, onClose, onPrevious, onNext }: LightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const changeZoom = (amount: number) => setZoom((value) => Math.min(3, Math.max(1, Math.round((value + amount) * 10) / 10)));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  useEffect(() => { setImageLoaded(false); resetZoom(); }, [photo.id]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "+" || event.key === "=") { event.preventDefault(); changeZoom(0.5); }
      if (event.key === "-") { event.preventDefault(); changeZoom(-0.5); }
      if (event.key === "0") resetZoom();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, 180);
  };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await lightboxRef.current?.requestFullscreen?.();
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    if (!start) return;
    setPan({ x: start.panX + event.clientX - start.x, y: start.panY + event.clientY - start.y });
  };
  const handlePointerUp = () => { pointerStart.current = null; };
  const photoTitle = formatPhotoTitle(photo.title);

  if (!photo.src?.trim()) return null;

  return (
    <div ref={lightboxRef} className={`lightbox${isClosing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-label={`Xem thiết kế ${photoTitle}`}>
      <div className="lightbox__bar">
        <div><p className="eyebrow">Thiết kế / {String(index + 1).padStart(2, "0")}</p><h2>{photoTitle}</h2></div>
        <div className="lightbox__controls" aria-label="Công cụ xem ảnh"><button type="button" onClick={() => changeZoom(-0.5)} disabled={zoom <= 1} aria-label="Thu nhỏ"><Minus size={18} strokeWidth={1.8} /></button><button type="button" onClick={resetZoom} aria-label="Vừa toàn bộ ảnh"><RotateCcw size={15} strokeWidth={1.8} /><span>{zoom === 1 ? "Vừa ảnh" : `${Math.round(zoom * 100)}%`}</span></button><button type="button" onClick={() => changeZoom(0.5)} disabled={zoom >= 3} aria-label="Phóng to"><Plus size={18} strokeWidth={1.8} /></button><button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>{isFullscreen ? <Minimize size={18} strokeWidth={1.8} /> : <Expand size={18} strokeWidth={1.8} />}</button><button className="icon-button lightbox__close" type="button" onClick={requestClose} aria-label="Đóng thiết kế"><X size={21} strokeWidth={1.8} /></button></div>
      </div>
      <div className={`lightbox__frame${imageLoaded ? " is-loaded" : ""}${zoom > 1 ? " is-zoomed" : ""}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={(event) => { event.preventDefault(); changeZoom(event.deltaY < 0 ? 0.2 : -0.2); }}>
        <button className="lightbox__nav lightbox__nav--previous" type="button" onClick={onPrevious} aria-label="Thiết kế trước"><ChevronLeft size={28} strokeWidth={1.65} /></button>
        <div className="lightbox__canvas" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}><img key={photo.id} src={photo.src} alt={photoTitle} draggable={false} decoding="async" onLoad={() => setImageLoaded(true)} /></div>
        <button className="lightbox__nav lightbox__nav--next" type="button" onClick={onNext} aria-label="Thiết kế tiếp theo"><ChevronRight size={28} strokeWidth={1.65} /></button>
      </div>
      <div className="lightbox__footer"><p>{formatAlbumTitle(photo.location)} <span>—</span> {photo.date}</p><a className="download-button" href={photo.downloadUrl} target="_blank" rel="noreferrer"><Download size={16} strokeWidth={1.8} /> Tải xuống</a><span className="lightbox__position">{index + 1} / {count}</span></div>
    </div>
  );
}
