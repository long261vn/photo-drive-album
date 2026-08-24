import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const redirectedRoute = new URLSearchParams(window.location.search).get("route");
if (redirectedRoute && redirectedRoute.startsWith("/")) {
  window.history.replaceState(null, "", `${import.meta.env.BASE_URL.replace(/\/$/, "")}${redirectedRoute}${window.location.hash}`);
}

createRoot(document.getElementById("root")!).render(<App />);
