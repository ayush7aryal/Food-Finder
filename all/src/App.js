import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import register from "./components/registerComponent";
import login from "./components/loginComponent";
import home from './components/homeComponenet'
import dashboard from "./components/dashboardComponent";
import restaurant from "./pages/resDashboard";
import resRegister from "./components/resRegister";
import CARTnORDER from "./pages/cartNorder";
import axios from "axios";
import "./App.css";
import { Footer } from "./components/Elements";
import logo from './components/images/logoSVG.svg';

const refresh = async () => {
  const config = {
    withCredentials: true,
  };

  await axios
    .get("http://localhost:5000/user/refreshToken", config)
    .then((res) => {
      if (res.data.accesstoken !== null) {
        localStorage.setItem("token", res.data.accesstoken);
      } else {
        console.log(res);
      }
    });
};

function App() {
  // const [userId, setUserId] = useState('');
  if (localStorage.getItem("isLogged") !== "false") {
    refresh();
    setInterval(async function () {
      refresh();
    }, 1000 * 60 * 60 * 12); //after 12 hrs
  }

  const logout = async () => {
    await axios
      .get("http://localhost:5000/user/logout", { withCredentials: true })
      .then((res) => {
        localStorage.removeItem("token");
      });
    localStorage.setItem("isLogged", "false");
    window.location.href = "/";
    clearInterval();
  };

  return (
    <>
      <Router>
      <div className="App">
          <nav className="navbar">
            <div className="logo"><Link to='/'><img alt="" src={logo}/></Link></div>
            <ul className="">
              <li>
                <Link to={"/cart"}>
                  Cart
                </Link>
              </li>
              <li><Link to ={'/dashboard'} >Browse</Link></li>
              {!(localStorage.getItem("isLogged") === "true") && (
                <li>
                  <Link to={"/user/login"}>
                    Login
                  </Link>
                </li>
              )}
              {localStorage.getItem("isLogged") === "true" && (
                <li onClick={logout}>Logut</li>
              )}
              
          </ul>
          </nav>
          <Switch>
          <Route exact path='/' component = {home} />
            <Route exact path="/dashboard" component={dashboard} />
            <Route exact path="/user/login" component={login} />
            <Route exact path="/user/register" component={register} />
            {/* <Route exact path='/restaurant/:name' component = {restaurant} /> */}
            <Route exact path="/restaurant/register" component={resRegister} />
            <Route exact path="/restaurant/:id" component={restaurant} />
            <Route exact path="/cart" component={CARTnORDER} />
          </Switch>
          <Footer />
        </div>
        
      </Router>
    </>
  );
}

export default App;