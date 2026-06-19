import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Mail,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "./components/ui/chart";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./components/ui/chart";
import {
  StrategyDetailChart,
  WinLossBreakdownChart,
  type ChartKind,
} from "@/components/charts/StrategyCharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AnimatePresence,
  Collapse,
  FadeIn,
  FadeInOnMount,
  motion,
  PageTransition,
  PresenceFade,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { View } from "@/types";
import "./index.css";

const gold = "text-[#d7b36e]";
const green = "text-[#75c99a]";

const heroStats = [
  ["2,148%", "23-Year Total Return", gold],
  ["19.0%", "Annual Return (2020-26)", green],
  ["69.3%", "Win Rate", green],
  ["2.26", "Sharpe Ratio", "text-foreground"],
];

const shortMetrics = [
  ["+185%", "Total Return", green],
  ["19.0%", "CAGR", green],
  ["2.26", "Sharpe Ratio", gold],
  ["9.47", "Recovery Factor", gold],
  ["68.4%", "Win Rate", green],
  ["5.98%", "Max Drawdown", "text-foreground"],
  ["1.46", "Profit Factor", "text-foreground"],
  ["6,636", "Total Trades", "text-foreground"],
];

const periodPanels = {
  report2020: {
    period: "EURUSD / Jan 2020 - Jun 2026",
    capital: "$10,000 -> $28,543",
    metrics: [
      ["+185%", "Total Return", green],
      ["19.0%", "CAGR", green],
      ["2.26", "Sharpe Ratio", gold],
      ["68.4%", "Win Rate", green],
      ["5.98%", "Max Drawdown", "text-foreground"],
      ["9.47", "Recovery Factor", gold],
    ],
  },
  reportLong: {
    period: "EURUSD / Mar 2003 - Jun 2026",
    capital: "$10,000 -> $224,811",
    metrics: [
      ["+2,148%", "Total Return", gold],
      ["~14.2%", "Est. CAGR", green],
      ["1.01", "Sharpe Ratio", gold],
      ["69.3%", "Win Rate", green],
      ["27.34%", "Max Drawdown", "text-foreground"],
      ["9.61", "Recovery Factor", gold],
    ],
  },
};

const benchmarks = [
  {
    name: "Type-M",
    sub: "EURUSD / Backtest",
    return: "+2,148%",
    end: "$224,811",
    cagr: "~14.2%",
    sharpe: "1.01",
    drawdown: "27.34%",
    featured: true,
  },
  {
    name: "S&P 500",
    sub: "SPX / Total Return",
    return: "+1,231%",
    end: "~$133,000",
    cagr: "~11.7%",
    sharpe: "~0.7",
    drawdown: "~57%",
  },
  {
    name: "Dow Jones",
    sub: "DJIA / Price Return",
    return: "+518%",
    end: "~$62,000",
    cagr: "~8.1%",
    sharpe: "~0.5",
    drawdown: "~54%",
  },
];

