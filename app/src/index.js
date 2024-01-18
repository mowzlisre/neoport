import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Welcome from './Components/Screens/Welcome';
import CSVUpload from './Components/Screens/CSVUpload';
import Analyse from './Components/Screens/Analyse';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ChakraProvider>
        <HashRouter>
          <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path='/upload' element={<CSVUpload />} />
            <Route path='/analyse' element={<Analyse />} />
          </Routes>
        </HashRouter>
    </ChakraProvider>
  </Provider>
);
reportWebVitals();
