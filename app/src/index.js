import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from './Components/Screens/Welcome';
import CSVUpload from './Components/Screens/CSVUpload';
import { Provider } from 'react-redux';
import store from './redux/store'
import Analyse from './Components/Screens/Analyse';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ChakraProvider>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Welcome/>} />
            <Route path='/upload' element={<CSVUpload/>} />
            <Route path='/analyse' element={<Analyse/>} />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </ChakraProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
