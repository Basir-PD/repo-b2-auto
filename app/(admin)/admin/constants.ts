export type Status = "new" | "contacted" | "quoted" | "scheduled" | "won" | "lost";
export type Source = "website" | "phone" | "whatsapp" | "walk_in" | "admin";

/** Pipeline order, first contact through to closed. */
export const STATUSES: Array<{ value: Status; label: string; chip: string }> = [
  { value: "new",       label: "New",       chip: "bg-brand-50 text-brand-700 border-brand-200" },
  { value: "contacted", label: "Contacted", chip: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "quoted",    label: "Quoted",    chip: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "scheduled", label: "Scheduled", chip: "bg-violet-50 text-violet-800 border-violet-200" },
  { value: "won",       label: "Won",       chip: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { value: "lost",      label: "Lost",      chip: "bg-rose-50 text-rose-800 border-rose-200" },
];

export const SOURCES: Array<{ value: Source; label: string }> = [
  { value: "website",  label: "Website form" },
  { value: "phone",    label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "walk_in",  label: "Walk-in" },
  { value: "admin",    label: "Added by admin" },
];

export const statusMeta = (status: string) =>
  STATUSES.find((s) => s.value === status) ?? STATUSES[0];

export const sourceLabel = (source: string) =>
  SOURCES.find((s) => s.value === source)?.label ?? source;
