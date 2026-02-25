import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Tabs from './components/guest/Tabs/Tabs';


const initialOptions = {
  "client-id": "CLIENT_ID_Password"   // sandbox/demo client id
  
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <App />
    
    </PayPalScriptProvider>
  </React.StrictMode>
);

reportWebVitals();
