import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";
import Map from "./mapComponent";
import "../css_styles/orderStyle.css";
import "../css_styles/popDialog.css";

const ResOrder = () => {
  var [orderList, setList] = useState([]);
  const [tabToggle, setTab] = useState("Pending");
  const [popActive, setPop] = useState(false);
  const [popMap, setPopMap] = useState(-1);

  useEffect(() => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    axios
      .get("https://food-finder-jade.vercel.app/restaurant/get/order", config)
      .then((res) => {
        var t = res.data.orderList;
        var temp = orderList;

        if (t !== temp) {
          setList(t);
        }
      });
    return;
  });

  const popClose = () => {
    setPop(false);
    setPopMap(-1);
  };

  const userInfo = (result) => {
    return (
      <>
        <div
          className={
            popActive ? "pop-dialog-parent active" : "pop-dialog-parent"
          }
          id="pop-dialog">
          <div className="pop-header">
            <div className="pop-title">DELIVERY LOCATION</div>
            <button onClick={popClose} className="pop-close">
              &times;
            </button>
          </div>
          <div className="pop-body flex-pop">
            <div className="popBody-info" style={{ minWidth: "600px" }}>
              <Map sendLocation={(e) => {}} getty={result.location} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "20px",
                  fontWeight: "650",
                }}>
                <label>
                  Name: {result.user.firstName} {result.user.lastName}
                </label>
                <label>Email: {result.user.email}</label>
                <label>Phone: {result.user.phone}</label>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={popClose}
          className={popActive ? "overlay active" : "overlay"}></div>
      </>
    );
  };

  const order = (index, e) => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    console.log(e.target.value);
    orderList[index].status = e.target.value;
    axios.post(
      "https://food-finder-jade.vercel.app/restaurant/updateOrder",
      {
        email: [orderList[index].user.email],
        orderList,
      },
      config
    );
  };

  const allClick = async (e) => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const email = [];
    for (var i = 0; i < orderList.length; i++) {
      email.push(orderList[i].user.email);
      if (orderList[i].status === "Pending") {
        orderList[i].status = e.target.value;
      }
    }
    await axios.post(
      "https://food-finder-jade.vercel.app/restaurant/updateOrder",
      {
        email: email,
        orderList,
      },
      config
    );
  };

  const renderOrders = () => {
    const filtered = orderList.filter((result) => {
      if (result.status === tabToggle) return true;
      return false;
    });
    const orders = filtered.map((result, index) => {
      return (
        <>
          <div
            style={{ cursor: "pointer" }}
            key={index + "key"}
            className="order">
            <div className="orderInfos">
              <Image
                key={index}
                cloudName="foodfinder"
                publicId={result.menu.image}
                height="150"
                width="200"
                crop="scale"
              />
              <div
                onClick={() => {
                  setPop(true);
                  setPopMap(index);
                }}
                className="orderInfo">
                <label>Title: {result.menu.title}</label>
                <br />
                <label>Quantity: {result.quantity}</label>
                <br />
                <label>Total: {result.menu.price}</label>
                <br />
                {/* add the ordered date-time too */}
              </div>
            </div>

            {tabToggle === "Pending" && (
              <div
                className="btns"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "25px",
                }}>
                <button
                  style={{
                    border: "none",
                    fontWeight: "700",
                    marginBottom: "10px",
                    background: "none",
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px",
                    borderRadius: "24px",
                  }}
                  value="Accepted"
                  onClick={(e) => {
                    order(index, e);
                  }}>
                  Accept Order
                </button>
                <button
                  style={{
                    border: "none",
                    fontWeight: "700",
                    background: "none",
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px",
                    borderRadius: "24px",
                  }}
                  value="Rejected"
                  onClick={(e) => {
                    order(index, e);
                  }}>
                  Reject Order
                </button>
              </div>
            )}
          </div>
          {popActive && (popMap == index) && userInfo(result)}
        </>
      );
    });
    return <div className="orders">{orders}</div>;
  };

  return (
    <div className="order_page">
      <div className="order_tab_parent">
        <div className="order_ul">
          <div
            onClick={() => {
              setTab("Pending");
            }}
            className={
              tabToggle === "Pending" ? "order_tab_active" : "order_tab"
            }>
            Pending
          </div>
          <div
            onClick={() => {
              setTab("Accepted");
            }}
            className={
              tabToggle === "Accepted" ? "order_tab_active" : "order_tab"
            }>
            Accepted
          </div>
          <div
            onClick={() => {
              setTab("Rejected");
            }}
            className={
              tabToggle === "Rejected" ? "order_tab_active" : "order_tab"
            }>
            Rejected
          </div>
          <div
            onClick={() => {
              setTab("Delivered");
            }}
            className={
              tabToggle === "Delivered" ? "order_tab_active" : "order_tab"
            }>
            Delivered
          </div>
        </div>
      </div>
      {renderOrders()}
      {tabToggle === "Pending" && (
        <div style={{ display: "flex", margin: "15px 50px" }}>
          <button
            style={{
              border: "none",
              minWidth: "100px",
              fontWeight: "700",
              marginRight: "15px",
              background: "none",
              backgroundColor: "green",
              color: "white",
              padding: "10px",
              borderRadius: "24px",
            }}
            value="Accepted"
            onClick={allClick}>
            Accept All
          </button>

          <button
            style={{
              border: "none",
              minWidth: "100px",
              fontWeight: "700",
              background: "none",
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              borderRadius: "24px",
            }}
            value="Rejected"
            onClick={allClick}>
            Reject All
          </button>
        </div>
      )}
    </div>
  );
};

export default ResOrder;
