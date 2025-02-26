"use client";

import { useFetchFiles } from "@/src/features/model/useFetchFiles";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  useFetchFiles(process.env.NEXT_PUBLIC_FILE_DIR || "");

  return <>{children}</>;
};
