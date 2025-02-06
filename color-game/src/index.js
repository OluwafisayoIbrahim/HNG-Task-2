import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import GoogleFontLoader from 'react-google-font-loader'; 

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <GoogleFontLoader
      fonts={[
        {
          font: 'Press Start 2P',
          weights: [400],
        },
        {
          font: 'Montserrat',
          weights: [400, 600],
        },
      ]}
    />
    <App />
  </React.StrictMode>
);
