import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import register from './components/registerComponent'
import login from  './components/loginComponent'
import home from './components/homeComponenet'
import dashboard from  './components/dashboardComponent'
import restaurant from  './components/restaurantComponent'
import resRegister from './components/resRegister'

import logo from './components/images/logoSVG.svg';
import './App.css';
import BrowseBtn, { Footer } from './components/Elements';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
            <div className="logo"><Link to='/'><img src={logo}/></Link></div>
            <ul className="">
             
              {/* <li><Link to ={'/'} className="nav-link">Home</Link></li> */}
              <li><Link to ={'/dashboard'} className="nav-link">Browse</Link></li>
              <li><Link to ={'/user/login'} className="nav-link">Login</Link></li>
              {/* <li><Link to ={'/user/register'} className="nav-link">Register User</Link></li> */}
              
            </ul>
        </nav>
        
        <Switch>
          <Route exact path='/' component = {home} />
          <Route exact path='/dashboard' component = {dashboard} />
          <Route exact path='/user/login' component={login} />
          <Route exact path='/user/register' component={register} />
          {/* <Route exact path='/restaurant/:name' component = {restaurant} /> */}
          <Route exact path='/restaurant/register' component = {resRegister} />
          <Route exact path='/restaurant/:id' component = {restaurant} />
        </Switch>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
