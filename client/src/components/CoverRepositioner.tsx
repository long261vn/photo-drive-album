/**
 * Design: Liturgical profile archive. The cover editor keeps a calm, tactile control surface and exports portable static metadata.
 */
import { Download, Maximize2, RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export type CoverPosition = { x: number; y: number };

type CoverRepositionerProps = {
  src: string;
  alt: string;
  initialPosition: CoverPosition;
};

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

export function CoverRepositioner({ src, alt, initialPosition }: CoverRepositionerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState<CoverPosition>(() => {
    try {
      const saved = window.localStorage.getItem("liturgical-cover-position");
      return saved ? JSON.parse(saved) : initialPosition;
    } catch {
      return initialPosition;
    }
  });
  const dragging = useRef(false);

  const style = useMemo(() => ({ objectPosition: `${position.x}% ${position.y}%` }), [position]);

  const updateFromPointer = (clientX: number, clientY: number, target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    setPosition({ x: clamp(((clientX - rect.left) / rect.width) * 100), y: clamp(((clientY - rect.top) / rect.height) * 100) });
  };

  const saveLocally = () => {
    window.localStorage.setItem("liturgical-cover-position", JSON.stringify(position));
    setIsEditing(false);
  };

  const exportSettings = () => {
    const blob = new Blob([`${JSON.stringify({ coverPosition: position }, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "profile-settings.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`cover-repositioner${isEditing ? " is-editing" : ""}`}>
      <div
        className="profile-cover"
        onPointerDown={(event) => {
          if (!isEditing) return;
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event.clientX, event.clientY, event.currentTarget);
        }}
        onPointerMove={(event) => { if (isEditing && dragging.current) updateFromPointer(event.clientX, event.clientY, event.currentTarget); }}
        onPointerUp={() => { dragging.current = false; }}
      >
        <img src={src} alt={alt} style={style} fetchPriority="high" />
        {isEditing && <div className="cover-repositioner__hint"><Maximize2 size={16} strokeWidth={1.8} /><span>Kéo ảnh để chọn vị trí hiển thị</span></div>}
      </div>
      {isEditing && <div className="cover-repositioner__sliders" aria-label="Điều chỉnh vị trí ảnh bìa">
        <label><span>Ngang</span><input type="range" min="0" max="100" value={position.x} onChange={(event) => setPosition((current) => ({ ...current, x: Number(event.target.value) }))} /><output>{position.x}%</output></label>
        <label><span>Dọc</span><input type="range" min="0" max="100" value={position.y} onChange={(event) => setPosition((current) => ({ ...current, y: Number(event.target.value) }))} /><output>{position.y}%</output></label>
      </div>}
      <div className="cover-repositioner__actions">
        {!isEditing ? <button type="button" onClick={() => setIsEditing(true)}><SlidersHorizontal size={15} strokeWidth={1.8} /> Điều chỉnh ảnh bìa</button> : <>
          <button type="button" onClick={() => setPosition({ x: 50, y: 50 })}><RotateCcw size={15} strokeWidth={1.8} /> Đặt lại</button>
          <button type="button" className="is-primary" onClick={saveLocally}><Save size={15} strokeWidth={1.8} /> Lưu trên thiết bị</button>
          <button type="button" onClick={exportSettings}><Download size={15} strokeWidth={1.8} /> Xuất cấu hình</button>
        </>}
      </div>
    </div>
  );
}
