import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {NextUIProvider} from "@nextui-org/react";
import reportWebVitals from './reportWebVitals';
import AuthContextProvider from './Context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';


const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<NextUIProvider>
  <AuthContextProvider>
    <QueryClientProvider  client={queryClient}>
    <App />
    </QueryClientProvider>
    </AuthContextProvider>
    </NextUIProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
