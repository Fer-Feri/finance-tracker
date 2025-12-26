// src/components/reports/ChartsView.tsx

import ExpenseChart from "./ExpenseChart";
import HeatmapChart from "./HeatmapChart";

export default function ChartsView() {
  return (
    <div className="space-y-8">
      <ExpenseChart />
      <HeatmapChart />
    </div>
  );
}
