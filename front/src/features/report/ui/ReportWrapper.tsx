"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { fileListAtom } from "@/src/entities/files/model";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Report } from "@/src/entities/files/type";
import { invoke } from "@tauri-apps/api/core";
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

  const [files, setFiles] = useState<string>();
  const [error, setError] = useState("");
  const fetchFile = async (path: string) => {
    try {
      1;
      setError("");
      const result = await invoke<string>("list_directory", {
        path,
      });
      setFiles(result);
    } catch (err) {
      setError("ファイルの読み込みに失敗しました");
      console.error("Error", err);
    }
  };

  useEffect(() => {
    // fetchFile(filePath);
  }, []);

  const selectedYearReports = reportData.find((yearData) => {
    return yearData.year === Number(selectedYear);
  });

  const selectedMonthReports = selectedYearReports?.months.find((monthData) => {
    return monthData.month === Number(selectedMonth);
  });

  if (selectedDate) {
    const selectedDateReport = selectedMonthReports?.reports.find((report) => {
      return report.date === Number(selectedDate);
    });

    if (selectedDateReport) {
      const rootPath = process.env.NEXT_PUBLIC_FILE_DIR || "";
      const filePath =
        rootPath +
        "/" +
        selectedYear +
        "/" +
        selectedMonth +
        "/" +
        selectedDate;

      // TODO: 詳細
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">{selectedDateReport.date}</h2>
          <p className="text-gray-600 mb-4">日付: {selectedDateReport.date}</p>
          <div className="whitespace-pre-wrap">{selectedDateReport.date}</div>
        </div>
      );
    } else {
      return (
        <>
          <div>日報がありません</div>
        </>
      );
    }
  }

  // return (
  //   <div className="flex-1 p-6 flex items-center justify-center">
  //     <p className="text-gray-500">日報または月を選択してください。</p>
  //   </div>
  // );

  const renderChildren = () => {
    if (
      selectedMonthReports &&
      selectedMonthReports?.reports?.length > 0 &&
      selectedYear &&
      selectedMonth
    ) {
      return (
        <ReportList
          selectedMonthReports={selectedMonthReports}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      );
    } else {
      return <ReportDetail />;
    }
  };

  return <ReportLayout>{renderChildren()}</ReportLayout>;
};
