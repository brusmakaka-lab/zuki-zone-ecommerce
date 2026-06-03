export function parseARSInput(value: FormDataEntryValue | number | null | undefined): number {
  if (typeof value === "number") return Number.isInteger(value) && value >= 0 ? value : Number.NaN;
  if (value == null) return Number.NaN;

  const raw = String(value)
    .trim()
    .replace(/\s|\u00a0/g, "")
    .replace(/^\$/, "");

  if (!raw || raw.includes("-") || /[^0-9.,]/.test(raw)) return Number.NaN;
  if (/^\d+$/.test(raw)) return toSafeARSInteger(raw);
  if (/^\d{1,3}([.,]\d{3})+$/.test(raw)) return toSafeARSInteger(raw.replace(/[.,]/g, ""));

  return Number.NaN;
}

export function formatARS(value: number | string | null | undefined): string {
  const amount = typeof value === "string" ? Number(value) : value;
  const safeAmount = Number.isFinite(amount) ? Math.round(Number(amount)) : 0;
  return `$ ${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(safeAmount)}`;
}

export function formatARSInput(value: number | string | null | undefined): string {
  const amount = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(amount) || Number(amount) <= 0) return "";
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(Math.round(Number(amount)));
}

function toSafeARSInteger(value: string) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) return Number.NaN;
  return parsed;
}
