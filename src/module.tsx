import ReactDOM from "react-dom/client";
import { App } from "./components/App";

window.run___Module___ = (el, fields: Record<string, string> = {}) => {
  if (!el) {
    throw new Error(`Element with id ${el} not found`);
  }
  ReactDOM.createRoot(el).render(<App {...fields} />);
};

declare global {
  interface Window {
    run___Module___: (rootId: HTMLElement) => void;
  }
}
