import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

window.Pusher = Pusher;

if (import.meta.env.VITE_PUSHER_APP_KEY) {
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
});

} else {
  // Fallback: create a dummy Echo object if Pusher is disabled
  window.Echo = {
    channel: () => ({ listen: () => {} }),
    private: () => ({ listen: () => {} }),
    public: () => ({ listen: () => {} }),
  }
}