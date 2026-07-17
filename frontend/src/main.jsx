import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");
  const inBitrix = new URLSearchParams(window.location.search).get("bitrix_frame") === "1";

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("API is unavailable");
        return response.json();
      })
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  return (
    <main className="app-shell" data-api-status={apiStatus}>
      <iframe
        className="legacy-app"
        src={`/legacy/index.html?rtm_fullscreen=1${inBitrix ? "&v47=1" : ""}`}
        title={inBitrix ? "RTM Education v47" : "RTM Education v046"}
      />
      <span className={`api-indicator ${apiStatus}`} title={`API: ${apiStatus}`} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
