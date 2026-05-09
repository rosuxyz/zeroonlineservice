"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: DataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: any) => `$${v}`}
          width={45}
        />
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "12px",
          }}
          formatter={(v: any) => [`$${v}`, "Revenue"]}
          cursor={{ stroke: "rgba(14,165,233,0.2)", strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#0ea5e9"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={{ fill: "#0ea5e9", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, fill: "#0ea5e9", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
