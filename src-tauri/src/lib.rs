use std::fs;
use std::path::{Path, PathBuf};

#[derive(serde::Serialize, Debug)]
struct Report {
    date: u32,
}

#[derive(serde::Serialize, Debug)]
struct Month {
    month: u32,
    reports: Vec<Report>,
}

#[derive(serde::Serialize, Debug)]
struct Year {
    year: u32,
    months: Vec<Month>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn list_directory(path: PathBuf) -> Result<Vec<Year>, String> {
    let path = Path::new(&path);
    if !path.is_dir() {
        return Err("指定されたパスはディレクトリではありません".to_string());
    }

    let mut years = Vec::new();

    match fs::read_dir(path) {
        Ok(read_dir) => {
            for year_entry in read_dir {
                if let Ok(year_entry) = year_entry {
                    if let Ok(file_type) = year_entry.file_type() {
                        if !file_type.is_dir() {
                            continue;
                        }
                    } else {
                        continue;
                    }

                    let year_str_owned = year_entry.file_name().to_string_lossy().to_string();
                    let year_str = &year_str_owned;
                    if let Ok(year_num) = year_str.parse::<u32>() {
                        let mut months = Vec::new();

                        if let Ok(month_entries) = fs::read_dir(year_entry.path()) {
                            for month_entry in month_entries {
                                if let Ok(month_entry) = month_entry {
                                    if let Ok(file_type) = month_entry.file_type() {
                                        if !file_type.is_dir() {
                                            continue;
                                        }
                                    } else {
                                        continue;
                                    }

                                    let month_str = month_entry.file_name();
                                    let month_str = month_str.to_string_lossy();
                                    if let Ok(month_num) = month_str.parse::<u32>() {
                                        let mut reports = Vec::new();

                                        if let Ok(report_entries) = fs::read_dir(month_entry.path())
                                        {
                                            for report_entry in report_entries {
                                                if let Ok(report_entry) = report_entry {
                                                    if !report_entry
                                                        .path()
                                                        .to_string_lossy()
                                                        .ends_with(".md")
                                                    {
                                                        continue;
                                                    }

                                                    let file_name_os = report_entry.file_name();
                                                    let file_name = file_name_os.to_string_lossy();
                                                    if let Ok(date) = file_name
                                                        .trim_end_matches(".md")
                                                        .parse::<u32>()
                                                    {
                                                        reports.push(Report { date });
                                                    }
                                                }
                                            }
                                        }

                                        months.push(Month {
                                            month: month_num,
                                            reports,
                                        });
                                    }
                                }
                            }
                        }

                        years.push(Year {
                            year: year_num,
                            months,
                        });
                    }
                }
            }
            Ok(years)
        }
        Err(err) => Err(format!("ディレクトリ読み込み失敗: {}", err)),
    }
}

#[tauri::command]
fn get_file_content(path: PathBuf) -> Result<String, String> {
    if path.extension().and_then(|s| s.to_str()) == Some("md") {
        fs::read_to_string(&path).map_err(|e| format!("ファイル読み込み失敗: {}", e))
    } else {
        Err("指定されたファイルはMarkdownではありません".to_string())
    }
}

#[tauri::command]
fn save_content(path: PathBuf, md_text: String) -> Result<String, String> {
    println!("{}", md_text);
    if path.extension().and_then(|s| s.to_str()) == Some("md") {
        let result = fs::read_to_string(&path).map_err(|e| format!("ファイル読み込み失敗: {}", e));
        if result.is_ok() {
            fs::write(&path, &md_text)
                .map_err(|e| format!("ファイル書き込み失敗: {}", e))
                .map(|_| "成功".to_string())
        } else {
            result
        }
    } else {
        Err("指定されたファイルはMarkdownではありません".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            list_directory,
            get_file_content,
            save_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
