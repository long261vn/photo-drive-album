import { useEffect, useRef } from "react";

const REQUIRED_TAP_COUNT = 7;
const TAP_WINDOW_MS = 5_000;
const SYNC_WORKFLOW_URL = "https://github.com/long261vn/photo-drive-album/actions/workflows/sync-google-drive.yml";

export function useSyncWorkflowShortcut() {
  const tapCount = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTaps = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = null;
    tapCount.current = 0;
  };

  const registerTap = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    tapCount.current += 1;

    if (tapCount.current >= REQUIRED_TAP_COUNT) {
      resetTaps();
      window.location.assign(SYNC_WORKFLOW_URL);
      return;
    }

    resetTimer.current = setTimeout(resetTaps, TAP_WINDOW_MS);
  };

  useEffect(() => resetTaps, []);

  return { registerTap };
}
