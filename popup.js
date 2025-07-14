document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["activity"], (data) => {
    const table = document.getElementById("activityTable");
    const activity = data.activity || {};
    Object.keys(activity).forEach(site => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${site}</td><td>${activity[site].time}</td>`;
      table.appendChild(row);
    });
  });

  document.getElementById("openDashboard").onclick = () => {
    chrome.tabs.create({ url: "http://localhost:3000" });
  };
});
