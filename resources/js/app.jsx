import './bootstrap'; // Laravel default
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

console.log("✅ app.js is loaded");

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});