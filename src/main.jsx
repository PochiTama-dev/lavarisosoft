import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router  } from 'react-router-dom';
import App from './App';
import { Provider } from './hooks/context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Provider>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
