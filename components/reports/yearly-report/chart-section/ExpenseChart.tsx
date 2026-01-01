// src/components/reports/ChartsView.tsx
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useExpenseCharts } from "@/hooks/useExpenseCharts";
import { formatLargeNumber } from "@/utils/formatNumber";

// 📝 تعریف Type برای داده‌های نمودار
interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  percentage: number;
}

// 📝 تعریف Type برای Props Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}

export default function ExpenseChart({ year }: { year: number }) {
  const { expenseData, incomeData, isLoading } = useExpenseCharts(year);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <p className="text-muted-foreground text-center">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* عنوان */}
      <h2 className="text-muted-foreground text-xl font-bold">نمودارها</h2>

      {/* نمودار هزینه‌ها */}
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-card-foreground mb-4 text-lg font-semibold">
          هزینه‌ها به تفکیک دسته
        </h3>

        {expenseData.length > 0 ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* نمودار */}
            <div className="h-[300px] w-full lg:h-[400px] lg:w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="80%"
                  data={expenseData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    label={{
                      position: "insideStart",
                      fill: "var(--primary)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    background={{ fill: "var(--muted)" }}
                    dataKey="value"
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend جداگانه */}
            <div className="w-full lg:w-1/3">
              <CustomLegend data={expenseData} />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center">
            هیچ هزینه‌ای ثبت نشده است
          </p>
        )}
      </div>

      {/* نمودار درآمدها */}
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-card-foreground mb-4 text-lg font-semibold">
          درآمدها به تفکیک دسته
        </h3>

        {incomeData.length > 0 ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* نمودار */}
            <div className="h-[300px] w-full lg:h-[400px] lg:w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="80%"
                  data={incomeData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    label={{
                      position: "insideStart",
                      fill: "var(--primary)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    background={{ fill: "var(--muted)" }}
                    dataKey="value"
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend جداگانه */}
            <div className="w-full lg:w-1/3">
              <CustomLegend data={incomeData} />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center">
            هیچ درآمدی ثبت نشده است
          </p>
        )}
      </div>
    </div>
  );
}

// کامپوننت Custom Legend (دستی)
function CustomLegend({ data }: { data: ChartDataItem[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div
          key={`legend-${index}`}
          className="bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-md p-2 transition-colors"
        >
          <span
            className="h-4 w-4 shrink-0 rounded-full shadow-sm"
            style={{ backgroundColor: item.fill }}
          />
          <div className="flex-1">
            <p className="text-card-foreground text-sm font-medium">
              {item.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatLargeNumber(item.value)} ({item.percentage}%)
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// کامپوننت Custom Tooltip با Type مشخص
function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="border-border bg-popover rounded-lg border p-3 shadow-lg">
      <p className="text-popover-foreground font-semibold">{data.name}</p>
      <p className="text-muted-foreground text-sm">
        مبلغ: {formatLargeNumber(data.value)}
      </p>
      <p className="text-muted-foreground text-sm">درصد: {data.percentage}%</p>
    </div>
  );
}
