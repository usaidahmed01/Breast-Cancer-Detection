"use client";

import { useRef, useState } from "react";
import { isHealthResponse } from "../lib/health";
import Icon from "./Icon";

const messages = {
  idle: {
    title: "Your workspace connection",
    description: "Check that your local service is ready for the next step.",
  },
  checking: {
    title: "Checking connection…",
    description: "Waiting for a response from the local API.",
  },
  connected: {
    title: "API connected",
    description: "The service is responding. AI models have not been loaded.",
  },
  error: {
    title: "API unavailable",
    description:
      "Start the Python API on port 8000, then check the connection again.",
  },
};

export default function ConnectionPanel() {
  const [status, setStatus] = useState("idle");
  const pending = useRef(false);

  async function checkConnection() {
    if (pending.current) return;
    pending.current = true;
    setStatus("checking");
    try {
      const response = await fetch("/api/health", {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      const data = await response.json();
      if (!response.ok || !isHealthResponse(data))
        throw new Error("Connection failed");
      setStatus("connected");
    } catch {
      setStatus("error");
    } finally {
      pending.current = false;
    }
  }

  return (
    <section
      className={`connection-panel ${status}`}
      aria-label="API connection"
    >
      <div className="connection-icon">
        <Icon name="pulse" size={21} />
      </div>
      <div
        className="connection-copy"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <h2>{messages[status].title}</h2>
        <p>{messages[status].description}</p>
      </div>
      <button
        className="check-button"
        onClick={checkConnection}
        disabled={status === "checking"}
      >
        {status === "checking"
          ? "Checking…"
          : status === "idle"
            ? "Check connection"
            : "Check again"}
        <Icon name="arrow" size={15} />
      </button>
    </section>
  );
}
