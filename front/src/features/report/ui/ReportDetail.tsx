"use client";
import { Report } from "@/src/entities/files/type";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface props {
  selectedDateReport?: Report;
  selectedYear?: string;
  selectedMonth?: string;
}

export const ReportDetail = ({
  selectedDateReport,
  selectedYear,
  selectedMonth,
}: props) => {
  // TODO:ファイルをここで読み込む
  const [file, setFile] = useState<string>();
  const [error, setError] = useState("");
  const fetchFile = async (path: string) => {
    try {
      const result = await invoke<string>("get_file_content", {
        path,
      });
      setFile(result);
      console.log(result);
    } catch (err) {
      setError("ファイルの読み込みに失敗しました");
      console.error("Error", err);
    }
  };

  useEffect(() => {
    if (selectedDateReport?.date) {
      fetchFile(
        `/Users/tatsuya/Workspace/個人開発/daily-report-files/${selectedYear}/${selectedMonth}/${selectedDateReport.date}.md`
      );
    }
  }, []);

  return selectedDateReport && file ? (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{selectedDateReport.date}</h2>
      <p className="text-gray-600 mb-4">日付: {selectedDateReport.date}</p>
      <div className="whitespace-pre-wrap">{file}</div>
    </div>
  ) : (
    <>
      <div>日報がありません</div>
    </>
  );
};
