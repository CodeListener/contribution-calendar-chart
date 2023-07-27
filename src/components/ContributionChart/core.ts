import { format } from "./utils";

export const DEFAULT_COLUMN_COUNT = 53;
const ONE_DAY_TIMESTAMP = 86400000;
export type DateItem = {
  year: number;
  month: number;
  date: number;
  day: number;
  full: string;
  ignore?: boolean;
};
export type MonthItem = { colspan: number; month: number; year: number };
export enum MonthMap {
  Jan = 1,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sep,
  Oct,
  Nov,
  Dec,
}

export enum WeekMap {
  Sun,
  Mon,
  Tues,
  Wed,
  Thur,
  Fri,
  Sat,
}

function getDateInfo(date: Date | number | string) {
  const cur = new Date(date);
  return {
    year: cur.getFullYear(),
    month: cur.getMonth() + 1,
    date: cur.getDate(),
    day: cur.getDay(),
    full: format(cur),
  };
}

function getStartDate(end: number | string | Date) {
  // 52周
  const cols = 52;
  const endDate = new Date(end);
  const day = endDate.getDay();
  // 由于一年365天, 365 / 7 > 52 && <53，所以只获取52周前的天数
  const endTimeStamp = endDate.getTime() - ONE_DAY_TIMESTAMP * day;
  // 我们取第53列的第一天 减去 前面的52周的天数得出开始日期
  // 这里我们是通过外部传入cols来自定义减去前面的多少周，方便决定需要结束日期的前几周作为开始日期
  const diff = ONE_DAY_TIMESTAMP * cols * 7;
  return new Date(endTimeStamp - diff);
}

export function getDateItems(start: string, end: string) {
  const startDate = new Date(start);
  const day = startDate.getDay();
  const rows: DateItem[][] = [[], [], [], [], [], [], []];
  for (let i = 0; i < day; i++) {
    const dateInfo = getDateInfo(startDate.getTime() - (day - i) * ONE_DAY_TIMESTAMP);
    rows[dateInfo.day].push({
      ignore: true,
      ...dateInfo,
    });
  }
  const endDate = new Date(end);
  for (let current = startDate.getTime(); current <= endDate.getTime(); current += ONE_DAY_TIMESTAMP) {
    const dateInfo = getDateInfo(current);
    rows[dateInfo.day].push(dateInfo);
  }

  return rows;
}

function getMonthItems(rows: DateItem[][]) {
  const result = new Map<string, MonthItem>();
  const firstRow = rows[0];
  const lastRow = rows[rows.length - 1];
  firstRow.forEach((item, index) => {
    let curItem: DateItem = item;
    // 存在同一列有上一年和当前的数据的情况，直接并入当前当年月份的span
    if (index === 0 && item.month !== lastRow[0].month) {
      curItem = lastRow[0];
    }
    const key = `${curItem.year}-${curItem.month}`;
    const target = result.get(key) || { colspan: 0, month: curItem.month, year: curItem.year };
    target.colspan++;
    result.set(key, target);
  });
  return [...result.values()];
}

type Result = {
  months: MonthItem[];
  dates: DateItem[][];
};

export function generateChartData(): Result;
export function generateChartData(year: number): Result;
export function generateChartData(start: string | number | Date, end: string | number | Date): Result;
export function generateChartData(...args: any): Result {
  let start: string;
  let end: string;
  if (args.length === 1) {
    const [year] = args;
    start = format(`${year}-01-01`);
    end = format(`${year}-12-31`);
  } else if (args.length === 2) {
    [start, end] = [format(args[0]), format(args[1])];
  } else {
    // 默认不传或者传参超过2个，直接按默认处理
    // 默认情况下：当天为结束时间
    end = format(Date.now());
    // 根据结束时间反推开始时间
    start = format(getStartDate(end));
  }
  const dates = getDateItems(start, end);
  return {
    months: getMonthItems(dates),
    dates,
  };
}
