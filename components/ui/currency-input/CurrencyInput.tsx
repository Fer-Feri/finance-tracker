interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

const normalizeDigits = (str: string): string =>
  str.replace(/[۰-۹٠-٩]/g, (char) => {
    const persianIndex = persianDigits.indexOf(char);
    if (persianIndex !== -1) return String(persianIndex);

    const arabicIndex = arabicDigits.indexOf(char);
    if (arabicIndex !== -1) return String(arabicIndex);

    return char;
  });

export function CurrencyInput({
  value,
  onChange,
  placeholder = "مبلغ را وارد کنید",
}: CurrencyInputProps) {
  const formatNumber = (num: number): string => {
    if (num === 0) return "";
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const parseNumber = (str: string): number => {
    const normalized = normalizeDigits(str);
    const cleaned = normalized.replace(/[^\d]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      onChange(0);
      return;
    }

    const numericValue = parseNumber(inputValue);
    onChange(numericValue);
  };

  return (
    <input
      type="text"
      value={formatNumber(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className="border-border bg-background focus:border-primary focus:ring-primary mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
      dir="rtl"
      inputMode="numeric"
      required
    />
  );
}
