"use client";

import { Month, Report } from "@/src/entities/files/type";

interface props {
  selectedMonthReports: Month;
  selectedYear: string;
  selectedMonth: string;
}

export const ReportList = ({
  selectedMonthReports,
  selectedYear,
  selectedMonth,
}: props) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        {selectedYear}年 {selectedMonth}月の日報一覧
      </h2>
      <div className="grid gap-4">
        {selectedMonthReports.reports.map((report: Report) => (
          <button
            key={report.date}
            className="text-left p-4 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-semibold">{report.date}</h3>
            <p className="text-gray-600 truncate">{report.date}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
