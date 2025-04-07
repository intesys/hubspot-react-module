import ReactDOM from "react-dom/client";
import { App } from "./components/App";

window.run{{{Module}}} = (el) => {
  if (!el) {
    throw new Error(`Element with id ${el} not found`);
  }
  ReactDOM.createRoot(el).render(<App />);
};

declare global {
  interface Window {
    run{{{Module}}}: (rootId: HTMLElement) => void;
  }
}
