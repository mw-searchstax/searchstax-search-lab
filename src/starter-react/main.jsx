import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchApp from './SearchApp.jsx';
import '../search.css';

createRoot(document.getElementById('root')).render(<SearchApp />);
