// utils/formatNumber.ts
export function formatLargeNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    // میلیارد
    return `${(value / 1_000_000_000).toFixed(1)}بیلیون`;
  } else if (absValue >= 1_000) {
    // هزار - با جداکننده
    return value.toLocaleString("fa-IR");
  }

  return value.toLocaleString("fa-IR");
}
