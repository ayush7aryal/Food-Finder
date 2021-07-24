import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";

const Order = () => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    axios.get("http://localhost:5000/user/getOrder", config).then((res) => {
      const temp_data = res.data.order;
      const temp_order = order;
      if (temp_data.order !== temp_order) {
        setOrder(temp_data.order);
      }
    });
  });

  const cancelOrder =(index)=>{
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    const temp = [...order];
    axios.post("http://localhost:5000/user/cancel",{
      order: temp, 
      index
    },config).then((res)=>{
      console.log(res.data);
    })
  }

  const renderItems = () => {
    if (order[0] !== undefined || order[0] || order[0] !== null) {
      var items = order.map((result, index) => (
        <div key={"0" + index} className="order user_order">
          <Image
            key={index}
            cloudName="foodfinder"
            publicId={result.menu.image}
            height="150"
            crop="scale"
          />

          <div className="order_desc">
            <div id="bar"></div>
            <div className="desc">
              <h3>{result.restaurant.name}</h3>
              <label>{result.menu.title}</label>
              <label>{result.menu.description}</label>
              <label>{result.menu.price}</label>
              <label>Quantity: {result.quantity}</label>
              <label>
                Total: Rs.{parseInt(result.menu.price, 10) * result.quantity}
              </label>
              <label>Status: {result.status}</label>
            </div>
            {result.status==="Pending" && (<div onClick = {()=>{
              cancelOrder(index);
            }} className="order_tab_active for_button">
            Cancel
          </div>)}
          </div>
        </div>
      ));
      return <>{items}</>;
    } else {
      items = () => {
        return (
          <div className="items">
            Nothing Ordered till now?? Order easily and reliably on this
            website. :)
          </div>
        );
      };
      return <>{items}</>;
    }
  };

  return <div>{renderItems()}</div>;
};

export default Order;
