import { CustomLegend, CustomTooltip } from "@/components/ui/TooltipContent";
import { useYearlyReportStore } from "@/store/useYearlyReportStore";
import { formatLargeNumber } from "@/utils/formatNumber";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TooltipProps, LegendProps } from "recharts";

// Custom Tooltip
// const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="border-border bg-card rounded-lg border p-3 shadow-lg">
//         <p className="text-foreground mb-2 text-sm font-medium">
//           {payload[0].payload.category}
//         </p>

//         {payload.map((entry, index) => (
//           <div key={index} className="flex items-center gap-2 text-sm">
//             <div
//               className="h-3 w-3 rounded-sm"
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="text-muted-foreground">{entry.name}:</span>
//             <span className="text-foreground font-medium">
//               {formatLargeNumber(entry.value as number)} تومان
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

export default function YearComparisonChart() {
  const getYearComparison = useYearlyReportStore((s) => s.getYearComparison);
  const camparison = getYearComparison();

  const { current, previous } = camparison;

  const chartData = [
    {
      category: "درآمد",
      "سال جاری": current.income,
      "سال قبل": previous?.income || 0,
    },
    {
      category: "هزینه",
      "سال جاری": current.expense,
      "سال قبل": previous?.expense || 0,
    },
    {
      category: "سود",
      "سال جاری": current.profit,
      "سال قبل": previous?.profit || 0,
    },
  ];

  // Custom Legend

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-border bg-card rounded-xl border p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2>
          مقایسه سال {current.year}
          {previous && ` با ${previous.year}`}
        </h2>
        {!previous && (
          <p className="text-muted-foreground mt-1 text-sm">
            سال قبل برای مقایسه وجود ندارد
          </p>
        )}
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={400} className="mt-4">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="category"
            tick={{ fill: "var(--muted-foreground)", fontSize: 14 }}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--muted)" }}
          />
          <Legend content={<CustomLegend />} />

          <Bar
            dataKey="سال جاری"
            fill="var(--primary)"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          />

          {previous && (
            <Bar
              dataKey="سال قبل"
              fill="var(--destructive)"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
              opacity={0.6}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
