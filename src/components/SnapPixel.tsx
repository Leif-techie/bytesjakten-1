"use client";

import Script from "next/script";
import { SNAP_PIXEL_ID, isSnapPixelConfigured } from "@/lib/snap-pixel";

/**
 * Loads Snap Pixel and fires PAGE_VIEW once per full page load.
 * Requires NEXT_PUBLIC_SNAP_PIXEL_ID.
 */
export function SnapPixel() {
  if (!isSnapPixelConfigured()) return null;

  return (
    <Script
      id="snap-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
{a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
r.src=n;var u=t.getElementsByTagName(s)[0];
u.parentNode.insertBefore(r,u);})(window,document,
'https://sc-static.net/scevent.min.js');
snaptr('init', ${JSON.stringify(SNAP_PIXEL_ID)}, {});
snaptr('track', 'PAGE_VIEW');
        `.trim(),
      }}
    />
  );
}
