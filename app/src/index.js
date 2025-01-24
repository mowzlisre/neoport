import { ChakraProvider } from "@chakra-ui/react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from "react-router-dom";
import Analyse from './Components/Screens/Analyse';
import NewProject from './Components/Screens/NewProject';
import PreCheck from './Components/Screens/Precheck';
import UpdateDataSource from './Components/Screens/UpdateDataSource';
import WelcomeScreen from './Components/Screens/WelcomeScreen';
import './index.css';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ChakraProvider>
      <HashRouter>
        <Routes>
          {/* Uncomment or modify this route if needed */}
          {/* <Route path='/' element={<Welcome />} /> */}
          <Route path="/precheck" element={<PreCheck onReady={() => window.ipcRenderer.send('proceedAfterPreCheck')} />} />
          <Route path="/prompt" element={<WelcomeScreen />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/updatedatasource" element={<UpdateDataSource />} />
          <Route path="/app" element={<Analyse />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  </Provider>
);

