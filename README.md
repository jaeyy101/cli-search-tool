# CLI Search Tool 🔍

A lightweight Node.js command-line utility that scans directories for **functions** or **variables** by name and outputs the results in **JSON format**.  
Built to showcase practical Node.js skills: filesystem access, regex matching, CLI arguments, and JSON formatting.

---

## ✨ Features

- 📂 Recursive directory scanning
- 🔎 Search by function or variable name
- 📝 JSON output with file path, line number, and snippet
- 🔡 Case-insensitive option
- ⚡ Zero external dependencies

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/jaeyy101/cli-search-tool.git
cd cli-search-tool
chmod +x cli-search.js
```

## ⚡ Usage

Run the tool from the command line

```bash
node cli-search.js --dir ./src --query fetchData
```

### Options

| Flag                | Description                                              | Example              |
| ------------------- | -------------------------------------------------------- | -------------------- |
| `-d, --dir`         | Directory to search (default: current working directory) | `--dir ./src`        |
| `-q, --query`       | Name to search for (required)                            | `--query myVar`      |
| `-t, --type`        | Search type: `function`, `variable`, or `both` (default) | `--type function`    |
| `-i, --insensitive` | Case-insensitive search                                  | `-i`                 |
| `-o, --out`         | Save JSON results to a file                              | `--out results.json` |
| `-e, --ext`         | Comma-separated file extensions                          | `--ext .js,.ts`      |

## 📋 Example Output

```json
[
  {
    "file": "/src/utils/helpers.js",
    "line": 12,
    "type": "function",
    "snippet": "export function fetchData(url) { /* ... */ }"
  }
]
```
