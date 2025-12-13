import { useState } from "react";

export function useJalaliDate(initialDate = "") {
  const [date, setDate] = useState<string>(initialDate);

  return {
    date,
    setDate,
  };
}
