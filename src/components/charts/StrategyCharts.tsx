import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  type ScatterShapeProps,
} from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  holdingScatterData,
  hourRegionColors,
  hstData,
  mfeMaeScatterData,
  winLossData,
  type MfeMaePoint,
} from "@/data/chartData";
import { cn } from "@/lib/utils";
import type { View } from "@/types";

type ReportKind = Exclude<View, "overview">;

function SmallScatterDot({ cx, cy, fill }: ScatterShapeProps) {
  if (cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={1.25} fill={fill} fillOpacity={0.7} />;
}

const holdingChartConfig = {
  profit: { label: "Profit", color: "#4caf50" },
} satisfies ChartConfig;

const hstEntriesConfig = {
  entries: { label: "Entries", color: "var(--chart-1)" },
} satisfies ChartConfig;

const hstProfitLossConfig = {
  profit: { label: "Profit", color: "#5b9cf6" },
  loss: { label: "Loss", color: "#e07070" },
} satisfies ChartConfig;

const mfeChartConfig = {
  profit: { label: "Profit", color: "#5b9cf6" },
  mfeTrend: { label: "Trend", color: "#5b9cf6" },
} satisfies ChartConfig;

const maeChartConfig = {
  profit: { label: "Profit", color: "#e07070" },
  maeTrend: { label: "Trend", color: "#e07070" },
} satisfies ChartConfig;

const winLossChartConfig = {
  wins: { label: "Profitable Trades", color: "#75c99a" },
  losses: { label: "Loss Trades", color: "#d96b6b" },
} satisfies ChartConfig;

function regressionLine(points: { x: number; y: number }[]) {
  const count = points.length;
  if (count === 0) return [{ x: 0, y: 0 }, { x: 1, y: 1 }];

  const sumX = points.reduce((total, point) => total + point.x, 0);
  const sumY = points.reduce((total, point) => total + point.y, 0);
  const sumXY = points.reduce((total, point) => total + point.x * point.y, 0);
  const sumXX = points.reduce((total, point) => total + point.x * point.x, 0);
  const slope = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / count;
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));

  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];
}

function moneyTick(value: number) {
  if (Math.abs(value) >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value}`;
}

function countTick(value: number) {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
}

function HstPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border border-border/70 bg-muted/40 p-2", className)}>
      <p className="mb-2 px-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export function HstDistributionChart({ kind }: { kind: ReportKind }) {
  const data = hstData[kind];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <HstPanel title="Entries by hours (Asia, Europe, USA)">
        <ChartContainer config={hstEntriesConfig} className="h-[180px] w-full">
          <BarChart data={data.hours} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={36} tickFormatter={countTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="entries" radius={[2, 2, 0, 0]}>
              {data.hours.map((row) => (
                <Cell key={row.hour} fill={hourRegionColors[row.region]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </HstPanel>

      <HstPanel title="Entries by weekdays">
        <ChartContainer config={hstEntriesConfig} className="h-[180px] w-full">
          <BarChart data={data.weekdays} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={36} tickFormatter={countTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="entries" fill="#4caf50" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </HstPanel>

      <HstPanel title="Entries by months">
        <ChartContainer config={hstEntriesConfig} className="h-[180px] w-full md:col-span-2 xl:col-span-1">
          <BarChart data={data.months} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={36} tickFormatter={countTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="entries" fill="#5b9cf6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </HstPanel>

      <HstPanel title="Profits and losses by hours">
        <ChartContainer config={hstProfitLossConfig} className="h-[180px] w-full">
          <BarChart data={data.hours} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={42} tickFormatter={moneyTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="loss" fill="var(--color-loss)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </HstPanel>

      <HstPanel title="Profits and losses by weekdays">
        <ChartContainer config={hstProfitLossConfig} className="h-[180px] w-full">
          <BarChart data={data.weekdays} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={42} tickFormatter={moneyTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="loss" fill="var(--color-loss)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </HstPanel>

      <HstPanel title="Profits and losses by months">
        <ChartContainer config={hstProfitLossConfig} className="h-[180px] w-full md:col-span-2 xl:col-span-1">
          <BarChart data={data.months} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={42} tickFormatter={moneyTick} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="loss" fill="var(--color-loss)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </HstPanel>
    </div>
  );
}

export function HoldingTimeChart({ kind }: { kind: ReportKind }) {
  const data = holdingScatterData[kind];
  const maxHours = kind === "report2020" ? 120 : 269;
  const maxProfit = kind === "report2020" ? 800 : 6000;

  return (
    <ChartContainer config={holdingChartConfig} className="h-[260px] w-full">
      <ScatterChart accessibilityLayer data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="hours"
          name="Time"
          unit="h"
          domain={[0, maxHours]}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          type="number"
          dataKey="profit"
          name="Profit"
          domain={[-maxProfit, maxProfit]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={48}
          tickFormatter={moneyTick}
        />
        <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
        <Scatter name="Profit" data={data} fill="var(--color-profit)" shape={SmallScatterDot} />
      </ScatterChart>
    </ChartContainer>
  );
}

function MfeMaePanel({
  title,
  xLabel,
  config,
  points,
  xKey,
  xDomain,
  yDomain,
  trendColor,
}: {
  title: string;
  xLabel: string;
  config: ChartConfig;
  points: MfeMaePoint[];
  xKey: "mfe" | "mae";
  xDomain: [number, number];
  yDomain: [number, number];
  trendColor: string;
}) {
  const trend = regressionLine(points.map((point) => ({ x: point[xKey], y: point.profit })));
  const trendData = trend.map((point) => ({ [xKey]: point.x, profit: point.y }));

  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <ChartContainer config={config} className="h-[220px] w-full">
        <ComposedChart accessibilityLayer margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey={xKey}
            name={xLabel}
            domain={xDomain}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            type="number"
            dataKey="profit"
            name="Profit"
            domain={yDomain}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={48}
            tickFormatter={moneyTick}
          />
          <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent />} />
          <Scatter name="Profit" data={points} fill={trendColor} shape={SmallScatterDot} />
          <Line
            data={trendData}
            type="linear"
            dataKey="profit"
            stroke={trendColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}

export function MfeMaeChart({ kind }: { kind: ReportKind }) {
  const points = mfeMaeScatterData[kind];
  const profitRange = kind === "report2020" ? 800 : 6000;
  const mfeRange = kind === "report2020" ? 800 : 6000;
  const maeRange = kind === "report2020" ? -600 : -8000;

  return (
    <div className="grid gap-4">
      <MfeMaePanel
        title="Profit vs MFE"
        xLabel="MFE"
        config={mfeChartConfig}
        points={points}
        xKey="mfe"
        xDomain={[0, mfeRange]}
        yDomain={[-profitRange, profitRange]}
        trendColor="#5b9cf6"
      />
      <MfeMaePanel
        title="Profit vs MAE"
        xLabel="MAE"
        config={maeChartConfig}
        points={points}
        xKey="mae"
        xDomain={[maeRange, 0]}
        yDomain={[-profitRange, profitRange]}
        trendColor="#e07070"
      />
      <p className="text-center text-[10px] text-muted-foreground">
        Profit range ±{profitRange.toLocaleString()} · Correlation preserved from MT5 report
      </p>
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  width,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  width: number;
  note: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", accent ? "bg-[#d7b36e]" : "bg-[#75c99a]")}
          style={{ width: `${Math.min(width, 100)}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs">
        <span className={accent ? "text-[#d7b36e]" : "text-[#75c99a]"}>{value}</span>
        <span className="text-muted-foreground">{note}</span>
      </div>
    </div>
  );
}

