/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    // Add other env variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
    glob<T = any>(
        pattern: string,
        options?: {
            eager?: boolean
            import?: string
            as?: string
        }
    ): Record<string, T | (() => Promise<T>)>
}

import axios from '../axiosSetup'; // adjust path if needed

// send cookies for Laravel session / Sanctum
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// attach CSRF token meta if present (fallback)
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// replace your fetchNotificationCount with:
const fetchNotificationCount = async () => {
  try {
    // ensure CSRF cookie is present (optional safety)
    await axios.get('/sanctum/csrf-cookie');

    const res = await axios.get('/api/notifications/count');
    setNotificationCount(res.data.count ?? 0);
  } catch (err) {
    // unauthenticated -> show 0 and don't spam console
    if (err?.response?.status === 401) {
      setNotificationCount(0);
      return;
    }
    console.error('Error fetching notification count:', err);
  }
};

export default axios;