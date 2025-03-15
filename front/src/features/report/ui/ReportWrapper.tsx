"use client";

import type React from "react";
import { useSearchParams } from "next/navigation";
import { fileListAtom } from "@/src/entities/files/model";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { ReportLayout } from "./ReportLayout";
import { ReportDetail } from "./ReportDetail";
import { ReportList } from "./ReportList";

export const ReportWrapper = () => {
  const searchParams = useSearchParams();
  const selectedYear = searchParams?.get("year");
  const selectedMonth = searchParams?.get("month");
  const selectedDate = searchParams?.get("day");
  const [reportData] = useAtom(fileListAtom);

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
          selectedYear={selectedYear ?? undefined}
          selectedMonth={selectedMonth ?? undefined}
        />
      );
    } else {
      return (
        <ReportList
          selectedMonthReports={selectedMonthReports}
          selectedYear={selectedYear ?? undefined}
          selectedMonth={selectedMonth ?? undefined}
        />
      );
    }
  };

  return <ReportLayout>{renderChildren()}</ReportLayout>;
};
