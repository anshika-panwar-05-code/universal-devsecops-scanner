const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function cloneRepo(repoUrl, folderName) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(folderName)) fs.rmSync(folderName, { recursive: true, force: true });
    const cmd = `git clone ${repoUrl} ${folderName}`;
    try {
      execSync(cmd, { stdio: "inherit" });
      resolve();
    } catch (err) {
      reject(new Error("Repo clone failed"));
    }
  });
}

module.exports = { cloneRepo };
