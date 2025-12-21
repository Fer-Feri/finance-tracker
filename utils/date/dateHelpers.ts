import moment from "jalali-moment";

export const getCurrentJalaliYearMonth = () => {
  const now = moment();

  return {
    year: now.jYear(),
    month: now.jMonth() + 1,
  };
};
