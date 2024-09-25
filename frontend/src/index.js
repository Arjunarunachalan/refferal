import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketProvider } from './Contexts/socketContext';
import { UserContextProvider } from './Contexts/UserContext';
import "./i18n.js"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <SocketProvider>
        <React.Suspense fallback='loading....'>
        <App />
        </React.Suspense>
    
      </SocketProvider>
    </UserContextProvider>
  </React.StrictMode>
);