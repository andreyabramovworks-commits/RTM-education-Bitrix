import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LegacyReactHost } from "./LegacyReactHost";
import "./styles.css";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");
  const params = new URLSearchParams(window.location.search);
  const inBitrix = params.get("bitrix_frame") === "1";
  const legacy47 = params.get("version") === "47";

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
      {legacy47 ? (
        <iframe
          className="legacy-app"
          src={`/legacy/index.html?rtm_fullscreen=1${inBitrix ? "&v47=1" : ""}`}
          title="RTM Education v47"
        />
      ) : <LegacyReactHost />}
      <span className={`api-indicator ${apiStatus}`} title={`API: ${apiStatus}`} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
