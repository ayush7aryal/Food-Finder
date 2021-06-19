import React, { useState } from "react";
import RestaurantInfo from "../components/restaurantComponent";
import Order from "../components/resOrder";
import {useParams} from "react-router-dom";

const Restaurant = () => {
  const [toggle, setToggle] = useState(true);
  let {id} = useParams();

  return (
    <>
      <div className="tabs">
        <div
          className={toggle ? "tab tab-active" : "tab"}
          onClick={() => {
            setToggle(true);
          }}>
          Info
        </div>
        <div
          className={!toggle ? "tab tab-active" : "tab"}
          onClick={() => {
            setToggle(false);
          }}>
          Order
        </div>
      </div>
      {toggle && <RestaurantInfo id={id} />}
      {!toggle && <Order />}
    </>
  );
};

export default Restaurant;
