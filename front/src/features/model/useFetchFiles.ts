"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { fileListAtom } from "@/src/entities/files/model";
import { getLocalFiles } from "@/src/features/api/getLocalFiles";

export const useFetchFiles = (path: string) => {
  const [, setFileList] = useAtom(fileListAtom);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getLocalFiles(path);
      if (files) {
        setFileList(files);
      }
    };
    fetchFiles();
  }, [path, setFileList]);
};
