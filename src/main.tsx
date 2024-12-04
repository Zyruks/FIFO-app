import { StrictMode } from 'react';
import App from './app/App.tsx';
import { AuthProvider, QueueProvider, ThemeProvider } from '@common';
import { createRoot } from 'react-dom/client';

import '@styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueueProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueueProvider>
    </AuthProvider>
  </StrictMode>,
);
