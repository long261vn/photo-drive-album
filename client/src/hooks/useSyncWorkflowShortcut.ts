import { useEffect, useRef, useState } from "react";

const HOLD_DURATION_MS = 5_000;
const SYNC_WORKFLOW_URL = "https://github.com/long261vn/photo-drive-album/actions/workflows/sync-google-drive.yml";

export function useSyncWorkflowShortcut() {
  const [isHolding, setIsHolding] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setIsHolding(false);
  };

  const beginHold = () => {
    if (holdTimer.current) return;
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setIsHolding(false);
      window.location.assign(SYNC_WORKFLOW_URL);
    }, HOLD_DURATION_MS);
  };

  useEffect(() => cancelHold, []);

  return { isHolding, beginHold, cancelHold };
}
