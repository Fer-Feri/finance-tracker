"use client";

import { formatCurrency } from "@/lib/formatCurrency";

// ✅ تعریف Interface سفارشی برای Payload
interface CustomPayload {
  dataKey?: string | number;
  name?: string;
  value?: number;
  color?: string;
}

// ✅ تعریف Props کامل
interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomPayload[];
  label?: string;
}

interface CustomLegendItem {
  value?: string;
  color?: string;
}

interface CustomLegendProps {
  payload?: CustomLegendItem[];
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="border-border bg-card rounded-xl border p-3 shadow-lg backdrop-blur-sm">
        <p className="text-foreground mb-2 text-base font-semibold">{label}</p>
        <div className="space-y-2">
          {payload.map((pld, index) => (
            <div
              key={pld.dataKey || index}
              className="flex items-center justify-between gap-x-4"
            >
              <div className="flex items-center gap-x-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: pld.color }}
                />
                <p className="text-muted-foreground text-sm">{pld.name}:</p>
              </div>
              <p className="text-foreground text-sm font-medium">
                {formatCurrency(pld.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
