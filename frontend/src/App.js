import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import MainPage from './MainPage';
import DownloadPage from './DownloadPage';


function App() {
  return (
      <Router>
        <Route path="/" exact component={MainPage}/>
        <Route path="/download" component={DownloadPage}/>
      </Router>
  );
}

export default App;
