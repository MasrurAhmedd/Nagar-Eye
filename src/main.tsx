import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for installability and offline support
registerSW({
  immediate: true,
  onNeedRefresh() {},
  onOfflineReady() {
    console.log('NAGAR-EYE is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
