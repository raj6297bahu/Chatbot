import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ChatbotPage from './ChatbotPage';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Determine if we're rendering the chatbot standalone or the full app
const isChatbotOnly = window.location.pathname.endsWith('chatbot.html') || 
                      window.location.href.includes('chatbot.html') || 
                      document.getElementById('chatbot-root') !== null;

// Select the appropriate root element
const rootElement = isChatbotOnly 
  ? document.getElementById('chatbot-root') || document.getElementById('root')
  : document.getElementById('root');

// Get the referrer URL to use as the main site URL for the back button
const mainSiteUrl = window.mainSiteUrl || document.referrer || '/';

// Render the appropriate component
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {isChatbotOnly ? (
        <ChatbotPage mainSiteUrl={mainSiteUrl} />
      ) : (
        <App />
      )}
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 