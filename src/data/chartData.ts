import type { View } from "../types";

type ReportKind = Exclude<View, "overview">;

export type HstHourRow = {
  hour: string;
  entries: number;
  profit: number;
  loss: number;
  region: "asia" | "europe" | "usa";
};

export type HstWeekdayRow = {
  day: string;
  entries: number;
  profit: number;
  loss: number;
};

export type HstMonthRow = {
  month: string;
  entries: number;
  profit: number;
  loss: number;
};

export type HoldingPoint = {
  hours: number;
  profit: number;
};

export type MfeMaePoint = {
  mfe: number;
  mae: number;
  profit: number;
};

export type WinLossBreakdown = {
  winRate: number;
  wins: number;
  losses: number;
  longWinRate: number;
  longTrades: number;
  shortWinRate: number;
  shortTrades: number;
  profitFactor: number;
  lrCorrelation: number;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function hourRegion(hour: number): HstHourRow["region"] {
  if (hour < 8) return "asia";
  if (hour < 15) return "europe";
  return "usa";
}

function buildHourRows(values: number[], profitLoss: [number, number][]): HstHourRow[] {
  return values.map((entries, hour) => ({
    hour: String(hour),
    entries,
    profit: profitLoss[hour]?.[0] ?? 0,
    loss: profitLoss[hour]?.[1] ?? 0,
    region: hourRegion(hour),
  }));
}

function buildWeekdayRows(entries: number[], profitLoss: [number, number][]): HstWeekdayRow[] {
  return weekdays.map((day, index) => ({
    day,
    entries: entries[index] ?? 0,
    profit: profitLoss[index]?.[0] ?? 0,
    loss: profitLoss[index]?.[1] ?? 0,
  }));
}

function buildMonthRows(entries: number[], profitLoss: [number, number][]): HstMonthRow[] {
  return months.map((month, index) => ({
    month,
    entries: entries[index] ?? 0,
    profit: profitLoss[index]?.[0] ?? 0,
    loss: profitLoss[index]?.[1] ?? 0,
  }));
}

function generateHoldingPoints(seed: number, count: number, maxHours: number, profitScale: number): HoldingPoint[] {
  const points: HoldingPoint[] = [];
  let state = seed;

  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  for (let index = 0; index < count; index += 1) {
    const roll = next();
    const hours = Math.pow(roll, 2.4) * maxHours;
    const spread = Math.max(40, 420 - hours * 2.8) * (profitScale / 400);
    const profit = (next() - 0.48) * spread * 2;
    points.push({
      hours: Math.round(hours * 10) / 10,
      profit: Math.round(profit),
    });
  }

  return points.sort((left, right) => left.hours - right.hours);
}

function generateMfeMaePoints(seed: number, count: number, scale: number): MfeMaePoint[] {
  const points: MfeMaePoint[] = [];
  let state = seed;

  const next = () => {
    state = (state * 22695477 + 1) % 4294967296;
    return state / 4294967296;
  };

  for (let index = 0; index < count; index += 1) {
    const mfe = next() * scale;
    const mae = -(next() * scale * 0.75);
    const profit = mfe * 0.82 + mae * 0.74 + (next() - 0.5) * scale * 0.08;
    points.push({
      mfe: Math.round(mfe),
      mae: Math.round(mae),
      profit: Math.round(profit),
    });
  }

  return points;
}

const hst2020HourEntries = [
  170, 390, 230, 310, 160, 120, 125, 135, 210, 395, 475, 320, 240, 260, 365, 575, 470, 555, 220, 175, 195, 250, 165, 85,
];

const hst2020HourProfitLoss: [number, number][] = [
  [1800, 2100], [850, 650], [850, 350], [1800, 850], [2350, 1150], [950, 750], [1150, 700], [750, 350],
  [1100, 250], [3950, 1800], [5300, 2800], [4100, 2400], [2350, 2200], [1950, 0], [3550, 3200],
  [5950, 4100], [4950, 2600], [5650, 4950], [3000, 2750], [1550, 850], [1050, 500], [1650, 1800], [1150, 1000], [500, 150],
];

const hst2020WeekdayEntries = [0, 1590, 1320, 1250, 1070, 1360, 0];
const hst2020WeekdayProfitLoss: [number, number][] = [
  [0, 0], [13300, 8250], [12050, 8000], [10850, 9400], [9500, 6950], [12900, 7450], [0, 0],
];

const hst2020MonthEntries = [550, 550, 690, 595, 585, 530, 460, 600, 505, 520, 475, 560];
const hst2020MonthProfitLoss: [number, number][] = [
  [4950, 3700], [5750, 2900], [5600, 4050], [4850, 5150], [5400, 3350], [3750, 1700],
  [4650, 3600], [6000, 4500], [4400, 3250], [4500, 2300], [4350, 3350], [4450, 2100],
];

const hstLongHourEntries = [
  1250, 1300, 1250, 1280, 950, 700, 750, 850, 1200, 2000, 2050, 1500, 1400, 1350, 1650, 2750, 1900, 2450, 1400, 1100, 1150, 1250, 850, 650,
];

const hstLongHourProfitLoss: [number, number][] = [
  [30000, 48000], [18000, 12000], [20000, 10000], [35000, 25000], [35000, 22000], [21000, 15000], [20000, 14000], [18000, 12000],
  [28000, 13000], [70000, 40000], [88000, 65000], [68000, 48000], [45000, 43000], [35000, 25000], [52000, 42000],
  [97000, 85000], [75000, 49000], [92000, 88000], [50000, 55000], [32000, 25000], [28000, 18000], [31000, 32000], [22000, 21000], [12000, 8000],
];

const hstLongWeekdayEntries = [0, 7810, 6833, 6500, 5000, 6600, 0];
const hstLongWeekdayProfitLoss: [number, number][] = [
  [0, 0], [232000, 168000], [215000, 178000], [195000, 174000], [162000, 135000], [205000, 143000], [0, 0],
];

const hstLongMonthEntries = [2600, 2650, 2900, 2550, 2900, 2680, 2650, 3040, 2700, 2650, 2650, 2780];
const hstLongMonthProfitLoss: [number, number][] = [
  [82000, 76000], [91000, 58000], [93000, 72000], [78000, 80000], [91000, 66000], [74000, 49000],
  [81000, 73000], [99000, 75000], [81000, 62000], [84000, 65000], [79000, 64000], [81000, 59000],
];

export const hstData = {
  report2020: {
    hours: buildHourRows(hst2020HourEntries, hst2020HourProfitLoss),
    weekdays: buildWeekdayRows(hst2020WeekdayEntries, hst2020WeekdayProfitLoss),
    months: buildMonthRows(hst2020MonthEntries, hst2020MonthProfitLoss),
  },
  reportLong: {
    hours: buildHourRows(hstLongHourEntries, hstLongHourProfitLoss),
    weekdays: buildWeekdayRows(hstLongWeekdayEntries, hstLongWeekdayProfitLoss),
    months: buildMonthRows(hstLongMonthEntries, hstLongMonthProfitLoss),
  },
} satisfies Record<ReportKind, { hours: HstHourRow[]; weekdays: HstWeekdayRow[]; months: HstMonthRow[] }>;

export const holdingScatterData = {
  report2020: generateHoldingPoints(2020, 420, 120, 400),
  reportLong: generateHoldingPoints(2003, 680, 269, 3600),
} satisfies Record<ReportKind, HoldingPoint[]>;

export const mfeMaeScatterData = {
  report2020: generateMfeMaePoints(6636, 360, 800),
  reportLong: generateMfeMaePoints(33073, 520, 6000),
} satisfies Record<ReportKind, MfeMaePoint[]>;

export const winLossData = {
  report2020: {
    winRate: 68.4,
    wins: 4542,
    losses: 2094,
    longWinRate: 68.46,
    longTrades: 3041,
    shortWinRate: 68.43,
    shortTrades: 3595,
    profitFactor: 1.46,
    lrCorrelation: 0.98,
  },
  reportLong: {
    winRate: 69.3,
    wins: 22919,
    losses: 10154,
    longWinRate: 69.63,
    longTrades: 15240,
    shortWinRate: 69.02,
    shortTrades: 17833,
    profitFactor: 1.31,
    lrCorrelation: 0.93,
  },
} satisfies Record<ReportKind, WinLossBreakdown>;

export const hourRegionColors = {
  asia: "#d4a017",
  europe: "#4caf50",
  usa: "#e07050",
} as const;
