import React, { useEffect, useState } from 'react';
import axios from 'axios';

const classifySite = (url) => {
  if (url.includes("leetcode") || url.includes("github")) return "Productive";
  if (url.includes("youtube") || url.includes("instagram") || url.includes("facebook")) return "Unproductive";
  return "Neutral";
};

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/weekly-report')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  const grouped = logs.reduce((acc, item) => {
    const key = item.url;
    acc[key] = acc[key] || { url: key, timeSpent: 0 };
    acc[key].timeSpent += item.timeSpent;
    return acc;
  }, {});

  return (
    <div style={{ padding: 20 }}>
      <h1>Weekly Productivity Report</h1>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Website</th>
            <th>Time Spent (minutes)</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(grouped).map((log, idx) => (
            <tr key={idx}>
              <td>{log.url}</td>
              <td>{Math.round(log.timeSpent / 60)}</td>
              <td>{classifySite(log.url)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
