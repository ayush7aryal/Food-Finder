import { useState, useEffect } from "react";
// import axios from "axios";
import axios from '../api/instance';
import { Image } from "cloudinary-react";
import "../css_styles/similarsStyle.css";
import Map from "./mapComponent";
import "../css_styles/popDialog.css";

var cart_items = () => {
  if (
    sessionStorage.getItem("cart") &&
    localStorage.getItem("isLogged") !== "true"
  ) {
    console.log(JSON.parse(sessionStorage.getItem("cart")));
    return JSON.parse(sessionStorage.getItem("cart"));
  } else {
    return [];
  }
};

const Cart = () => {
  const [cart, setCart] = useState(cart_items);
  const [total, setTotal] = useState([]);
  const [order, setOrder] = useState([]);
  var [dLoc, setLocation] = useState({});
  const [tempLoc, setTempLoc] = useState({});
  const [popActive, setPop] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLogged") === "true") {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      axios
        .get(
          "/user/info",
          { withCredentials: true },
          config
        )
        .then((res) => {
          var cart_temp = res.data.cart;
          var loc = res.data.dLoc;
          setLocation(loc);
          setCart(cart_temp);
          console.log(cart_temp);
          var i = 0;
          var t = [];
          for (i = 0; i < cart_temp.length; i++) {
            t[t.length] = 1;
          }
          setTotal(t);
        })
        .catch((err) => console.log(err));
    } else {
      console.log(cart);
      var i = 0;
      var t = [];
      for (i = 0; i < cart.length; i++) {
        t[t.length] = 1;
      }
      setTotal(t);
    }
  }, []);

  const subtract = (index) => {
    var temp = [...total];
    if (temp[index] > 1) temp[index]--;
    setTotal(temp);
  };

  const add = (index) => {
    var temp = [...total];
    temp[index]++;
    setTotal(temp);
  };

  const remove = async (index) => {
    console.log(index);
    var temp = [...cart];
    var cart_removed = temp.splice(index, index + 1);
    setCart(temp);
    if (localStorage.getItem("isLogged") !== "true") {
      sessionStorage.setItem("cart", JSON.stringify(temp));
    } else {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.post(
        "/user/changeCart",
        {
          cart: temp,
        },
        { withCredentials: true },
        config
      );
    }
    console.log("cart removed: ", cart_removed);
    return { cart_removed };
  };

  const sendLocation = (location) => {
    setTempLoc({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log("temp temp loc: ", tempLoc);
  };

  const setLoc = async () => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    console.log("temp Loc: ", tempLoc);
    const tLoc = { ...tempLoc };

    setLocation(tLoc);
    setPop(false);
    await axios.post(
      "/user/update",
      {
        dLoc,
      },
      config,
      { withCredentials: true }
    );
  };

  const askLocation = async () => {
    setPop(true);
  };

  const popClose = async () => {
    setPop(false);
  };

  const give_order = async (index) => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };

    var ordered = await remove(index);
    var ordered_item = [...order];
    ordered_item.push({
      ordered: ordered.cart_removed[0],
      quantity: total[index],
    });

    setOrder(ordered_item);
    console.log(ordered_item);
    await axios
      .post(
        "/user/order",
        {
          ordered_item,
        },{withCredentials: true,},
        config
      )
      .then((res) => {
        console.log(res);
      });
  };
  const orderAll = async () => {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    var temp_order = [...cart];
    var temp_ordered_item = [...order];

    var ordered_item = temp_ordered_item.map((result, index) => {
      return result;
    });

    temp_order.map((result, index) => {
      ordered_item.push({
        ordered: result,
        quantity: total[index],
      });
      return 0;
    });

    setOrder(ordered_item);
    setCart([]);

    await axios
      .post(
        "/user/order",
        {
          ordered_item,
        },{withCredentials: true,},
        config
      )
      .then((res) => {
        console.log(res);
      });
  };

  const renderCart = (total) => {
    if (!cart[0]) {
      return (
        <div style={{ fontSize: "20px", textAlign: "center" }}>
          Nothing in the cart. Menus will be shown after they are added to the
          cart!
        </div>
      );
    }
    const menus = cart.map((result, index) => {
      return (
        <div key={"0" + index} className="container">
          {/*Change this &times to gps button */}
          <div>
            <div onClick={askLocation} className="locBtn">
              &times;
            </div>
            <Image
              style={{ minWidth: "200px" }}
              key={index}
              cloudName="foodfinder"
              publicId={result.menu.image}
              height="150"
              crop="scale"
            />
            <div className="labels">
              <label>{result.menu.title}</label> <br />
              {/* <label>{result.menu.description}</label> <br /> */}
              <label>Price: {result.menu.price}</label> <br />
            </div>
            <div>
              <button key={"btn" + index} onClick={() => subtract(index)}>
                -
              </button>
              {total[index]}
              <button onClick={() => add(index)}>+</button>
            </div>
            Price: {result.menu.price * total[index]}
          </div>
          <button onClick={() => remove(index)}>Remove from Cart</button>
          <button
            onClick={() => {
              if (!dLoc) {
                askLocation();
              } else {
                give_order(index);
              }
            }}
          >
            Order
          </button>
        </div>
      );
    });

    return <div className="Menu">{menus}</div>;
  };

  return (
    <div style={{ minHeight: "500px" }}>
      {renderCart(total)}
      {cart[0] && <button onClick={() => orderAll()}>Order All</button>}
      <div
        className={popActive ? "pop-dialog-parent active" : "pop-dialog-parent"}
        id="pop-dialog"
      >
        <div className="pop-header">
          <div className="pop-title">DELIVERY LOCATION</div>
          <button onClick={popClose} className="pop-close">
            &times;
          </button>
        </div>
        <div className="pop-body mapBody">
          <Map sendLocation={sendLocation} />
        </div>
        <div onClick={setLoc} className="pop-setBtn">
          Set Location
        </div>
      </div>
      <div
        onClick={popClose}
        className={popActive ? "overlay active" : "overlay"}
      ></div>
    </div>
  );
};

export default Cart;
