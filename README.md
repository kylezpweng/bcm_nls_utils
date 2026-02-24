# BCM NLS Utils

This project is a powerful script that converts NLS (National Language Support) data from Excel files to TypeScript code and commits the changes to GitHub automatically. It's designed to streamline the internationalization workflow for BCM web applications.

## ✨ Features

- **Excel to TypeScript Conversion**: Automatically converts NLS data from Excel files to TypeScript files
- **Smart Key Generation**: Creates consistent camelCase keys from Module, Page, and Item names
- **Data Merging**: Merges new translations with existing ones, updating only changed values
- **GitHub Integration**: Downloads existing files from GitHub and commits changes back
- **Multi-language Support**: Supports EN (English), SC (Simplified Chinese), and TC (Traditional Chinese)
- **Error Handling**: Detects and throws errors for duplicate keys
- **Directory Management**: Automatically creates necessary directories

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure the Project

Edit `src/config.js` with your project information:

```javascript
module.exports = {
  input: "xlsx/nls_20260213_1.xlsx", // Path to your Excel file
  source: "source", // Directory for downloaded files
  git: {
    api: "https://api.github.com",
    owner: "kylezpweng", // Your GitHub username
    repo: "bcm_web", // Your GitHub repository
    branch: "main", // Branch to work with
    token: "your-github-token", // Your GitHub personal access token
  },
  isCommit: false, // Set to true to enable GitHub commits
};
```

### 3. Prepare Your Excel File

Create an Excel file with the following columns:

| Column | Description         | Example        |
| ------ | ------------------- | -------------- |
| Module | Module name         | `login`        |
| Page   | Page name           | `index`        |
| Item   | Item name           | `button`       |
| Key    | Original key        | `login_button` |
| EN     | English translation | `Login`        |
| SC     | Simplified Chinese  | `登录`         |
| TC     | Traditional Chinese | `登錄`         |

### 4. Run the Script

```bash
npm start
```

## 📁 Project Structure

```
bcm_nls_utils/
├── src/
│   ├── config.js          # Configuration file
│   ├── index.js           # Main script
│   ├── ts_handler.js      # TypeScript file handler
│   ├── xlsx_handler.js    # Excel file handler
│   └── git_handler.js     # GitHub API handler
├── output/                # Generated TypeScript files
│   ├── module1/
│   │   ├── en.ts
│   │   ├── sc.ts
│   │   └── tc.ts
│   └── module2/
│       ├── en.ts
│       ├── sc.ts
│       └── tc.ts
├── source/                # Files downloaded from GitHub
│   ├── module1/
│   │   ├── en.ts
│   │   ├── sc.ts
│   │   └── tc.ts
│   └── module2/
│       ├── en.ts
│       ├── sc.ts
│       └── tc.ts
├── xlsx/                  # Excel files
│   └── nls_20260213_1.xlsx
├── package.json
└── README.md
```

## 🔧 How It Works

1. **Read Excel File**: Reads NLS data from the configured Excel file
2. **Format Data**: Organizes data by module and generates unique keys
3. **Key Generation**: Creates camelCase keys using `toCamelCase()` function
4. **Download From GitHub**: Downloads existing TypeScript files from GitHub
5. **Merge Data**: Combines new translations with existing ones
6. **Write TypeScript Files**: Generates new TypeScript files with merged data
7. **Commit to GitHub**: Optionally commits changes back to GitHub

## 🎯 Key Functions

### 1. `formatData(data)`

- Organizes Excel data by module using `Map` for O(n) time complexity
- Generates unique keys for each item
- Detects duplicate keys and throws errors

### 2. `createKey(module, page, item)`

- Creates consistent camelCase keys
- Example: `Login Page` → `loginPage`
- Joins parts with underscores: `module_page_item`

### 3. `toCamelCase(str)`

- Converts strings to camelCase
- Removes spaces and capitalizes subsequent words

### 4. `formatOutput(data, language)`

- Formats data for TypeScript output
- Maps keys to translations for specific language

### 5. `execute()`

- Main execution function
- Coordinates the entire workflow

## ⚙️ Configuration Options

| Option       | Description                    | Default                    |
| ------------ | ------------------------------ | -------------------------- |
| `input`      | Path to Excel file             | `xlsx/nls_20260213_1.xlsx` |
| `source`     | Directory for downloaded files | `source`                   |
| `git.api`    | GitHub API endpoint            | `https://api.github.com`   |
| `git.owner`  | GitHub username                | `kylezpweng`               |
| `git.repo`   | GitHub repository name         | `bcm_web`                  |
| `git.branch` | GitHub branch                  | `main`                     |
| `git.token`  | GitHub personal access token   | -                          |
| `isCommit`   | Enable GitHub commits          | `false`                    |

## 🔐 GitHub Token Setup

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select "repo" scope (required for repository access)
4. Generate the token and copy it
5. Update `src/config.js` with your token

## 📊 Excel File Format

Your Excel file should have the following structure:

| Module | Page   | Item   | Key          | EN           | SC       | TC       |
| ------ | ------ | ------ | ------------ | ------------ | -------- | -------- |
| login  | index  | button | login_button | Login        | 登录     | 登錄     |
| login  | index  | header | login_header | Welcome      | 欢迎     | 歡迎     |
| itoken | verify | title  | itoken_title | Verify Token | 验证令牌 | 驗證令牌 |

## 🚫 Common Errors

### 1. `Duplicate key: [key] in module: [module]`

- **Cause**: Same key appears multiple times in the same module
- **Solution**: Ensure each key is unique per module

### 2. `File not found: [path]`

- **Cause**: Source file doesn't exist
- **Solution**: Check if the file exists in GitHub

### 3. `Request failed: 403 Forbidden`

- **Cause**: Invalid GitHub token or insufficient permissions
- **Solution**: Check your token and ensure it has `repo` scope

### 4. `Request failed: 404 Not Found`

- **Cause**: File or repository doesn't exist
- **Solution**: Verify repository path and file location

## 📈 Performance

- **Time Complexity**: O(n) for data processing (using Map instead of Array.find)
- **Memory Usage**: Efficiently handles large Excel files
- **API Calls**: Minimizes GitHub API requests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you have any questions or issues, please open an issue in the repository.
