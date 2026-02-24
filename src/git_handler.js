const config = require("./config");
const fs = require("fs");

async function downloadSingleFile(module, lang) {
  const { api, owner, repo, branch, token } = config.git;
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
  const { api, owner, repo, branch, token } = config.git;
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

    // const data = await response.json();
    // console.log(data);
  } catch (error) {
    console.error("Failed to commit the file", error);
    throw error;
  }
}

// const content = `export default {
//   "login_terms_header": "Notice",
//   "login_terms_introText": "Thank you for download the BEA Corporate Banking Mobile App. Please read and the Terms & Conditions for Corporate Cyberbanking and BEA Corporate Online Services and the Bank's Personal Data (Privacy) Ordinance - Personal Information Collection (Customers) Statement and select \"I have read and agreed\" to user our app.",
//   "login_terms_sectionHeader": "Terms & Conditions",
//   "login_terms_checkbox": "I have read and agreed",
//   "login_terms_button": "Continue",
//   "login_index_header": "Log in",
//   "login_index_accountNumber": "Account Number",
//   "login_index_userName": "User Name",
//   "login_index_pin": "PIN",
//   "login_index_button": "Continue",
//   "login_index_forgotPin": "Forgot your PIN?",
//   "login_index_pinActivation": "PIN Activation",
//   "login_index_resetPin": "Request reset PIN"
// }`;
// commitFile2Git(
//   "login",
//   "en",
//   "b1c6ea436a540020ff61f01dea449d5b39367b27",
//   content
// );

module.exports = { downloadSingleFile, commitFile2Git };
