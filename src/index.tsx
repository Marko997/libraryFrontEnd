import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { MainMenu, MainMenuItem } from './components/MainManu/MainMenu';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ContactPage from './components/ContactPage/ConatactPage';
import UserLoginPage from './components/ContactPage/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';

const menuItems = [
  new MainMenuItem("Home","/"),
  new MainMenuItem("Contact","/contact/"),
  new MainMenuItem("Log in", "/student/login"),
];

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items = {menuItems}></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component = { HomePage }/>
        <Route exact path="/contact" component = { ContactPage }/>
        <Route exact path="/student/login" component = { UserLoginPage }/>
        <Route exact path="/category/:id" component = { CategoryPage }/>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
