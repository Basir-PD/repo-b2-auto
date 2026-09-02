import type { Lang } from "@/config/routes";
import { fr, type Copy } from "@/content/copy/fr";
import { en } from "@/content/copy/en";

export type { Copy };

const COPY: Record<Lang, Copy> = { fr, en };

/** The copy for a language. Server components call this directly — no context. */
export function getCopy(lang: Lang): Copy {
  return COPY[lang];
}
