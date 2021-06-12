import React, { useState } from "react";
import Order from "../components/orderComponent";
import Cart from "../components/cartComponent";

const CARTnORDER = () => {
  var [comp, setComp] = useState(true);
  var logged = localStorage.getItem('isLogged')

  return (
    <>
        <button onClick={()=>{setComp(true)}}>Cart</button>
        {logged === 'true' && <button onClick={()=>{setComp(false)}}>Order</button>}
      {!comp && <Order />}
      {comp && <Cart />}
    </>
  );
};

export default CARTnORDER;
