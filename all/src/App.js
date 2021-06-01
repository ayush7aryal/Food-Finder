import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import register from './components/registerComponent'
import login from  './components/loginComponent'
import home from './components/homeComponenet'
import dashboard from  './components/dashboardComponent'
import restaurant from  './components/restaurantComponent'
import resRegister from './components/resRegister'
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
            <li><Link to ={'/'} className="nav-link">Home</Link></li>
              <li><Link to ={'/dashboard'} className="nav-link">Dashboard</Link></li>
              <li><Link to ={'/user/login'} className="nav-link">Login</Link></li>
              <li><Link to ={'/user/register'} className="nav-link">Register User</Link></li>
              <li><Link to ={'/restaurant/register'} className="nav-link">Register Restaurant</Link></li>
              
            </ul>
        </nav>

        <hr />
        
        <Switch>
          <Route exact path='/' component = {home} />
          <Route exact path='/dashboard' component = {dashboard} />
          <Route exact path='/user/login' component={login} />
          <Route exact path='/user/register' component={register} />
          {/* <Route exact path='/restaurant/:name' component = {restaurant} /> */}
          <Route exact path='/restaurant/register' component = {resRegister} />
          <Route exact path='/restaurant/:id' component = {restaurant} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
