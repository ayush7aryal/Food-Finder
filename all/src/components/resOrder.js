import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";
import "../css_styles/orderStyle.css";

const ResOrder = () => {
  var [orderList, setList] = useState([]);

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

  const userInfo = (result) => {
    return (
      <div>
        <label>
          {result.user.firstName} {result.user.lastName}
        </label>
        <label>{result.user.email}</label>
        <label>{result.user.phone}</label>
      </div>
    );
  };

  const accept = (index)=>{
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    orderList[index].status = 'Accepted';
    axios.post('http://localhost:5000/restaurant/updateOrder',{
      email: orderList[index].user.email,
      orderList
    },config)
  }

  const reject = (index)=>{
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    orderList[index].status = 'Rejected';
    axios.post('http://localhost:5000/restaurant/updateOrder',{
      email: orderList[index].user.email,
      orderList
    },config)
  }

  const renderOrders = () => {
    const orders = orderList.map((result, index) => {
      return (
        <div key={index + "key"} className="order">
          <Image
            key={index}
            cloudName="foodfinder"
            publicId={result.menu.image}
            height="150"
            width="200"
            crop="scale"
          />
          <div className="orderInfos">
            <label id={index + "status"}>{result.status}</label>
            <label>Title: {result.menu.title}</label>
            <br />
            <label>Quantity: {result.quantity}</label>
            <br />
            <label>Total: {result.menu.price}</label>
            <br />
            {/* add the ordered date-time too */}
          </div>
          <div className="btns">
            <button onClick={()=>{accept(index)}}>Accept Order</button>
            <br />
            <button>Reject Order</button>
          </div>
        </div>
      );
    });

    return <div className="orders">{orders}</div>;
  };

  return (
    <div>
      Order
      {renderOrders()}
      <button>Accept All</button>
      <br />
      <button>Reject All</button>
    </div>
  );
};

export default ResOrder;
