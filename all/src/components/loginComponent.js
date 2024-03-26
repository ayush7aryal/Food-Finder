import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Route, Link } from "react-router-dom";
import "../css_styles/loginComponent.css";

class login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isDisabled: true,
      email: "",
      password: "",
      emailError: false,

      wording: "Show",
      type: "password",
    };
  }

  validateEmail(email) {
    const pattern =
      /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    const result = pattern.test(email);
    if (result === true) {
      this.setState({
        emailError: false,
        email: email,
      });
    } else {
      this.setState({
        emailError: true,
      });
    }
  }

  onChangeEmail(e) {
    e.preventDefault();
    this.validateEmail(e.target.value);
  }

  onChangePassword(e) {
    e.preventDefault();
    this.setState({
      password: e.target.value,
      isDisabled: false,
    });
  }

  changeState() {
    var oldState = this.state.type;
    var isTextOrHide = oldState === "password";
    var newState = isTextOrHide ? "text" : "password";
    var newWord = isTextOrHide ? "Hide" : "Show";
    this.setState({
      type: newState,
      wording: newWord,
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    try {
      await axios(
        {
          method: "post",
          url: "https://food-finder-seven.vercel.app/user/login/",
          data: {
            email: this.state.email,
            password: this.state.password,
          },
        },
        { withCredentials: true }
      ).then((res) => {
        localStorage.setItem("token", res.data.accesstoken);
        localStorage.setItem("isLogged", true);
        Cookies.set("refreshtoken", res.data.refreshtoken, {
          expires: 7,
          path: "/",
        });
        console.log("Logged In successfully");
        if (res.data.role === -2)
          window.location = "https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/admin";
        return res;
      });

      var cart_session = JSON.parse(sessionStorage.getItem("cart"));
      if (cart_session) {
        if (cart_session != []) {
          let config = {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          };
          await axios
            .get("https://food-finder-seven.vercel.app/user/info", config)
            .then((res) => {
              var count = 0;
              var cart = cart_session.filter((result) => {
                var pass = true;
                for (count = 0; count < res.data.cart.length; count++) {
                  if (result === res.data.cart[count]) pass = false;
                }
                return pass;
              });
              console.log(cart);
              axios
                .post(
                  "https://food-finder-seven.vercel.app/user/addCart",
                  {
                    cart,
                  },
                  config
                )
                .then((res) => {
                  console.log(res);
                  sessionStorage.setItem("cart", JSON.stringify([]));
                });
            });
        }
      }
      window.location = "https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/";
    } catch (err) {
      alert(err);
    }
  }

  render() {
    return (
      <div className="formBody">
        <div className="formContainer">
          <form onSubmit={this.onSubmit} className="form">
            <h2>Login </h2>

            <div class="form-control">
              <label>Email</label>
              <input
                type="text"
                onChange={(e) => {
                  this.onChangeEmail(e);
                }}
              />
              {this.state.emailError ? (
                <span style={{ color: "red" }}>
                  Please Enter valid email address. For exampe:test@test.com
                </span>
              ) : (
                ""
              )}
            </div>

            <div class="form-control">
              <label>
                Password
                <input
                  type={this.state.type}
                  onChange={(e) => {
                    this.onChangePassword(e);
                  }}
                />
                <span
                  className="password-trigger"
                  onClick={() => this.changeState()}>
                  {this.state.wording}
                </span>
              </label>
            </div>

            <button type="submit" disabled={this.state.isDisabled}>
              Submit
            </button>

            <div className="signUp">
              <h2>Don't have a Food-Finder account ?</h2>

              <h2>
                <Link to={"/user/register"}>Sign Up now</Link>
              </h2>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default login;
