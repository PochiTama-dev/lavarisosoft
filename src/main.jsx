import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import { Provider } from "./hooks/context";
import { DataContext } from "./hooks/DataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Provider>
        <DataContext>
          <App />
        </DataContext>
      </Provider>
    </Router>
  </React.StrictMode>
);
