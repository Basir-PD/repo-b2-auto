"use client";

/**
 * Phone mark shown beside the number: a solid, high-contrast phone icon
 * with a "24/7" chip badge — reads instantly at a glance, unlike a thin
 * outline ring, which is what this replaced.
 */
export default function PhoneBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="h-full w-full">
        <circle cx="20" cy="20" r="20" className="fill-brand-600" />
        <path
          d="M15.9 13.3c.4-.4 1-.4 1.5-.1l3 2c.5.4.7 1 .5 1.6l-.7 2c-.1.4 0 .8.3 1.1a11 11 0 0 0 4.2 3.1c.4.1.8.1 1.1-.2l1.6-1.5c.4-.4 1.1-.5 1.6-.2l3.2 1.7c.6.3.9 1 .7 1.6-.6 2-2.5 3.3-4.5 3-6.7-1-12-6.5-12.7-13.3-.2-2 1.2-3.8 3.2-4.3Z"
          className="fill-white"
        />
      </svg>
      <span className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-white px-1 py-px text-[8px] font-black leading-none text-brand-600 shadow-sm ring-1 ring-black/5">
        24/7
      </span>
    </span>
  );
}
