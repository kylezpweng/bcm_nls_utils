const fs = require("fs");
const path = require("path");
const config = require("./config");
require("ts-node").register();

function parseTsFile(module, lang) {
  let filePath;
  if (config.localSource) {
    filePath = `${config.localSource}${
      module === "assets" ? "" : "/pages"
    }/${module}/i18n/${lang.toLowerCase()}.ts`;
  } else {
    filePath = `./source/${module}/${lang.toLowerCase()}.ts`;
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const data = require(path.resolve(filePath));

  return data.default || data;
}

function stringifyWithSingleQuotes(obj, indent = 2) {
  const spaces = " ".repeat(indent);

  if (obj === null) return "null";
  if (typeof obj !== "object") {
    if (typeof obj === "string") {
      return `'${obj.replace(/'/g, "\\'")}'`;
    }
    return String(obj);
  }

  const isArray = Array.isArray(obj);
  const entries = isArray ? obj : Object.entries(obj);

  if (entries.length === 0) {
    return isArray ? "[]" : "{}";
  }

  const lines = [];
  for (const [key, value] of entries) {
    let line;
    if (isArray) {
      line = `${spaces}${stringifyWithSingleQuotes(value, indent)}`;
    } else {
      line = `${spaces}'${key}': ${stringifyWithSingleQuotes(value, indent)}`;
    }
    lines.push(line);
  }

  const prefix = isArray ? "[" : "{";
  const suffix = isArray ? "]" : "}";

  return `${prefix}\n${lines.join(",\n")}\n${" ".repeat(indent - 2)}${suffix}`;
}

function writeTsFile(module, lang, obj) {
  const dir = `./output/${module}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = `${dir}/${lang.toLowerCase()}.ts`;
  const fileContent = `export default ${stringifyWithSingleQuotes(obj, 2)}\r\n`;
  fs.writeFileSync(filePath, fileContent);
  console.log(`Written file: ${filePath}`);

  return fileContent;
}

module.exports = { parseTsFile, writeTsFile };
