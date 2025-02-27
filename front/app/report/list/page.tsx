"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type FileEntry = {
  name: string;
  is_dir: boolean;
};

const Home = () => {
  const [directoryPath, setDirectoryPath] = useState("/Users/tatsuya/Desktop");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      setError("");
      const result = await invoke<FileEntry[]>("list_directory", {
        path: directoryPath,
      });
      setFiles(result);
    } catch (err) {
      setError("ディレクトリの読み込みに失敗しました");
      console.error("Error", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={directoryPath}
        onChange={(e) => setDirectoryPath(e.target.value)}
      />
      <button onClick={fetchFiles}>取得</button>

      {error && <p>{error}</p>}

      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.is_dir ? "📁" : "📄"} {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
