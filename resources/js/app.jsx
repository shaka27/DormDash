
import './bootstrap'; // Laravel default
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

console.log("✅ app.js is loaded");


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob('./pages/**/*.{jsx,tsx}', { eager: true });

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const normalizedName = `./pages/${name}.jsx`;
    const tsxName = `./pages/${name}.tsx`;

    if (pages[normalizedName]) return pages[normalizedName];
    if (pages[tsxName]) return pages[tsxName];

    throw new Error(`❌ Page not found: ${name}`);
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