const reportData = {
  report2020: {
    eyebrow: "Verified Backtest / MT5 Strategy Tester / 99.9% Modelling Quality",
    title: "Type-M",
    subtitle: "2020 - 2026 Performance Report",
    detail: "EURUSD / January 2020 - June 2026 / Initial Deposit $10,000",
    stats: [
      ["19.0%", "Compounded Annual Return", "Per year, 6.4 year period"],
      ["2.26", "Sharpe Ratio", "Risk-adjusted performance"],
      ["68.4%", "Win Rate", "4,542 of 6,636 trades"],
      ["5.98%", "Max Equity Drawdown", "Peak-to-trough"],
      ["185%", "Total Net Return", "$10,000 -> $28,543"],
      ["9.47", "Recovery Factor", "Net profit / max drawdown"],
      ["3.18", "Calmar Ratio", "CAGR / max drawdown"],
    ],
    otherCharts: [
      ["Entries & P&L by Hour / Weekday / Month", "hst", "wide"],
      ["MFE / MAE Analysis", "mfeMae", "normal"],
      ["Position Holding Time", "holding", "normal"],
    ],
    groups: [
      ["Returns", [["Total Net Profit", "$18,543.39"], ["Gross Profit", "$58,591.07"], ["Gross Loss", "-$40,047.68"], ["Average Monthly Return", "1.46%"], ["Compounded Yearly", "19.0%"], ["Expected Payoff", "$2.79"]]],
      ["Risk", [["Balance DD Maximal", "$993.02 (3.38%)"], ["Equity DD Maximal", "$1,959.05 (5.98%)"], ["Balance DD Relative", "6.54%"], ["Equity DD Relative", "8.97%"], ["Average Drawdown", "0.27%"], ["Margin Level", "432.77%"]]],
      ["Quality", [["Profit Factor", "1.46"], ["Sharpe Ratio", "2.26"], ["Recovery Factor", "9.47"], ["Calmar Ratio", "3.18"], ["LR Correlation", "0.98"], ["Z-Score", "7.16 (99.74%)"]]],
      ["Trades", [["Total Trades", "6,636"], ["Short Trades Won", "67.43%"], ["Long Trades Won", "69.36%"], ["Largest Profit Trade", "$195.89"], ["Average Consecutive Wins", "4"], ["Average Consecutive Losses", "2"]]],
    ],
  },
  reportLong: {
    eyebrow: "Verified Backtest / MT5 Strategy Tester / 99.9% Modelling Quality",
    title: "Type-M",
    subtitle: "2003 - 2026 Performance Report",
    detail: "EURUSD / March 2003 - June 2026 / Initial Deposit $10,000",
    stats: [
      ["2,148%", "Total Net Return", "$10,000 -> $224,811"],
      ["14.2%", "Est. CAGR", "Compounded annual"],
      ["1.01", "Sharpe Ratio", "Risk-adjusted return"],
      ["69.3%", "Win Rate", "22,919 of 33,073 trades"],
      ["27.34%", "Max Equity Drawdown", "Peak-to-trough / Aug 2016"],
      ["9.61", "Recovery Factor", "Net profit / max DD"],
      ["0.56", "Calmar Ratio", "CAGR / max drawdown"],
    ],
    otherCharts: [
      ["Entries & P&L by Hour / Weekday / Month", "hst", "wide"],
      ["MFE / MAE Analysis", "mfeMae", "normal"],
      ["Position Holding Time", "holding", "normal"],
    ],
    groups: [
      ["Returns", [["Total Net Profit", "$214,811.02"], ["Gross Profit", "$902,413.78"], ["Gross Loss", "-$687,602.76"], ["Estimated CAGR", "~14.2%"], ["Expected Payoff", "$6.50"], ["Ending Balance", "$224,811"]]],
      ["Risk", [["Equity DD Maximal", "27.34%"], ["Largest Drawdown Period", "Aug 2016"], ["Recovery Factor", "9.61"], ["Profit Factor", "1.31"], ["Calmar Ratio", "0.56"], ["Modelling Quality", "99.9%"]]],
      ["Quality", [["Sharpe Ratio", "1.01"], ["Win Rate", "69.3%"], ["Total Trades", "33,073"], ["LR Correlation", "0.93"], ["Market Regimes", "2003-2026"], ["Instrument", "EURUSD"]]],
      ["Benchmark", [["Type-M Ending Value", "$224,811"], ["S&P 500 Ending Value", "~$133,000"], ["Dow Ending Value", "~$62,000"], ["Type-M Total Return", "+2,148%"], ["S&P 500 Total Return", "+1,231%"], ["Dow Total Return", "+518%"]]],
    ],
  },
} satisfies Record<Exclude<View, "overview">, ReportData>;

type ReportData = {
  eyebrow: string;
  title: string;
  subtitle: string;
  detail: string;
  stats: [string, string, string][];
  otherCharts: [string, ChartKind, "wide" | "normal"][];
  groups: [string, [string, string][]][];
};

