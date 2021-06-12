import { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";

const Order =  () => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    axios.get("http://localhost:5000/user/getOrder", config).then((res) => {
      const temp_order = res.data.order;
      setOrder(temp_order.order);
    console.log('temp order',temp_order)
    });
  }, []);

  const renderItems = () => {
    if (order[0] !== undefined || order[0] || order[0] !== null) {
      var items = order.map((result, index) => (
          <div key={'0'+index} className="items">
            <Image
              key={index}
              cloudName="foodfinder"
              publicId={result.menu.image}
              height="150"
              crop="scale"
            />
            <div className="desc">
              <h3>{result.restaurant.name}</h3>
              <label>Name: {result.menu.title}</label>
              <label>Description: {result.menu.description}</label>
              <label>Price: {result.menu.price}</label>
              <label>Quantity: {result.quantity}</label>
              <label>
                Total: {parseInt(result.menu.price,10) * result.quantity}
              </label>
              <label>Status: {result.status}</label>
            </div>
            <hr/>
          </div>
        )
      );
      return <>{items}</>;
    } else {
      items = () => {
        return (
          <div className="items">
            Nothing Ordered till now?? Order easily and reliably on this website. :)
          </div>
        );
      };
      return <>{items}</>;
    }

    
  };

  return (
    <div>
      <h2>
        <u>Ordered Items</u>
      </h2>
      <hr />
      <div className="items_container">{renderItems()}</div>
    </div>
  );
};

export default Order;
