import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './translate/en.json';
import roTranslation from './translate/ro.json';
import ruTranslation from './translate/ru.json';

import "font-awesome/css/font-awesome.min.css";
import { Provider } from "react-redux";
import store from "./store/index";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
    },
  },
});
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    ro: {
      translation: roTranslation,
    },
    ru: {
      translation: ruTranslation,
    },
  },
  lng: 'en', // Default language
  interpolation: {
    escapeValue: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <CookiesProvider>
    <Provider store={store}>
      <Router>
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </React.StrictMode>
      </Router>
    </Provider>
  </CookiesProvider>
);
