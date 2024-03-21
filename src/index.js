import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux';
import { RouterProvider, HashRouter  } from 'react-router-dom'
import router from "./router"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);
