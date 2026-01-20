import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

export const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: listings</div>
    <div>Framework: react-19</div>
  </div>
);

// Mount function for Module Federation
export const mount = (containerId: string) => {
  const container = document.getElementById(containerId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  }
};

// Standalone rendering (for development)
if (typeof window !== "undefined" && document.getElementById("app")) {
  const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
  root.render(<App />);
}