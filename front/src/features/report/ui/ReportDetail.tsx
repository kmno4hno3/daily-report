"use client";
import { Report } from "@/src/entities/files/type";
import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import markdownit from "markdown-it";

interface Props {
  selectedDateReport?: Report;
  selectedYear?: string;
  selectedMonth?: string;
}

export const ReportDetail = ({
  selectedDateReport,
  selectedYear,
  selectedMonth,
}: Props) => {
  const [file, setFile] = useState<string>();
  const [error, setError] = useState("");
  const fetchFile = async (path: string) => {
    try {
      const result = await invoke<string>("get_file_content", {
        path,
      });
      setFile(result);
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

  const md = markdownit();
  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: file ? md.render(file) : "",
      immediatelyRender: false,
    },
    [file]
  );

  return selectedDateReport && file ? (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        {selectedYear}/{selectedMonth}/{selectedDateReport.date}
      </h2>
      {editor && <EditorContent editor={editor} />}
    </div>
  ) : (
    <>
      <div>日報がありません</div>
    </>
  );
};
