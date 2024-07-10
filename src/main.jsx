import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './Context/AuthContext.jsx';
import { ChatContextProvider } from './Context/ChatContent.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        {/* Assuming user information is required for ChatContextProvider, wrap it inside AuthContextProvider */}
        <AuthContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </AuthContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
