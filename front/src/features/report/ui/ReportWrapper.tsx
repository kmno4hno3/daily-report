"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { fileListAtom } from "@/src/entities/files/model";
import { useAtom } from "jotai";
import { useEffect, useState, useMemo } from "react";
import { ReportLayout } from "./ReportLayout";
import { ReportDetail } from "./ReportDetail";
import { ReportList } from "./ReportList";

export const ReportWrapper = () => {
  const pathname = usePathname();
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [reportData] = useAtom(fileListAtom);

  useEffect(() => {
    if (pathname?.startsWith("/report/list")) {
      const paths = pathname?.split("/");
      const [, , , year, month, date] = paths;
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDate(date);
    }
  }, [pathname]);

  const selectedYearReports = useMemo(() => {
    return reportData.find((yearData) => {
      return yearData.year === Number(selectedYear);
    });
  }, [selectedYear]);
  const selectedMonthReports = useMemo(() => {
    return selectedYearReports?.months.find((monthData) => {
      return monthData.month === Number(selectedMonth);
    });
  }, [selectedMonth]);
  const selectedDateReport = useMemo(() => {
    return selectedMonthReports?.reports.find((report) => {
      return report.date === Number(selectedDate);
    });
  }, [selectedDate]);

  const renderChildren = () => {
    if (selectedDateReport) {
      return (
        <ReportDetail
          selectedDateReport={selectedDateReport}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      );
    } else {
      return (
        <ReportList
          selectedMonthReports={selectedMonthReports}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      );
    }
  };

  return <ReportLayout>{renderChildren()}</ReportLayout>;
};
