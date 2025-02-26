import { invoke } from "@tauri-apps/api/core";
import { fileList } from "@/src/entities/files/type";

export const getLocalFiles = async (path: string) => {
  try {
    return await invoke<fileList>("list_directory", { path });
  } catch (error) {
    console.error(error);
  }
};
