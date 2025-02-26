import { atom } from "jotai";
import { fileList } from "@/src/entities/files/type";

export const fileListAtom = atom<fileList>([]);
fileListAtom.debugLabel = "fileListAtom";
