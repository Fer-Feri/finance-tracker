export const TRANSACTION_CATEGORIES = [
  // 💸 EXPENSE
  { value: "خوراک و نوشیدنی", label: "خوراک و نوشیدنی", fill: "#f97316" },
  { value: "حمل‌ونقل", label: "حمل‌ونقل", fill: "#0ea5e9" },
  { value: "قبوض", label: "قبوض", fill: "#6366f1" },
  { value: "خرید و سوپرمارکت", label: "خرید و سوپرمارکت", fill: "#ec4899" },
  { value: "پوشاک و لوازم", label: "پوشاک و لوازم", fill: "#a855f7" },
  { value: "سرگرمی و تفریح", label: "سرگرمی و تفریح", fill: "#f43f5e" },
  { value: "بهداشت و درمان", label: "بهداشت و درمان", fill: "#22c55e" },
  { value: "آموزش", label: "آموزش", fill: "#14b8a6" },
  { value: "اجاره و مسکن", label: "اجاره و مسکن", fill: "#38bdf8" },
  { value: "ورزش و تناسب", label: "ورزش و تناسب", fill: "#84cc16" },
  { value: "زیبایی و آرایش", label: "زیبایی و آرایش", fill: "#fb7185" },
  { value: "خانواده و بچه", label: "خانواده و بچه", fill: "#eab308" },
  { value: "حیوان خانگی", label: "حیوان خانگی", fill: "#64748b" },
  { value: "هدیه و کمک", label: "هدیه و کمک", fill: "#facc15" },
  { value: "سایر هزینه", label: "سایر هزینه", fill: "#94a3b8" },

  // 💰 INCOME
  { value: "حقوق و دستمزد", label: "حقوق و دستمزد", fill: "#16a34a" },
  { value: "فریلنس و پروژه", label: "فریلنس و پروژه", fill: "#22d3ee" },
  { value: "سرمایه‌گذاری", label: "سرمایه‌گذاری", fill: "#facc15" },
  { value: "فروش", label: "فروش", fill: "#4ade80" },
  { value: "هدیه و قرض", label: "هدیه و قرض", fill: "#c084fc" },
  { value: "سایر درآمد", label: "سایر درآمد", fill: "#86efac" },
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
