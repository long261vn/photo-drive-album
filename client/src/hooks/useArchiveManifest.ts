/**
 * Design: Liturgical Design Archive.
 * Static manifest reader: frontend never receives Google Drive credentials.
 */
import { useEffect, useState } from "react";
import { sampleAlbums, sampleProfile, type ArchiveManifest, type Album, type ArchiveProfile } from "@/lib/albumData";

type ArchiveState = { albums: Album[]; profile: ArchiveProfile; isLive: boolean; isLoading: boolean };

const initialState: ArchiveState = { albums: sampleAlbums, profile: sampleProfile, isLive: false, isLoading: true };

export function useArchiveManifest(): ArchiveState {
  const [state, setState] = useState<ArchiveState>(initialState);

  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}data/albums.json`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest: ArchiveManifest | null) => {
        if (!active || !manifest || !Array.isArray(manifest.albums) || manifest.albums.length === 0) return;
        setState({ albums: manifest.albums, profile: manifest.profile ?? sampleProfile, isLive: manifest.source.mode === "google-drive", isLoading: false });
      })
      .catch(() => undefined)
      .finally(() => { if (active) setState((current) => ({ ...current, isLoading: false })); });
    return () => { active = false; };
  }, []);

  return state;
}
