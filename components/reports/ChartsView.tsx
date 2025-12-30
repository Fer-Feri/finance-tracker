// src/components/reports/ChartsView.tsx
// import ExpenseChart from "./ExpenseChart";
// import HeatmapChart from "./HeatmapChart";
import YearComparisonChart from "./YearComparisonChart";
import ExpenseChart from "./yearly-report/chart-section/ExpenseChart";
import HeatmapChart from "./yearly-report/chart-section/HeatmapChart";

interface ChartsViewProps {
  year: number;
}

export default function ChartsView({ year }: ChartsViewProps) {
  return (
    <div className="space-y-8">
      {/* عنوان */}
      <div>
        <h2 className="text-muted-foreground text-xl font-bold">
          نمودارها و تحلیل‌ها
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          بررسی دقیق‌تر روند مالی و دسته‌بندی‌ها برای سال {year}
        </p>
      </div>

      {/* نمودار مقایسه سال‌ها */}
      <YearComparisonChart currentYear={year} />

      {/* نمودارهای دسته‌بندی (درآمد و هزینه) */}
      <ExpenseChart />

      {/* نقشه حرارتی */}
      <HeatmapChart />
    </div>
  );
}