const balanceData = {
  report2020: [
    { period: "2020", balance: 10000, equity: 10000 },
    { period: "2021", balance: 12280, equity: 11870 },
    { period: "2022", balance: 15040, equity: 14510 },
    { period: "2023", balance: 18120, equity: 17680 },
    { period: "2024", balance: 21890, equity: 21160 },
    { period: "2025", balance: 25580, equity: 24920 },
    { period: "2026", balance: 28543, equity: 27980 },
  ],
  reportLong: [
    { period: "2003", balance: 10000, equity: 10000 },
    { period: "2006", balance: 16400, equity: 15300 },
    { period: "2009", balance: 27800, equity: 24900 },
    { period: "2012", balance: 47200, equity: 43100 },
    { period: "2015", balance: 73500, equity: 68200 },
    { period: "2018", balance: 104800, equity: 97400 },
    { period: "2021", balance: 145900, equity: 137600 },
    { period: "2024", balance: 194700, equity: 184200 },
    { period: "2026", balance: 224811, equity: 216400 },
  ],
} satisfies Record<Exclude<View, "overview">, { period: string; balance: number; equity: number }[]>;

const benchmarkGrowthData = [
  { year: "2003", typeM: 10000, sp500: 10000, dow: 10000 },
  { year: "2006", typeM: 16400, sp500: 13700, dow: 12400 },
  { year: "2009", typeM: 27800, sp500: 10400, dow: 9400 },
  { year: "2012", typeM: 47200, sp500: 16500, dow: 14300 },
  { year: "2015", typeM: 73500, sp500: 26100, dow: 18100 },
  { year: "2018", typeM: 104800, sp500: 32800, dow: 22600 },
  { year: "2021", typeM: 145900, sp500: 64100, dow: 33700 },
  { year: "2024", typeM: 194700, sp500: 101500, dow: 47400 },
  { year: "2026", typeM: 224811, sp500: 133000, dow: 62000 },
];

const balanceChartConfig = {
  balance: { label: "Balance", color: "var(--chart-1)" },
  equity: { label: "Equity", color: "var(--chart-2)" },
} satisfies ChartConfig;

const benchmarkChartConfig = {
  typeM: { label: "Type-M", color: "var(--chart-1)" },
  sp500: { label: "S&P 500", color: "var(--chart-3)" },
  dow: { label: "Dow Jones", color: "var(--chart-5)" },
} satisfies ChartConfig;

const moneyTick = (value: number) => `$${Math.round(value / 1000)}k`;

