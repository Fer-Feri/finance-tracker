import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface PersianDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function PersianDatePicker({ value, onChange }: PersianDatePickerProps) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      value={value}
      format="YYYY/MM/DD"
      onChange={(date) => {
        if (!date) return;
        onChange(date.format());
      }}
      inputClass="w-full rounded-lg mr-2 border border-border bg-background px-3 py-2 text-sm"
    />
  );
}
