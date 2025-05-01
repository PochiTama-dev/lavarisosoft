import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import { Provider } from "./hooks/context";
import { DataProvider } from "./hooks/DataContext";
import { NotificationProvider } from './hooks/NotificationContext';
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Provider>
      <NotificationProvider>  
        <DataProvider>
          <App />
        </DataProvider>
      </NotificationProvider>
      </Provider>
    </Router>
  </React.StrictMode>
);
