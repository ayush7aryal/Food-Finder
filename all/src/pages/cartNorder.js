import React, { useState } from "react";
import Order from "../components/orderComponent";
import Cart from "../components/cartComponent";
import "../css_styles/tabs.css";

const CARTnORDER = () => {
  var [comp, setComp] = useState(true);

  return (
    <div>
      <div className="tab_parent">
        <div className="tabs">
          <div
            className={comp ? "tab tab-active" : "tab"}
            onClick={() => {
              setComp(true);
            }}>
            Cart
          </div>
          {localStorage.getItem("isLogged") === "true" && (
            <div
              className={comp ? "tab" : "tab tab-active"}
              onClick={() => {
                setComp(false);
              }}>
              Order
            </div>
          )}
        </div>
      </div>
      <div className="pages">
        {!comp && <Order />}
        {comp && <Cart />}
      </div>
    </div>
  );
};

export default CARTnORDER;
