const config = require("./config");
const fs = require("fs");
require("dotenv").config();

async function downloadSingleFile(module, lang) {
  if (config.localSource) {
    return "";
  }
  const token = process.env.token;
  const { api, owner, repo, branch } = config.git;
  const path = `src/pages/${module}/i18n/${lang.toLowerCase()}.ts`;
  try {
    const url = `${api}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    console.log(`Downloading from ${url}`);
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (data.content) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const dir = `${config.source}/${module}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = `${dir}/${lang.toLowerCase()}.ts`;
      console.log(`Saving to ${filePath}`);
      fs.writeFileSync(filePath, content);
      return data.sha;
    } else {
      throw new Error("File content is empty");
    }
  } catch (error) {
    console.error("Failed to download the file", error);
    throw error;
  }
}

async function commitFile2Git(module, lang, sha, content) {
  const encodedContent = Buffer.from(content).toString("base64");
  const token = process.env.token;
  const { api, owner, repo, branch } = config.git;
  const path = `src/pages/${module}/i18n/${lang.toLowerCase()}.ts`;
  try {
    const url = `${api}/repos/${owner}/${repo}/contents/${path}`;
    console.log(`Committing to ${url}`);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
      },
      body: JSON.stringify({
        message: `i18n update by auto script ${new Date().toLocaleString()}`,
        content: encodedContent,
        sha,
        branch,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Failed to commit the file", error);
    throw error;
  }
}

module.exports = { downloadSingleFile, commitFile2Git };
