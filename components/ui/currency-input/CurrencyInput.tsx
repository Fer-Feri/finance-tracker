"use client";

interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
}

const normalizeDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

export default function CurrencyInput({
  value,
  onChange,
  placeholder = "مثال: ۱۵۰٬۰۰۰",
}: CurrencyInputProps) {
  return (
    <input
      type="text"
      name="amount"
      inputMode="numeric"
      required
      value={value !== null ? value.toLocaleString("fa-IR") : ""}
      onChange={(e) => {
        const normalized = normalizeDigits(e.target.value);
        const raw = normalized.replace(/[^\d]/g, "");
        onChange(raw ? Number(raw) : null);
      }}
      placeholder={placeholder}
      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm transition-colors focus:ring-2 focus:outline-none"
    />
  );
}
