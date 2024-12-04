import { StrictMode } from 'react';
import App from './app/App.tsx';
import { AuthProvider, ThemeProvider } from '@common';
import { createRoot } from 'react-dom/client';

import '@styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
