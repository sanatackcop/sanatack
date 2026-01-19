import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

// Vibrant shared palette (exported for reuse)
export const CHART_COLORS = [
  "#6366f1", // indigo
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f97316", // orange
  "#ec4899", // pink
  "#a855f7", // purple
];

interface ChartData {
  [key: string]: any;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface GenericChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  config: ChartConfig;
  direction?: "ltr" | "rtl";
}

// ============ BAR CHART ============
export const BarChartComponent: React.FC<GenericChartProps> = ({
  title,
  description,
  data,
  config,
}) => {
  const dataKeys = Object.keys(config);

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="w-full max-w-full bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-900/30 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 shadow-sm overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 w-full h-full">
            <ChartContainer config={config} className="w-full h-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#475569" style={{ fontSize: "12px" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {dataKeys.map((key) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={config[key].color}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ LINE CHART ============
export const LineChartComponent: React.FC<GenericChartProps> = ({
  title,
  description,
  data,
  config,
}) => {
  const dataKeys = Object.keys(config);

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="w-full max-w-full bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-900/30 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 shadow-sm overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 w-full h-full">
            <ChartContainer config={config} className="w-full h-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#475569" style={{ fontSize: "12px" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {dataKeys.map((key) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config[key].color}
                      strokeWidth={2}
                      dot={{ fill: config[key].color, r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ PIE CHART ============
interface PieChartProps extends Omit<GenericChartProps, "config"> {
  config?: ChartConfig;
  nameKey?: string;
  valueKey?: string;
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  title,
  description,
  data,
  config,
  valueKey = "value",
}) => {
  const chartConfig = config || {
    value: { label: "Value", color: CHART_COLORS[0] },
  };

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="w-full max-w-full bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-900/30 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 shadow-sm overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0 w-full h-full">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full min-w-0"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="80%"
                    dataKey={valueKey}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}-${entry}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ DONUT CHART ============
export const DonutChartComponent: React.FC<PieChartProps> = ({
  title,
  description,
  data,
  config,
  valueKey = "value",
}) => {
  const chartConfig = config || {
    value: { label: "Value", color: CHART_COLORS[0] },
  };

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="w-full max-w-full bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-900/30 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 shadow-sm overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0 w-full h-full">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full min-w-0"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey={valueKey}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}-${entry}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ AREA CHART ============
export const AreaChartComponent: React.FC<GenericChartProps> = ({
  title,
  description,
  data,
  config,
}) => {
  const dataKeys = Object.keys(config);

  return (
    <div className="w-full max-w-full space-y-4 overflow-hidden">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {description}
          </p>
        )}
      </div>
      <div className="w-full max-w-full bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-900/30 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 shadow-sm overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
          <div className="absolute inset-0 w-full h-full">
            <ChartContainer config={config} className="w-full h-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    {dataKeys.map((key) => (
                      <linearGradient
                        key={`gradient-${key}`}
                        id={`color${key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={config[key].color}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={config[key].color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#475569" style={{ fontSize: "12px" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {dataKeys.map((key) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config[key].color}
                      fill={`url(#color${key})`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