export function WinLossBreakdownChart({ kind }: { kind: ReportKind }) {
  const breakdown = winLossData[kind];
  const pieData = [
    { name: "wins", value: breakdown.wins, fill: "var(--color-wins)" },
    { name: "losses", value: breakdown.losses, fill: "var(--color-losses)" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:flex-col">
        <div className="relative mx-auto aspect-square h-[220px] max-w-[220px]">
          <ChartContainer config={winLossChartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={82}
                strokeWidth={4}
                stroke="transparent"
              />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-light text-foreground">{breakdown.winRate}%</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Win Rate</p>
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="mt-1 size-2 rounded-full bg-[#75c99a]" />
            <div>
              <p className="text-muted-foreground">Profitable Trades</p>
              <p className="font-medium text-foreground">
                {breakdown.wins.toLocaleString()} <span className="text-muted-foreground">({breakdown.winRate}%)</span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 size-2 rounded-full bg-[#d96b6b]" />
            <div>
              <p className="text-muted-foreground">Loss Trades</p>
              <p className="font-medium text-foreground">
                {breakdown.losses.toLocaleString()}{" "}
                <span className="text-muted-foreground">({(100 - breakdown.winRate).toFixed(2)}%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <BreakdownBar
          label="Long Trades"
          value={`${breakdown.longWinRate}% won`}
          width={breakdown.longWinRate}
          note={`${breakdown.longTrades.toLocaleString()} trades`}
        />
        <BreakdownBar
          label="Short Trades"
          value={`${breakdown.shortWinRate}% won`}
          width={breakdown.shortWinRate}
          note={`${breakdown.shortTrades.toLocaleString()} trades`}
        />
        <BreakdownBar
          label="Profit Factor"
          value={breakdown.profitFactor.toFixed(2)}
          width={breakdown.profitFactor * 30}
          note="Gross profit / gross loss"
          accent
        />
        <BreakdownBar
          label="LR Correlation"
          value={breakdown.lrCorrelation.toFixed(2)}
          width={breakdown.lrCorrelation * 100}
          note="Linear regression fit"
          accent
        />
      </div>
    </div>
  );
}

export type ChartKind = "hst" | "holding" | "mfeMae";

export function StrategyDetailChart({
  kind,
  chartKind,
}: {
  kind: ReportKind;
  chartKind: ChartKind;
}) {
  if (chartKind === "hst") return <HstDistributionChart kind={kind} />;
  if (chartKind === "holding") return <HoldingTimeChart kind={kind} />;
  return <MfeMaeChart kind={kind} />;
}
