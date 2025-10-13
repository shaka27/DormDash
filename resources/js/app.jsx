import './bootstrap'; // Laravel default
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
import './axiosSetup';

console.log("✅ app.js is loaded");


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = import.meta.glob('./pages/**/*.{jsx,tsx}', { eager: true });

// send cookies for Laravel session / Sanctum
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// attach CSRF token (blade should include <meta name="csrf-token" content="{{ csrf_token() }}">)
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export default axios;

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
