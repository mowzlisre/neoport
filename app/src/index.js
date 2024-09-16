import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter, Routes, Route } from "react-router-dom";
import CSVUpload from './Components/Screens/CSVUpload';
import Analyse from './Components/Screens/Analyse';
import { Provider } from 'react-redux';
import store from './redux/store';
import WelcomeScreen from './Components/Screens/WelcomeScreen';
import NewProject from './Components/Screens/NewProject';
import UpdateDataSource from './Components/Screens/UpdateDataSource';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ChakraProvider>
        <HashRouter>
          <Routes>
            {/* <Route path='/' element={<Welcome />} /> */}
            <Route path='/prompt' element={<WelcomeScreen />} />
            <Route path='/newproject' element={<NewProject />} />
            <Route path='/updatedatasource' element={<UpdateDataSource />} />
            <Route path="/app" element={<Analyse />} />
          </Routes>
        </HashRouter>
    </ChakraProvider>
  </Provider>
);
reportWebVitals();
