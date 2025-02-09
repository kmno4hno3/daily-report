use std::fs;
use std::path::Path;
// use tauri::command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(serde::Serialize)]
struct FileEntry {
    name: String,
    is_dir: bool,
}

#[tauri::command]
fn list_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let path = Path::new(&path);
    if !path.is_dir() {
        return Err("指定されたパスはディレクトリではありません".to_string());
    }

    let mut entries = Vec::new();
    match fs::read_dir(path) {
        Ok(read_dir) => {
            for entry in read_dir {
                if let Ok(entry) = entry {
                    let file_type = entry.file_type().unwrap();
                    entries.push(FileEntry {
                        name: entry.file_name().into_string().unwrap_or_default(),
                        is_dir: file_type.is_dir(),
                    })
                }
            }
            Ok(entries)
        }
        Err(err) => Err(format!("ディレクトリの読み込みに失敗しました: {}", err)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, list_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
