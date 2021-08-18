import React,{useState} from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import register from "./components/registerComponent";
import login from "./components/loginComponent";
import home from './components/homeComponenet'
import dashboard from "./components/dashboardComponent";
import restaurant from "./pages/resDashboard";
import resRegister from "./components/resRegister";
import CARTnORDER from "./pages/cartNorder";
import AdminPage from "./pages/adminPage";
import axios from "axios";
import "./App.css";
import { Footer } from "./components/Elements";
import logo from './components/images/logoSVG.svg';
import cart from './components/images/shopping-cart.svg';





function App() {
    const [role,setRole] =  useState(-1); 
    const refresh = async () => {
      const config = {
        withCredentials: true,
      };

      await axios
        .get("http://localhost:5000/user/refreshToken", config)
        .then((res) => {
          if (res.data.accesstoken !== null) {
            setRole(res.data.user.role);
            localStorage.setItem("token", res.data.accesstoken);
          } else {
            console.log(res);
          }
        });
    };


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
              
              {(role === -2 && localStorage.getItem("isLogged") === "true") && <Link to = {'/admin'} className = "link" 
                style={{width: 175, alignItems: "center", color: "#000000"}}>
                 Admin-Panel </Link>}

                <Link to ={'/dashboard'} className="link">Browse</Link>
              {!(localStorage.getItem("isLogged") === "true") && (
                  <Link to={"/user/login"} className="link">Login</Link>
              )}
              {localStorage.getItem("isLogged") === "true" && (
                <Link onClick={logout} className="link">Logout</Link>
              )}
              {(role !== -2) && <Link to={"/cart"} className="cart">
              <svg height="512pt" viewBox="0 -31 512.00026 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m164.960938 300.003906h.023437c.019531 0 .039063-.003906.058594-.003906h271.957031c6.695312 0 12.582031-4.441406 14.421875-10.878906l60-210c1.292969-4.527344.386719-9.394532-2.445313-13.152344-2.835937-3.757812-7.269531-5.96875-11.976562-5.96875h-366.632812l-10.722657-48.253906c-1.527343-6.863282-7.613281-11.746094-14.644531-11.746094h-90c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h77.96875c1.898438 8.550781 51.3125 230.917969 54.15625 243.710938-15.941406 6.929687-27.125 22.824218-27.125 41.289062 0 24.8125 20.1875 45 45 45h272c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15h-272c-8.269531 0-15-6.730469-15-15 0-8.257812 6.707031-14.976562 14.960938-14.996094zm312.152343-210.003906-51.429687 180h-248.652344l-40-180zm0 0"/><path d="m150 405c0 24.8125 20.1875 45 45 45s45-20.1875 45-45-20.1875-45-45-45-45 20.1875-45 45zm45-15c8.269531 0 15 6.730469 15 15s-6.730469 15-15 15-15-6.730469-15-15 6.730469-15 15-15zm0 0"/><path d="m362 405c0 24.8125 20.1875 45 45 45s45-20.1875 45-45-20.1875-45-45-45-45 20.1875-45 45zm45-15c8.269531 0 15 6.730469 15 15s-6.730469 15-15 15-15-6.730469-15-15 6.730469-15 15-15zm0 0"/></svg>
              </Link>}
              
          </ul>
          
          </nav>
          <hr/>
          <Switch>
          <Route exact path='/' component = {home} />
            <Route exact path="/dashboard" component={dashboard} />
            <Route exact path="/user/login" component={login} />
            <Route exact path="/user/register" component={register} />           
            <Route exact path="/restaurant/register" component={resRegister} />
            <Route exact path="/restaurant/:id" component={restaurant} />
            <Route exact path="/cart" component={CARTnORDER} />
            <Route exact path="/admin" component={AdminPage} />
          </Switch>
          {(role !== -2) && <Footer />}
        
        </div>
        
      </Router>
    </>
  );
}

export default App;