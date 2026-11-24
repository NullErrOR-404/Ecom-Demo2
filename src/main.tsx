import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { DemoStoreProvider } from './store/demoStore';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoStoreProvider>
      <App />
    </DemoStoreProvider>
  </StrictMode>
);
