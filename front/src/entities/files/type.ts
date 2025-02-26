export type fileList = Year[];
export interface Year {
  year: number;
  months: Month[];
}
export interface Month {
  month: number;
  reports: Report[];
}
export interface Report {
  date: number;
}
