import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import register from "./components/registerComponent";
import login from "./components/loginComponent";
import dashboard from "./components/dashboardComponent";
import restaurant from "./pages/resDashboard";
import resRegister from "./components/resRegister";
import CARTnORDER from "./pages/cartNorder";
import axios from "axios";
import "./App.css";
import { Footer } from "./components/Elements";

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
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
              <li>
                <Link to={"/"} className="nav-link">
                  Dashboard
                </Link>
              </li>
              {!(localStorage.getItem("isLogged") === "true") && (
                <li>
                  <Link to={"/user/login"} className="nav-link">
                    Login
                  </Link>
                </li>
              )}
              {!(localStorage.getItem("isLogged") === "true") && (
                <li>
                  <Link to={"/user/register"} className="nav-link">
                    Register User
                  </Link>
                </li>
              )}
              {localStorage.getItem("isLogged") === "true" && (
                <li onClick={logout}>Logut</li>
              )}
              {localStorage.getItem("isLogged") === "true" && (
                <li>
                  <Link to={"/restaurant/register"} className="nav-link">
                    Register Restaurant
                  </Link>
                </li>
              )}
              <li>
                <Link to={"/cart"} className="nav-link">
                  Cart
                </Link>
              </li>
            </ul>
          </nav>
          <hr />
          <Switch>
            <Route exact path="/" component={dashboard} />
            <Route exact path="/user/login" component={login} />
            <Route exact path="/user/register" component={register} />
            {/* <Route exact path='/restaurant/:name' component = {restaurant} /> */}
            <Route exact path="/restaurant/register" component={resRegister} />
            <Route exact path="/restaurant/:id" component={restaurant} />
            <Route exact path="/cart" component={CARTnORDER} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
