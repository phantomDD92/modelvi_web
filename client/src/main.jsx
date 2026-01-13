import "./style/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { Toaster } from "react-hot-toast";
import store from "@/redux/store";
import { ConfigProvider, theme } from "antd";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" />
      <App />
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();
