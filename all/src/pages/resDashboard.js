import React, { useState } from "react";
import RestaurantInfo from "../components/restaurantComponent";
import Order from "../components/resOrder";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Restaurant = () => {
  const [toggle, setToggle] = useState(true);
  let { id } = useParams();
  const [role, setRole] = useState(-1);

  useEffect(() => {
    const config = {
      withCredentials: true,
    };
    if (localStorage.getItem("isLogged") === "true") {
      axios
        .get("http://localhost:5000/user/refreshToken", config)
        .then((res) => {
          setRole(res.data.user.role);
        });
    }
  });

  const TabsRender = () => {
    if (role == id) {
      return (
        <div className="tabs_container">
          <ul className="tabs">
            <li
              className={toggle ? "tab tab-active" : "tab"}
              onClick={() => {
                setToggle(true);
              }}
            >
              Info
            </li>
            <li
              className={toggle ? "tab" : "tab  tab-active"}
              onClick={() => {
                setToggle(false);
              }}
            >
              Order
            </li>
          </ul>
        </div>
      );
    }
    return <></>;
  };

  return (
    <>
      <TabsRender />
      <div className="pages">
        {toggle && <RestaurantInfo id={id} />}
        {!toggle && <Order />}
      </div>
    </>
  );
};

export default Restaurant;
