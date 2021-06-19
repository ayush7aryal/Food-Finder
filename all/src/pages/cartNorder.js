import React, { useState } from "react";
import Order from "../components/orderComponent";
import Cart from "../components/cartComponent";
import "../css_styles/tabs.css"

const CARTnORDER = () => {
  var [comp, setComp] = useState(true);
  var logged = localStorage.getItem("isLogged");

  return (
    <>
      <div className="tabs">
        <div
        className={comp?'tab tab-active': 'tab'}
          onClick={() => {
            setComp(true);
          }}>
          Cart
        </div>
        {logged === "true" && (
          <div
          className={!comp? 'tab tab-active': 'tab'}
            onClick={() => {
              setComp(false);
            }}>
            Order
          </div>
        )}
      </div>

      {!comp && <Order />}
      {comp && <Cart />}
    </>
  );
};

export default CARTnORDER;
