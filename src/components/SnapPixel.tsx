"use client";

import { useEffect } from "react";
import { SNAP_PIXEL_ID, isSnapPixelConfigured } from "@/lib/snap-pixel";

type SnaptrFn = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  handleRequest?: (...args: unknown[]) => void;
};

/**
 * Loads Snap Pixel and fires PAGE_VIEW once when mounted (after consent / test mode).
 * Uses DOM injection so it works when mounted after cookie accept (next/script can miss that).
 */
export function SnapPixel() {
  useEffect(() => {
    if (!isSnapPixelConfigured()) return;

    const w = window as Window & { snaptr?: SnaptrFn };

    if (typeof w.snaptr !== "function") {
      const stub: SnaptrFn = (...args: unknown[]) => {
        if (stub.handleRequest) {
          stub.handleRequest(...args);
        } else {
          (stub.queue ||= []).push(args);
        }
      };
      stub.queue = [];
      w.snaptr = stub;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://sc-static.net/scevent.min.js";
      const first = document.getElementsByTagName("script")[0];
      first?.parentNode?.insertBefore(script, first);
    }

    w.snaptr!("init", SNAP_PIXEL_ID, {});
    w.snaptr!("track", "PAGE_VIEW");
  }, []);

  return null;
}
