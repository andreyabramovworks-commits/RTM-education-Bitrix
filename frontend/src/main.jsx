import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { LegacyReactHost } from "./LegacyReactHost";
import "./styles.css";

const environment = import.meta.env.VITE_APP_ENV || "development";
const release = import.meta.env.VITE_APP_VERSION || "dev";

const posthogEnabled = import.meta.env.VITE_POSTHOG_ENABLED === "true" && Boolean(import.meta.env.VITE_POSTHOG_KEY);
window.rtmCapture = () => {};

if (posthogEnabled) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://eu.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: false,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
    },
  });
  window.rtmCapture = (event, properties = {}) => posthog.capture(event, properties);
  posthog.capture("rtm_app_opened", { environment, release });
}

function App() {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => {
        if (!response.ok) throw new Error("API is unavailable");
        return response.json();
      })
      .then(() => {
        setApiStatus("online");
        window.rtmCapture("rtm_api_health_check", { status: "online" });
      })
      .catch(() => {
        setApiStatus("offline");
        window.rtmCapture("rtm_api_health_check", { status: "offline" });
      });
  }, []);

  return (
    <main className="app-shell" data-api-status={apiStatus}>
      <LegacyReactHost />
      <span className={"api-indicator " + apiStatus} title={"API: " + apiStatus} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
