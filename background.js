let activity = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
    const hostname = new URL(tab.url).hostname;

    const now = Date.now();

    if (!activity[hostname]) {
      activity[hostname] = { time: 1, lastVisit: now };  // Start with 1 minute
    } else {
      const timeSpent = Math.floor((now - activity[hostname].lastVisit) / 60000) || 1;
      activity[hostname].time += timeSpent;
      activity[hostname].lastVisit = now;
    }

    // Send to backend
    fetch("http://localhost:5000/log-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: hostname,
        timeSpent: activity[hostname].time,
        date: new Date().toISOString().slice(0, 10), // format: YYYY-MM-DD
      }),
    }).catch(console.error);
  }
});
