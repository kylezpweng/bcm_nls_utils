const fs = require("fs");
const path = require("path");
require("ts-node").register();

function parseTsFile(module, lang) {
  const filePath = `./source/${module}/${lang.toLowerCase()}.ts`;
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const data = require(path.resolve(filePath));

  return data.default || data;
}

function writeTsFile(module, lang, obj) {
  const dir = `./output/${module}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = `${dir}/${lang.toLowerCase()}.ts`;
  const fileContent = `export default ${JSON.stringify(obj, null, 2)}`;
  fs.writeFileSync(filePath, fileContent);

  return fileContent;
}

module.exports = { parseTsFile, writeTsFile };

// parseTsFile("login", "en");
