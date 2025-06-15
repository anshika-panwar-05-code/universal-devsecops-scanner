const fs = require("fs");

function summarize(reportPath) {
  const data = JSON.parse(fs.readFileSync(reportPath));
  let findings = [];

  for (const result of data.Results || []) {
    for (const vuln of result.Vulnerabilities || []) {
      findings.push({
        id: vuln.VulnerabilityID,
        severity: vuln.Severity,
        package: vuln.PkgName,
        title: vuln.Title || "",
      });
    }
  }

  const summary = {
    total: findings.length,
    high: findings.filter(f => f.severity === "HIGH").length,
    medium: findings.filter(f => f.severity === "MEDIUM").length,
    low: findings.filter(f => f.severity === "LOW").length,
    findings,
  };

  return summary;
}

module.exports = summarize;