export function App() {
  const [view, setView] = useState<View>("overview");
  const [activePeriod, setActivePeriod] = useState<"report2020" | "reportLong">("report2020");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const goTo = (next: View, hash?: string) => {
    setView(next);
    setMenuOpen(false);
    window.setTimeout(() => {
      if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav view={view} menuOpen={menuOpen} setMenuOpen={setMenuOpen} goTo={goTo} />
      <AnimatePresence mode="wait">
        {view === "overview" ? (
          <PageTransition key="overview">
            <Overview
              activePeriod={activePeriod}
              setActivePeriod={setActivePeriod}
              sent={sent}
              setSent={setSent}
              goTo={goTo}
            />
          </PageTransition>
        ) : (
          <PageTransition key={view}>
            <ReportView report={reportData[view]} kind={view} goTo={goTo} />
          </PageTransition>
        )}
      </AnimatePresence>
      <Footer goTo={goTo} />
    </div>
  );
}

function Nav({
  view,
  menuOpen,
  setMenuOpen,
  goTo,
}: {
  view: View;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  goTo: (view: View, hash?: string) => void;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...easeOut, duration: 0.7 }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button className="group text-left" onClick={() => goTo("overview")} aria-label="Zenyte Technologies home">
          <span className="block text-sm font-semibold tracking-[0.18em] text-foreground">ZENYTE</span>
          <span className="block text-[10px] uppercase tracking-[0.34em] text-muted-foreground">Technologies</span>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          <button className={navClass(view === "overview")} onClick={() => goTo("overview", "#typem")}>
            Type-M
          </button>
            <div className="group relative">
            <button className={cn(navClass(view !== "overview"), "gap-1")}>
              Performance <ChevronDown className="size-3" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl transition-transform duration-200 group-hover:translate-y-0 translate-y-1">
                <button className="nav-menu-item" onClick={() => goTo("report2020")}>2020-2026 Report</button>
                <button className="nav-menu-item" onClick={() => goTo("reportLong")}>2003-2026 + Benchmarks</button>
              </div>
            </div>
          </div>
          <button className={navClass(false)} onClick={() => goTo("overview", "#about")}>About</button>
          <ThemeToggle />
          <Button className="ml-2 bg-[#d7b36e] text-zinc-950 hover:bg-[#e6c47f]" onClick={() => goTo("overview", "#contact")}>
            Request Access
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <Collapse open={menuOpen} className="overflow-hidden border-t border-border bg-card md:hidden">
        <div className="px-5 py-4">
          <Stagger onMount className="flex flex-col gap-2">
            <StaggerItem><button className="mobile-link w-full" onClick={() => goTo("overview", "#typem")}>Type-M</button></StaggerItem>
            <StaggerItem><button className="mobile-link w-full" onClick={() => goTo("report2020")}>2020-2026 Report</button></StaggerItem>
            <StaggerItem><button className="mobile-link w-full" onClick={() => goTo("reportLong")}>2003-2026 + Benchmarks</button></StaggerItem>
            <StaggerItem><button className="mobile-link w-full" onClick={() => goTo("overview", "#about")}>About</button></StaggerItem>
            <StaggerItem>
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>
            </StaggerItem>
            <StaggerItem>
              <Button className="mt-2 bg-[#d7b36e] text-zinc-950 hover:bg-[#e6c47f]" onClick={() => goTo("overview", "#contact")}>
                Request Access
              </Button>
            </StaggerItem>
          </Stagger>
        </div>
      </Collapse>
    </motion.header>
  );
}

function navClass(active: boolean) {
  return cn(
    "inline-flex items-center rounded-md px-3 py-2 text-sm transition",
    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
  );
}

function Overview({
  activePeriod,
  setActivePeriod,
  sent,
  setSent,
  goTo,
}: {
  activePeriod: "report2020" | "reportLong";
  setActivePeriod: (period: "report2020" | "reportLong") => void;
  sent: boolean;
  setSent: (sent: boolean) => void;
  goTo: (view: View, hash?: string) => void;
}) {
  const panel = periodPanels[activePeriod];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div className="market-grid" />
        <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <FadeInOnMount className="relative z-10" delay={0.05}>
            <p className="eyebrow">Quantitative FX Trading System</p>
            <h1 className="max-w-3xl text-5xl font-light leading-[1.04] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Type-M.
              <span className="block text-muted-foreground">Verified performance across two decades.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">
              An institutional-grade automated trading system for EURUSD, backtested over 23 years at 99.9%
              modelling quality with independently reviewable results.
            </p>
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeOut, delay: 0.35 }}
            >
              <Button className="h-11 bg-[#d7b36e] px-6 text-zinc-950 hover:bg-[#e6c47f]" onClick={() => goTo("overview", "#contact")}>
                Request Access <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" className="h-11 border-border bg-background/40 px-6" onClick={() => goTo("reportLong")}>
                View Reports
              </Button>
            </motion.div>
          </FadeInOnMount>

          <Stagger onMount className="relative z-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-2xl">
            {heroStats.map(([value, label, color]) => (
              <StaggerItem key={label} className="bg-card/95 p-6 sm:p-8">
                <p className={cn("text-3xl font-light tracking-normal", color)}>{value}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="typem" className="section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <FadeIn>
              <p className="eyebrow">The System</p>
              <h2 className="section-title">Type-M</h2>
              <div className="mt-6 flex max-w-2xl flex-col gap-5 text-muted-foreground">
                <p>
                  A fully automated quantitative trading system for EURUSD. Type-M identifies high-probability entries
                  using a proprietary multi-factor model, manages risk with dynamic lot sizing, and exits with a
                  disciplined partial-close structure.
                </p>
                <p>
                  The strategy spans the dot-com crash, the 2008 financial crisis, the COVID shock, and the 2022 rate
                  cycle while maintaining a compounding profile.
                </p>
              </div>
              <Stagger className="mt-7 flex flex-wrap gap-2">
                {["EURUSD", "23-Year Backtest", "99.9% Modelling Quality"].map((tag) => (
                  <StaggerItem key={tag}>
                    <span className="rounded-md border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="rounded-lg border-border bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                  <BarChart3 className="size-4 text-[#d7b36e]" /> 2020-2026 Backtest Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Stagger className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
                  {shortMetrics.map(([value, label, color]) => (
                    <StaggerItem key={label} className="bg-background p-5">
                      <p className={cn("text-2xl font-light", color)}>{value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </CardContent>
              </Card>
            </FadeIn>
          </div>

          <Stagger className="mt-12 grid gap-3 md:grid-cols-3">
            <StaggerItem><QuickNav title="2020 - Today Performance" sub="6-year backtest / +185% return" onClick={() => goTo("report2020")} /></StaggerItem>
            <StaggerItem><QuickNav title="Full Historic Performance" sub="23-year backtest / +2,148% return" onClick={() => goTo("reportLong")} /></StaggerItem>
            <StaggerItem><QuickNav title="Type-M vs Index Funds" sub="S&P 500 and Dow Jones comparison" onClick={() => goTo("reportLong")} /></StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="section bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead eyebrow="Benchmark Comparison / 2003 - 2026" title="Type-M vs. index funds" sub="$10,000 invested at the start of 2003. S&P 500 total return with dividends reinvested; Dow Jones price return." />
          <Stagger className="mt-10 grid gap-4 lg:grid-cols-3">
            {benchmarks.map((item) => (
              <StaggerItem key={item.name}>
              <Card className={cn("rounded-lg border-border bg-card", item.featured && "border-[#d7b36e]/60 bg-[#d7b36e]/8")}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl">
                    {item.name}
                    {item.featured && <ShieldCheck className="size-5 text-[#d7b36e]" />}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{item.sub}</p>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-4xl font-light", item.featured ? gold : "text-foreground")}>{item.return}</p>
                  <p className="mt-3 text-sm text-muted-foreground">$10,000 -> <span className="text-foreground">{item.end}</span></p>
                  <div className="mt-6 grid gap-3 text-sm">
                    <MetricRow label="CAGR" value={item.cagr} />
                    <MetricRow label="Sharpe" value={item.sharpe} />
                    <MetricRow label="Max DD" value={item.drawdown} />
                  </div>
                </CardContent>
              </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="performance" className="section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead eyebrow="Backtested Results" title="Performance by period" sub="Select a backtest window to review key metrics, equity curves, and report detail." />
          <FadeIn delay={0.08}>
          <div className="mt-9 flex w-full max-w-md rounded-lg border border-border bg-secondary p-1">
            <button className={tabClass(activePeriod === "report2020")} onClick={() => setActivePeriod("report2020")}>2020-2026</button>
            <button className={tabClass(activePeriod === "reportLong")} onClick={() => setActivePeriod("reportLong")}>2003-2026</button>
          </div>
          </FadeIn>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePeriod}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={easeOut}
            >
          <Card className="mt-5 overflow-hidden rounded-lg border-border bg-card">
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="p-6 sm:p-8">
                  <p className="text-sm text-muted-foreground">{panel.period}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">99.9% modelling quality / $10,000 initial deposit</p>
                  <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
                    {panel.metrics.map(([value, label, color]) => (
                      <div key={label} className="bg-background p-4">
                        <p className={cn("text-2xl font-light", color)}>{value}</p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-7 bg-[#d7b36e] text-zinc-950 hover:bg-[#e6c47f]" onClick={() => goTo(activePeriod)}>
                    Full Report <ArrowRight className="size-4" />
                  </Button>
                </div>
                <div className="border-t border-border bg-muted/40 p-4 lg:border-l lg:border-t-0">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Balance curve / {panel.capital}</p>
                  <ChartFrame>
                    <BalanceCurveChart kind={activePeriod} compact />
                  </ChartFrame>
                </div>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="about" className="section bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
          <FadeIn>
          <div>
            <p className="eyebrow">About</p>
            <h2 className="section-title">Built by practitioners, for practitioners.</h2>
            <Button className="mt-8 bg-[#d7b36e] text-zinc-950 hover:bg-[#e6c47f]" onClick={() => goTo("overview", "#contact")}>
              Work With Us
            </Button>
          </div>
          </FadeIn>
          <FadeIn delay={0.1}>
          <div className="flex flex-col gap-6 text-muted-foreground">
            <p>Zenyte Technologies was founded on the premise that institutional-grade investment technology should not be the exclusive domain of the largest banks and hedge funds.</p>
            <p>Our team combines buy-side experience with deep expertise in distributed systems, quantitative research, and high-performance engineering.</p>
            <Stagger className="grid gap-4 md:grid-cols-3">
              {[
                ["01", "Research-first", "Every strategy begins with a testable hypothesis and years of validation."],
                ["02", "Live before launch", "We paper-trade, then live-trade with proprietary capital before deployment."],
                ["03", "Full transparency", "Clients receive performance attribution, drawdown analysis, and trade logs."],
              ].map(([num, title, copy]) => (
                <StaggerItem key={num}>
                <Card className="rounded-lg border-border bg-card">
                  <CardContent className="p-5">
                    <p className="text-xs text-[#d7b36e]">{num}</p>
                    <p className="mt-4 font-medium text-foreground">{title}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </CardContent>
                </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          </FadeIn>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="section-title">Ready to talk?</h2>
            <p className="mt-5 max-w-md text-muted-foreground">Tell us about your mandate. We will respond within one business day.</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="size-4 text-[#d7b36e]" />
              info@zenytetech.com
            </div>
          </div>
          </FadeIn>
          <FadeIn delay={0.12}>
          <Card className="rounded-lg border-border bg-card">
            <CardContent className="p-6 sm:p-8">
              <PresenceFade show={sent}>
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={easeOut}>
                    <CheckCircle2 className="size-10 text-[#75c99a]" />
                  </motion.div>
                  <p className="mt-4 text-xl text-foreground">Message received.</p>
                  <p className="mt-2 text-sm text-muted-foreground">We will be in touch shortly.</p>
                </div>
              </PresenceFade>
              {!sent && (
                <motion.form
                  className="grid gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={(event) => { event.preventDefault(); setSent(true); }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="fname" label="First Name" required />
                    <Field id="lname" label="Last Name" required />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="email" label="Email" type="email" required />
                    <Field id="firm" label="Firm" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={5} placeholder="Describe your strategy and what you're trying to solve..." className="border-border bg-background" />
                  </div>
                  <Button className="w-fit bg-[#d7b36e] text-zinc-950 hover:bg-[#e6c47f]">Send Message</Button>
                </motion.form>
              )}
            </CardContent>
          </Card>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

function ReportView({ report, kind, goTo }: { report: ReportData; kind: Exclude<View, "overview">; goTo: (view: View, hash?: string) => void }) {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-secondary/20">
        <div className="market-grid opacity-40" />
        <FadeInOnMount className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="eyebrow">{report.eyebrow}</p>
          <h1 className="text-5xl font-light leading-tight tracking-normal sm:text-6xl">
            {report.title}
            <span className="block text-muted-foreground">{report.subtitle}</span>
          </h1>
          <p className="mt-5 text-muted-foreground">{report.detail}</p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...easeOut, delay: 0.3 }}
          >
            <Button variant="outline" className="border-border bg-background/40" onClick={() => goTo("overview")}>
              <ArrowLeft className="size-4" /> Back to Overview
            </Button>
            <Button className="bg-[#d7b36e] text-zinc-950 hover:bg-[#e6c47f]" onClick={() => goTo(kind === "report2020" ? "reportLong" : "report2020")}>
              {kind === "report2020" ? "View 2003-2026 Report" : "View 2020-2026 Report"} <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </FadeInOnMount>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Stagger className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4 lg:grid-cols-7">
            {report.stats.map(([value, label, note], index) => (
              <StaggerItem key={label} className={cn("bg-card p-5", index === 0 || index === 6 ? "bg-[#d7b36e]/8" : "")}>
                <p className={cn("text-2xl font-light", index === 0 || index === 6 ? gold : "text-foreground")}>{value}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
                <p className="mt-2 text-xs text-muted-foreground">{note}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {kind === "reportLong" && <BenchmarkSection />}

      <section className="section bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <FadeIn>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Equity Curve</p>
              <h2 className="section-title">Balance Growth</h2>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span className="size-2 rounded-full bg-[#75c99a]" /> Net balance
            </div>
          </div>
          </FadeIn>
          <FadeIn delay={0.1}>
          <ChartFrame className="shadow-2xl">
            <BalanceCurveChart kind={kind} />
          </ChartFrame>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead eyebrow="Full Results" title="Strategy metrics" sub="Core report statistics from the MT5 Strategy Tester backtest." />
          <Stagger className="mt-9 grid gap-4 lg:grid-cols-4">
            {report.groups.map(([title, rows]) => (
              <StaggerItem key={title}>
              <Card className="rounded-lg border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {rows.map(([label, value]) => (
                    <MetricRow key={label} label={label} value={value} />
                  ))}
                </CardContent>
              </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead
            eyebrow="Trade Breakdown"
            title="Win / Loss Distribution"
            sub="Trade outcome mix, directional win rates, and quality metrics from the MT5 report."
          />
          <FadeIn delay={0.1}>
          <Card className="mt-9 overflow-hidden rounded-lg border-border bg-card">
            <CardContent className="p-6 sm:p-8">
              <WinLossBreakdownChart kind={kind} />
            </CardContent>
          </Card>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead
            eyebrow="Detailed Analysis"
            title="Trade distribution charts"
            sub="Hour, weekday, and month activity plus MFE/MAE and holding-time profiles."
          />
          <Stagger className="mt-9 grid gap-4">
            {report.otherCharts
              .filter(([, , layout]) => layout === "wide")
              .map(([title, chartKind]) => (
                <StaggerItem key={title}>
                <Card className="overflow-hidden rounded-lg border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartFrame className="p-4">
                      <StrategyDetailChart kind={kind} chartKind={chartKind} />
                    </ChartFrame>
                  </CardContent>
                </Card>
                </StaggerItem>
              ))}
            <div className="grid gap-4 lg:grid-cols-2">
              {report.otherCharts
                .filter(([, , layout]) => layout === "normal")
                .map(([title, chartKind]) => (
                  <StaggerItem key={title}>
                  <Card className="overflow-hidden rounded-lg border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-base">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartFrame>
                        <StrategyDetailChart kind={kind} chartKind={chartKind} />
                      </ChartFrame>
                    </CardContent>
                  </Card>
                  </StaggerItem>
                ))}
            </div>
          </Stagger>
        </div>
      </section>
    </main>
  );
}

function BenchmarkSection() {
  return (
    <section className="section bg-secondary/30">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead eyebrow="Benchmark Comparison / 2003 - 2026" title="Type-M vs. S&P 500 vs. Dow Jones" sub="Normalized to equal starting capital of $10,000 in 2003." />
        <Stagger className="mt-9 grid gap-4 lg:grid-cols-3">
          {benchmarks.map((item) => (
            <StaggerItem key={item.name}>
            <Card className={cn("rounded-lg border-border bg-card", item.featured && "border-[#d7b36e]/60")}>
              <CardContent className="p-6">
                <p className="text-xl font-medium">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.sub}</p>
                <div className="mt-7 grid grid-cols-2 gap-4">
                  <Stat label="Total Return" value={item.return} featured={item.featured} />
                  <Stat label="Ending Value" value={item.end} featured={item.featured} />
                  <Stat label="CAGR" value={item.cagr} />
                  <Stat label="Max DD" value={item.drawdown} />
                </div>
              </CardContent>
            </Card>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn delay={0.12}>
        <Card className="mt-8 overflow-hidden rounded-lg border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Growth of $10,000</CardTitle>
            <p className="text-sm text-muted-foreground">Normalized starting capital across Type-M, S&P 500, and Dow Jones.</p>
          </CardHeader>
          <CardContent>
            <ChartFrame>
              <BenchmarkGrowthChart />
            </ChartFrame>
          </CardContent>
        </Card>
        </FadeIn>
        <FadeIn delay={0.16}>
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full min-w-[680px] border-collapse bg-card text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="p-4">Metric</th>
                <th className="p-4 text-[#d7b36e]">Type-M</th>
                <th className="p-4">S&P 500</th>
                <th className="p-4">Dow Jones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Ending Value", "$224,811", "~$133,000", "~$62,000"],
                ["Total Return", "+2,148%", "+1,231%", "+518%"],
                ["Est. CAGR", "~14.2%", "~11.7%", "~8.1%"],
                ["Max Drawdown", "27.34%", "~57%", "~54%"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={cell} className={cn("p-4 text-muted-foreground", index === 1 && "font-medium text-[#d7b36e]", index === 0 && "text-foreground")}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ChartFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-muted/50 p-3", className)}>
      {children}
    </div>
  );
}

function BalanceCurveChart({ kind, compact = false }: { kind: Exclude<View, "overview">; compact?: boolean }) {
  return (
    <ChartContainer config={balanceChartConfig} className={cn("w-full", compact ? "h-[260px]" : "h-[420px]")}>
      <AreaChart accessibilityLayer data={balanceData[kind]} margin={{ left: 8, right: 12, top: 12, bottom: 4 }}>
        <defs>
          <linearGradient id={`balanceFill-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={compact ? 46 : 62} tickFormatter={moneyTick} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        {!compact && <ChartLegend content={<ChartLegendContent />} />}
        <Area
          dataKey="balance"
          type="monotone"
          fill={`url(#balanceFill-${kind})`}
          stroke="var(--color-balance)"
          strokeWidth={2.4}
        />
        <Line dataKey="equity" type="monotone" stroke="var(--color-equity)" strokeWidth={1.8} dot={false} />
      </AreaChart>
    </ChartContainer>
  );
}

function BenchmarkGrowthChart() {
  return (
    <ChartContainer config={benchmarkChartConfig} className="h-[390px] w-full">
      <LineChart accessibilityLayer data={benchmarkGrowthData} margin={{ left: 8, right: 16, top: 12, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={62} tickFormatter={moneyTick} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="typeM" type="monotone" stroke="var(--color-typeM)" strokeWidth={2.8} dot={false} />
        <Line dataKey="sp500" type="monotone" stroke="var(--color-sp500)" strokeWidth={2.2} dot={false} />
        <Line dataKey="dow" type="monotone" stroke="var(--color-dow)" strokeWidth={2.2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}

function QuickNav({ title, sub, onClick }: { title: string; sub: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.98 }}
      className="group w-full rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-[#d7b36e]/70"
    >
      <span className="flex items-center justify-between gap-4 font-medium">
        {title}
        <ArrowRight className="size-4 text-muted-foreground transition group-hover:text-[#d7b36e]" />
      </span>
      <span className="mt-2 block text-sm text-muted-foreground">{sub}</span>
    </motion.button>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="max-w-3xl">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={easeOut}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ ...easeOut, delay: 0.08 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mt-4 text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ ...easeOut, delay: 0.16 }}
      >
        {sub}
      </motion.p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function Stat({ label, value, featured = false }: { label: string; value: string; featured?: boolean }) {
  return (
    <div>
      <p className={cn("text-2xl font-light", featured ? gold : "text-foreground")}>{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
    </div>
  );
}

function Field({ id, label, type = "text", required = false }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required={required} className="border-border bg-background" />
    </div>
  );
}

function tabClass(active: boolean) {
  return cn(
    "h-10 flex-1 rounded-md text-sm transition",
    active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
  );
}

function Footer({ goTo }: { goTo: (view: View, hash?: string) => void }) {
  return (
    <FadeIn>
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em]">ZENYTE TECHNOLOGIES</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">Precision investment intelligence for the modern market.</p>
          </div>
          <div className="grid gap-6 text-sm sm:grid-cols-3">
            <FooterCol title="Product" links={[["Type-M Overview", "overview", "#typem"], ["2020-2026 Report", "report2020"], ["2003-2026 Report", "reportLong"]]} goTo={goTo} />
            <FooterCol title="Company" links={[["About", "overview", "#about"], ["Performance", "overview", "#performance"], ["Contact", "overview", "#contact"]]} goTo={goTo} />
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
              <p className="text-muted-foreground">Past performance is not indicative of future results.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row">
          <p>(c) 2026 Zenyte Technologies. All rights reserved.</p>
          <p>This website does not constitute investment advice.</p>
        </div>
      </div>
    </footer>
    </FadeIn>
  );
}

function FooterCol({
  title,
  links,
  goTo,
}: {
  title: string;
  links: [string, View, string?][];
  goTo: (view: View, hash?: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <div className="flex flex-col gap-2">
        {links.map(([label, view, hash]) => (
          <button key={label} className="text-left text-muted-foreground transition hover:text-foreground" onClick={() => goTo(view, hash)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
