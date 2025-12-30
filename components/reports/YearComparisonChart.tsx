// src/components/reports/YearComparisonChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useReportData } from "@/hooks/useReportData";
import { formatLargeNumber } from "@/utils/formatNumber";

interface YearComparisonChartProps {
  currentYear: number;
}

export default function YearComparisonChart({
  currentYear,
}: YearComparisonChartProps) {
  const currentData = useReportData(currentYear);
  const previousData = useReportData(currentYear - 1);

  const chartData = [
    {
      category: "درآمد",
      [currentYear]: currentData.totalIncome,
      [currentYear - 1]: previousData.totalIncome,
    },
    {
      category: "هزینه",
      [currentYear]: currentData.totalExpense,
      [currentYear - 1]: previousData.totalExpense,
    },
    {
      category: "سود",
      [currentYear]: currentData.profit,
      [currentYear - 1]: previousData.profit,
    },
  ];

  return (
    <div className="bg-card rounded-lg border p-6 shadow-md">
      <h3 className="text-card-foreground mb-4 text-lg font-semibold">
        مقایسه با سال قبل
      </h3>

      {previousData.transactionCount > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="category"
              stroke="var(--muted-foreground)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => formatLargeNumber(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => formatLargeNumber(value) + " تومان"}
            />
            <Legend
              wrapperStyle={{ fontSize: "13px" }}
              formatter={(value) => `سال ${value}`}
            />
            <Bar
              dataKey={currentYear}
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey={currentYear - 1}
              fill="hsl(var(--muted-foreground))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">
            اطلاعات سال {currentYear - 1} موجود نیست
          </p>
        </div>
      )}
    </div>
  );
}
