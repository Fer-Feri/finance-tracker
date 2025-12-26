const TRANSACTION_CATEGORIES = [
  // 💸 EXPENSE
  { value: "food", label: "خوراک و نوشیدنی", fill: "#f97316" }, // orange
  { value: "transport", label: "حمل و نقل", fill: "#0ea5e9" }, // sky
  { value: "shopping", label: "خرید و پوشاک", fill: "#ec4899" }, // pink
  { value: "bills", label: "قبض", fill: "#6366f1" }, // indigo
  { value: "health", label: "بهداشت و درمان", fill: "#22c55e" }, // green
  { value: "entertainment", label: "سرگرمی", fill: "#a855f7" }, // purple
  { value: "education", label: "آموزش", fill: "#14b8a6" }, // teal
  { value: "home", label: "خانه و اجاره", fill: "#f43f5e" }, // rose
  { value: "insurance", label: "بیمه", fill: "#64748b" }, // slate
  { value: "gifts", label: "هدیه و کمک", fill: "#eab308" }, // yellow
  { value: "expenseOther", label: "سایر هزینه‌ها", fill: "#94a3b8" }, // gray

  // 💰 INCOME
  { value: "salary", label: "حقوق و دستمزد", fill: "#16a34a" }, // dark green
  { value: "freelance", label: "پروژه و فریلنس", fill: "#22d3ee" }, // cyan
  { value: "business", label: "کسب و کار", fill: "#4ade80" }, // light green
  { value: "investment", label: "سرمایه‌گذاری", fill: "#facc15" }, // gold
  { value: "rental", label: "اجاره و رهن", fill: "#38bdf8" }, // blue
  { value: "bonus", label: "پاداش و عیدی", fill: "#fb7185" }, // coral
  { value: "giftReceived", label: "هدیه دریافتی", fill: "#c084fc" }, // violet
  { value: "incomeOther", label: "سایر درآمدها", fill: "#86efac" }, // mint
];

export function getCategoryLabel(categoryName: string) {
  const category = TRANSACTION_CATEGORIES.find(
    (category) => category.value === categoryName,
  );
  return category ? category.label : "نامشخص";
}
export function getCategoryFill(categoryName: string) {
  const category = TRANSACTION_CATEGORIES.find(
    (category) => category.value === categoryName,
  );
  return category ? category.fill : "#312345";
}
