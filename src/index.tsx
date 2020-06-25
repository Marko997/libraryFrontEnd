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
import { HashRouter, Route, Switch } from 'react-router-dom';
import ContactPage from './components/ContactPage/ConatactPage';
import StudentLoginPage from './components/StudentLoginPage/StudentLoginPage';
import LibrarianLoginPage from './components/LibrarianLoginPage/LibrarianLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import LibrarianDashboard from './components/LibrarianDashboard/LibrarianDashboard';
import LibrarianDashboardCategory from './components/LibrarianDashboardCategory/LibrarianDashboardCategory';
import LibrarianDashboardAuthor from './components/LibrarianDashboardAuthor/LibrarianDashboardAuthor';
import LibrarianDashboardLoan from './components/LibrarianDashboardLoan/LibrarianDashBoardLoan';
import LibrarianDashboardBook from './components/LibrarianDashboardBook/LibrarianDashboardBook';
import LibrarianDashboardPhoto from './components/LibrarianDashboardPhoto/LibrarianDashboardPhoto';
import LoanPage from './components/LoanPage/LoanPage';
import BookPage from './components/BookPage/BookPage';
import LibrarianDashboardReservation from './components/LibrarianDashBoardReservation/LibrarianDashboardReservations';




ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component = { HomePage }/>
        <Route exact path="/contact" component = { ContactPage }/>
        <Route exact path="/loan/" component = { LoanPage }/>
        <Route exact path="/loan/:sId" component = { LoanPage }/>
        <Route exact path="/student/login" component = { StudentLoginPage }/>
        <Route exact path="/librarian/login" component = { LibrarianLoginPage }/>
        <Route exact path="/librarian/dashboard" component = { LibrarianDashboard }/>
        <Route exact path="/librarian/dashboard/category" component = { LibrarianDashboardCategory }/>
        <Route exact path="/librarian/dashboard/author" component = { LibrarianDashboardAuthor }/>
        <Route exact path="/librarian/dashboard/loan" component = { LibrarianDashboardLoan }/>
        <Route exact path="/librarian/dashboard/book" component = { LibrarianDashboardBook }/>
        <Route exact path="/librarian/dashboard/reservation" component = { LibrarianDashboardReservation }/>
        <Route exact path="/librarian/dashboard/photo/:bId" component = { LibrarianDashboardPhoto }/>
        <Route exact path="/category/:id" component = { CategoryPage }/>
        <Route exact path="/book/:id" component = { BookPage }/>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
