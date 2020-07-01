import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import Login from './components/Login/Login';
import PrivateRoute from './routes/PrivateRoute';
import Poster from './components/Poster/Poster';
import {axiosAuth} from "./api/api";
import css from "./App.module.css";
import Reg from './components/Reg/Reg';

const img = require("./assets/Brend.png");

const auth = () => {
  const res = axiosAuth.get('/user/current_user/')
  .then(response => {
    if(response.status === 200) {return true}
    else return false
  })
  .catch(err => false)
  return res
}

const App = () => (
  <div className={css.app}>
    <div className={css.header}>
        <img src={img}/>
    </div>
    <div className={css.content}>
      <Switch>
        <Route exact path={"/login/"} component={Login}/>
        <PrivateRoute path={"/post_parser/"} auth={auth} component={Poster}/>
        <Route exact path={"/signup/"} component={Reg}/>
        <Route path={"/"} component={Login}/>
      </Switch>
    </div>
    <div className={css.footer}>
        <span>ПОИСК</span><span className={css.s}>КЛИЕНТОВ</span>
    </div>
  </div>
);

export default App;
