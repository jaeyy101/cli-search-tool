#!/usr/bin/env node
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

// ---- CLI Setup ----
const program = new Command();

program
  .name("cli-search")
  .description("Search JS/TS files for functions or variables by name.")
  .version("1.0.0")
  .requiredOption(
    "-q, --query <string>",
    "Function or variable name to search for"
  )
  .option("-d, --dir <path>", "Directory to search", process.cwd())
  .option("-t, --type <type>", "Type: function | variable | both", "both")
  .option("-i, --insensitive", "Case-insensitive search")
  .option("-o, --out <path>", "Output file (JSON format)")
  .parse(process.argv);

const opts = program.opts();

// ---- Helpers ----
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function walkDir(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function searchInFile(file, query, type, insensitive) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  const flags = insensitive ? "i" : "";
  const escaped = escapeRegExp(query);

  const patterns = {
    function: [
      new RegExp(`function\\s+${escaped}\\s*\\(`, flags),
      new RegExp(`const\\s+${escaped}\\s*=\\s*\\(?[^)]*\\)?\\s*=>`, flags),
      new RegExp(`${escaped}\\s*\\([^)]*\\)\\s*{`, flags),
    ],
    variable: [
      new RegExp(`(const|let|var)\\s+${escaped}\\b`, flags),
      new RegExp(`\\b${escaped}\\s*=`, flags),
    ],
  };

  const activePatterns =
    type === "function"
      ? patterns.function
      : type === "variable"
      ? patterns.variable
      : [...patterns.function, ...patterns.variable];

  const results = [];

  lines.forEach((line, i) => {
    for (const rx of activePatterns) {
      if (rx.test(line)) {
        results.push({
          file,
          line: i + 1,
          snippet: line.trim(),
        });
        break;
      }
    }
  });

  return results;
}

// ---- Main Search ----
const allFiles = walkDir(opts.dir);
const matches = [];

for (const file of allFiles) {
  const res = searchInFile(file, opts.query, opts.type, opts.insensitive);
  matches.push(...res);
}

// ---- Output ----
const output = {
  query: opts.query,
  directory: opts.dir,
  matches,
  totalMatches: matches.length,
};

if (opts.out) {
  fs.writeFileSync(opts.out, JSON.stringify(output, null, 2));
  console.log(`✅ Results written to ${opts.out}`);
} else {
  console.log(JSON.stringify(output, null, 2));
}
console.log(opts);
