import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const entryElement = document.getElementById('root');
if (entryElement) {
    const root = createRoot(entryElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}