"use client";
import { Report } from "@/src/entities/files/type";

interface props {
  selectedDateReport?: Report;
}

export const ReportDetail = ({ selectedDateReport }: props) => {
  return selectedDateReport ? (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{selectedDateReport.date}</h2>
      <p className="text-gray-600 mb-4">日付: {selectedDateReport.date}</p>
      <div className="whitespace-pre-wrap">{selectedDateReport.date}</div>
    </div>
  ) : (
    <>
      <div>日報がありません</div>
    </>
  );
};
