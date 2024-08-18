import "./style/index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { Toaster } from "react-hot-toast";
import store from "@/redux/store";
import { ConfigProvider } from "antd";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" />
      <ConfigProvider theme={{
        token: {
          // Seed Token
          colorPrimary: '#00b96b',
          borderRadius: 2,

          // Alias Token
          colorBgContainer: '#f6ffed',
        },
      }}>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();
