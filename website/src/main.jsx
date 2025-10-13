import { StrictMode } from "react";
import React from "react";
import ReactDOM from 'react-dom/client';
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { injectStore } from './utils/api';
import App from './App';

// Inject store into api after it's created
injectStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);