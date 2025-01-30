import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from 'react-redux';
import store from './redux/store';
import PreCheck from './Components/Screens/Precheck';
import WelcomeScreen from './Components/Screens/WelcomeScreen';
import NewProject from './Components/Screens/NewProject';
import UpdateDataSource from './Components/Screens/UpdateDataSource';
import Analyse from './Components/Screens/Analyse';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ChakraProvider>
      <HashRouter>  {/* ✅ Make sure to use HashRouter here! */}
        <Routes>
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
