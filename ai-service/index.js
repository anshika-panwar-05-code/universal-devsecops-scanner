const express = require("express");
const cors = require("cors"); // ✅ Import cors
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const { cloneRepo } = require("./utils/cloneRepo");
const summarize = require("./summarize");

const app = express();
app.use(cors()); // ✅ Enable CORS
app.use(express.json());
const axios = require("axios");

app.post("/scan", async (req, res) => {
  const { repoUrl } = req.body;
  if (!repoUrl) return res.status(400).send({ error: "repoUrl is required" });

  const folderName = "target-repo";
  const reportPath = path.join(__dirname, "reports", "trivy-report.json");

  try {
    await cloneRepo(repoUrl, folderName);

    const scanCmd = `trivy fs --format json -o ${reportPath} ${folderName}`;
    console.log("Running:", scanCmd);

    exec(scanCmd, async (err, stdout, stderr) => {
      if (err) return res.status(500).send({ error: "Trivy failed", details: stderr });

      const summary = summarize(reportPath);

      // 🔁 POST to frontend
      try {
        await axios.post("http://localhost:3000/api/save-summary", {
          repoUrl,
          summary,
        });
        console.log("✅ Summary sent to frontend successfully.");
      } catch (sendErr) {
        console.error("❌ Failed to send to frontend:", sendErr.message);
      }

      return res.send({ summary });
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
