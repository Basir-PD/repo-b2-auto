import { ShieldCheck } from "lucide-react";

import TypedText from "@/components/site/TypedText";

/**
 * "Best price guaranteed", under the headline of the homepage and every
 * landing page. One component so the two can never drift apart.
 *
 * A plain line, not a pill: the slogan above it is already green caps and
 * the Google rating below is already a pill, and a third of either made the
 * hero read as cluttered. The words type themselves out once on arrival.
 */
export default function GuaranteeLine({ text }: { text: string }) {
  return (
    <p className="mt-3 flex items-center gap-2 text-base font-bold text-brand-800 sm:text-lg">
      <ShieldCheck
        className="h-5 w-5 shrink-0 text-brand-600 sm:h-6 sm:w-6"
        strokeWidth={2.25}
        aria-hidden="true"
      />
      <TypedText text={text} />
    </p>
  );
}
