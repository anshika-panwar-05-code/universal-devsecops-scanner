async function scanRepo() {
  const repoUrl = document.getElementById("repoUrl").value;
  const resultDiv = document.getElementById("result");
  const loading = document.getElementById("loading");

  if (!repoUrl.trim()) {
    alert("Please enter a valid GitHub repository URL.");
    return;
  }

  resultDiv.innerHTML = "";
  loading.classList.remove("hidden");

  try {
    const response = await fetch("http://localhost:5000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ repoUrl })
    });

    const data = await response.json();
    loading.classList.add("hidden");

    if (data.success) {
      resultDiv.innerHTML = `✅ Scan Completed:\n\n${data.summary}`;
    } else {
      resultDiv.innerHTML = `❌ Error: ${data.message}`;
    }
  } catch (err) {
    loading.classList.add("hidden");
    resultDiv.innerHTML = "❌ An error occurred during scanning.";
    console.error(err);
  }
}
