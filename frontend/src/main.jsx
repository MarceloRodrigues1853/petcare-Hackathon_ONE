import React from 'react';
import ReactDOM from 'react-dom/client';

// importa SEUS CSS (exatamente esses nomes/locais)
import './components/Layout.css';
import './App.css';
import './styles.css';
import './index.css';
import './tailwind.css';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
