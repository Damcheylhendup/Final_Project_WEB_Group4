import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1002217351592-vn3bkq5shmrojnfpgqm28vern5llq566.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);