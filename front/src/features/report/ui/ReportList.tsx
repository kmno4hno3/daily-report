"use client";

import { Month, Report } from "@/src/entities/files/type";
import { useEffect, useState } from "react";
import Link from "next/link";
import { invoke } from "@tauri-apps/api/core";

interface props {
  selectedMonthReports?: Month;
  selectedYear?: string;
  selectedMonth?: string;
}

export const ReportList = ({
  selectedMonthReports,
  selectedYear,
  selectedMonth,
}: props) => {
  // TODO:ファイルをここで読み込む
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

  return (
    selectedMonthReports &&
    selectedYear &&
    selectedMonth && (
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {selectedYear}年 {selectedMonth}月の日報一覧
        </h2>
        <div className="grid gap-4">
          {selectedMonthReports.reports.map((report: Report) => (
            <Link
              href={`/report/list/${selectedYear}/${selectedMonth}/${report.date}`}
              key={`${report.date}`}
            >
              <button
                key={report.date}
                className="text-left p-4 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold">{report.date}</h3>
                <p className="text-gray-600 truncate">{report.date}</p>
              </button>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};
