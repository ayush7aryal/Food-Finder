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

  useEffect(() => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    axios
      .get("http://localhost:5000/restaurant/get/order", config)
      .then((res) => {
        var t = res.data.orderList;
        var temp = orderList;

        if (t !== temp) {
          setList(t);
        }
      });
    return;
  });

  const popOpen = () => {
    setPop(true);
  };
  const popClose = () => {
    setPop(false);
  };

  const userInfo = (result) => {
    return (
      // <div>
      //   <div>
      //     <label>
      //       {result.user.firstName} {result.user.lastName}
      //     </label>
      //     <label>{result.user.email}</label>
      //     <label>{result.user.phone}</label>
      //   </div>
      //   <Map getty={result.location} />
      // </div>
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
            <div className="popBody-info">
              <label>
                {result.user.firstName} {result.user.lastName}
              </label>
              <label>{result.user.email}</label>
              <label>{result.user.phone}</label>
            </div>
            <Map getty={result.location} />
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
      "http://localhost:5000/restaurant/updateOrder",
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
      "http://localhost:5000/restaurant/updateOrder",
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
          <div style={{cursor: 'pointer'}}
            onClick={() => {
              setPop(true);
            }}
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
              <div className="orderInfo">
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
              <div className="btns">
                <button
                  value="Accepted"
                  onClick={(e) => {
                    order(index, e);
                  }}>
                  Accept Order
                </button>
                <button
                  value="Rejected"
                  onClick={(e) => {
                    order(index, e);
                  }}>
                  Reject Order
                </button>
              </div>
            )}
          </div>
          {popActive && userInfo(result)}
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
        <>
          <button value="Accepted" onClick={allClick}>
            Accept All
          </button>
          <br />
          <button value="Rejected" onClick={allClick}>
            Reject All
          </button>
        </>
      )}
    </div>
  );
};

export default ResOrder;
