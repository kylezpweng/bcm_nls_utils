const config = require("./config");
const { parseTsFile, writeTsFile } = require("./ts_handler");
const { readExcelFile } = require("./xlsx_handler");
const { downloadSingleFile, commitFile2Git } = require("./git_handler");
require("dotenv").config();

const LANGUAGES = ["EN", "SC", "TC"];

function formatData(data) {
  console.log("Formatting data...");
  const moduleMap = new Map();

  for (const sheetData of data) {
    for (const item of sheetData) {
      const moduleName = item.Module;
      if (!moduleName) continue;

      if (!moduleMap.has(moduleName)) {
        moduleMap.set(moduleName, {
          module: moduleName,
          data: [],
        });
      }

      const key = createKey(item.Module, item.Page, item.Item);
      if (moduleMap.get(moduleName).data.some((i) => i.key === key)) {
        throw new Error(`Duplicate key: ${item.Key} in module: ${moduleName}`);
      }

      moduleMap.get(moduleName).data.push({ ...item, key });
    }
  }

  return Array.from(moduleMap.values());
}

function createKey(module, page, item) {
  return `${toCamelCase(module)}_${toCamelCase(page)}_${toCamelCase(item)}`;
}

function toCamelCase(str) {
  return str
    .split(/\s+/)
    .filter((word) => word)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function formatOutput(data, language) {
  const result = {};
  for (const item of data) {
    result[item.key] = item[language];
  }
  return result;
}

async function execute() {
  const raw = readExcelFile(config.input);
  const modulesData = formatData(raw);

  for (const { module, data } of modulesData) {
    for (const lang of LANGUAGES) {
      const sha = await downloadSingleFile(module, lang);
      const newObj = formatOutput(data, lang);
      const oldObj = parseTsFile(module, lang);
      const content = { ...oldObj, ...newObj };
      const fileContent = writeTsFile(module, lang, content);

      if (!config.isCommit || !sha) continue;
      await commitFile2Git(module, lang, sha, fileContent);
    }
  }
}

(async () => {
  await execute();
  console.log("Done");
})();
