import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export function getTodayJalali(): string {
  const today = new DateObject({
    calendar: persian,
    locale: persian_fa,
  });
  return today.format("YYYY/MM/DD");
}
