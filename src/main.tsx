import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { AppProvider } from './app/provider';
import outputs from '../amplify_outputs.json';
import './index.css';

// Configure Amplify with the outputs file
// Note: Run `npx ampx sandbox` to generate proper configuration
Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);
