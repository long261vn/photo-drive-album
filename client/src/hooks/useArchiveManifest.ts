/**
 * Design: Static manifest reader for Long Nguyen's folder browser.
 * A shared in-memory result keeps internal folder navigation instant and never exposes Drive credentials.
 */
import { useEffect, useState } from "react";
import { sampleAlbums, sampleProfile, type ArchiveManifest, type Album, type ArchiveProfile } from "@/lib/albumData";

type ArchiveState = { albums: Album[]; profile: ArchiveProfile; isLive: boolean; isLoading: boolean };

const initialState: ArchiveState = { albums: sampleAlbums, profile: sampleProfile, isLive: false, isLoading: true };
let cachedState: ArchiveState | null = null;
let manifestRequest: Promise<ArchiveState> | null = null;

const loadManifest = (): Promise<ArchiveState> => {
  if (cachedState) return Promise.resolve(cachedState);
  if (!manifestRequest) {
    manifestRequest = fetch(`${import.meta.env.BASE_URL}data/albums.json`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest: ArchiveManifest | null) => {
        if (!manifest || !Array.isArray(manifest.albums) || manifest.albums.length === 0) return { ...initialState, isLoading: false };
        cachedState = { albums: manifest.albums, profile: manifest.profile ?? sampleProfile, isLive: manifest.source.mode === "google-drive", isLoading: false };
        return cachedState;
      })
      .catch(() => ({ ...initialState, isLoading: false }));
  }
  return manifestRequest;
};

export function useArchiveManifest(): ArchiveState {
  const [state, setState] = useState<ArchiveState>(() => cachedState ?? initialState);

  useEffect(() => {
    let active = true;
    void loadManifest().then((next) => { if (active) setState(next); });
    return () => { active = false; };
  }, []);

  return state;
}
