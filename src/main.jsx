import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from 'react-redux'; // Alias for Redux
import { store } from './redux/store/store.js';
import { Provider as ChakraProvider } from "./components/ui/provider"; // Alias for Chakra or UI provider
import App from "./App";
import './index.css'
import Providers from './Providers';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReduxProvider store={store}>
    <ChakraProvider>
      <BrowserRouter>
      <Providers>
        <App />
      </Providers>
      </BrowserRouter>
    </ChakraProvider>
  </ReduxProvider>
);

