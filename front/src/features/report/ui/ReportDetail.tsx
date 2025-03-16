"use client";
import { Report } from "@/src/entities/files/type";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import markdownit from "markdown-it";
import TurndownService from "turndown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
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

  useEffect(() => {
    const fetchFile = async (path: string) => {
      try {
        const result = await invoke<string>("get_file_content", {
          path,
        });
        setFile(result);
      } catch (err) {
        console.error("Error", err);
      }
    };

    if (selectedDateReport?.date) {
      const basePath = process.env.NEXT_PUBLIC_FILE_DIR || "";
      fetchFile(
        `${basePath}/${selectedYear}/${selectedMonth}/${selectedDateReport.date}.md`
      );
    }
  }, [selectedDateReport, selectedYear, selectedMonth]);

  const md = markdownit();
  const lowlight = createLowlight(all);
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        CodeBlockLowlight.configure({
          lowlight,
        }),
      ],
      content: file ? md.render(file) : "",
      immediatelyRender: false,
    },
    [file]
  );

  const saveContent = async (path: string) => {
    if (editor) {
      const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        preformattedCode: true,
      });
      try {
        await invoke<string>("save_content", {
          path,
          mdText: turndownService.turndown(editor.getHTML()),
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    if (editor && selectedDateReport) {
      const path = `/Users/tatsuya/Workspace/個人開発/daily-report-files/${selectedYear}/${selectedMonth}/${selectedDateReport.date}.md`;
      editor.on("blur", () => saveContent(path));
      return () => {
        editor.off("blur", () => saveContent(path));
      };
    }
  }, [editor]);

  // TODO: 一瞬ちらつきが起きるのを改善したい
  if (!selectedDateReport || !file) {
    return <div>日報がありません</div>;
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        {selectedYear}/{selectedMonth}/{selectedDateReport.date}
      </h2>
      {editor && <EditorContent editor={editor} />}
    </div>
  );
};
