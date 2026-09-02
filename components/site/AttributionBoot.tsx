"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";
import { pushEvent } from "@/lib/tracking";

/**
 * Runs once per page load: captures the ad click IDs before they can be lost
 * to a navigation, and arms the 75% scroll event. Renders nothing.
 */
export default function AttributionBoot() {
  useEffect(() => {
    captureAttribution();

    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if ((window.scrollY / scrollable) * 100 < 75) return;
      fired = true;
      pushEvent("scroll_75");
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
