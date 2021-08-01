import React, { Component } from "react";
import { Image } from "cloudinary-react";
import axios from "axios";
import ScrollMenu from "react-horizontal-scrolling-menu";
import Carousel from "react-material-ui-carousel";
import Map from "./mapComponent";
import "../css_styles/similarsStyle.css";
import "../css_styles/restroStyle.css";
import BrowseBtn from "./Elements.js";
import "../css_styles/restaurant.css";

var location;
class restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Restaurant: {
        id: "",
        name: "",
        email: "",
        description: "",
        contact: "",
        mainPhoto: "",
        category: [],
        menus: [
          {
            title: "",
            description: "",
            image: "",
            price: "",
          },
        ],
        bestSeller: {
          title: "",
          price: "",
          description: "",
          image: "",
        },
        location: {
          latitude: "",
          longitude: "",
        },
      },
      images: [],
      similar: [
        {
          id: "",
          name: "",
          mainPhoto: "",
          location: {
            latitude: "",
            longitude: "",
          },
        },
      ],
      show: 1,
      showBtn: true,
    };
    this.addMenu = this.addMenu.bind(this);
  }

  async addMenu(menu) {
    let config = {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
    var cart_item = {
      menu,
      restaurant: this.state.Restaurant.id,
    };
    var cart = [];

    if (!sessionStorage.getItem("cart"))
      sessionStorage.setItem("cart", JSON.stringify(cart));
    cart = JSON.parse(sessionStorage.getItem("cart"));
    console.log("previous", cart);
    cart[cart.length] = cart_item;
    console.log("before post", cart);

    if (localStorage.getItem("isLogged") !== "true") {
      sessionStorage.setItem("cart", JSON.stringify(cart));
      console.log("Stored in session storage");
    } else {
      axios.post(
        "http://localhost:5000/user/addCart",
        {
          cart: cart_item,
        },
        config
      );
      console.log("Stored in database storage");
    }
  }

  async componentDidMount() {
    try {
      console.log(this.props.id)
      const id = this.props.id;
      //const RestroName= this.state.Restaurant.name;
      await axios({
        method: "get",
        url: `http://localhost:5000/restaurant/${id}`,
      })
        .then((res) => {
          const Restaurant = res.data;

          if (!Restaurant) {
            alert("Could not find the restaurant you are looking for!");
            window.location = "http://localhost:3000/";
          } else {
            this.setState({
              Restaurant: Restaurant,
            });
            location = Restaurant.location;
          }
        })
        .catch((err) => console.error(err));
      await axios({
        method: "get",
        url: `http://localhost:5000/api/images/${id}`,
      })
        .then((res) => {
          const data = res.data;
          console.log(res);
          this.setState({
            images: data,
          });
        })
        .catch((err) => alert(err));

      await axios({
        method: "post",
        url: "http://localhost:5000/restaurant/similar",
        data: {
          id: id,
        },
      })
        .then((res) => {
          const similar = res.data;
          this.setState({
            similar: similar,
          });
        })
        .catch((err) => alert(err));
    } catch (err) {
      alert(err);
    }
  }

  //showMore(){
  //    this.setState((load)=>{
  //const added = this.state.Restaurant.menus.map((count) => { return count = count + 1 }, 0)
  //      return (show = load.show + 2);
  //    });
  //}

  render() {
    const renderCategory = () => {
      const category = this.state.Restaurant.category.map((result, index) => {
        return <div key={result + index}>{result}</div>;
      });
      return (
        <div className="text" style={{ marginLeft: 40, marginTop: 40 }}>
          Category Filters: <div id="small">{category}</div>
        </div>
      );
    };

    const renderSimilar = () => {
      const ren = this.state.similar.map((result, index) => {
        return (
          <div key={result.name + index} className="container">
            <Image
              key={index}
              cloudName="foodfinder"
              publicId={result.mainPhoto}
              height="150"
              crop="scale"
            />
            <div className="labels">
              <label
                className="text"
                style={{ fontSize: 18, fontWeight: "bolder" }}>
                {result.name.toUpperCase()}
              </label>
              <br />
            </div>
          </div>
        );
      });

      const Arrow = ({ text, className }) => {
        return <div className={className}>{text}</div>;
      };

      const ArrowLeft = Arrow({ text: "<", className: "arrowBtn" });
      const ArrowRight = Arrow({ text: ">", className: "arrowBtn" });

      return (
        <div className="arrows">
          <ScrollMenu
            data={ren}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
          />
        </div>
      );
    };

    const renderMenus = () => {
      const menus = this.state.Restaurant.menus
        .slice(0, this.state.show)
        .map((result, index) => {
          return (
            <div
              key={result.title + index}
              className="container"
              id="menuContainer">
              <Image
                key={index}
                cloudName="foodfinder"
                publicId={result.image}
                height="150"
                crop="scale"
              />
              <div className="labels">
                <label
                  className="text"
                  style={{ fontSize: 18, fontWeight: "bolder" }}>
                  {result.title}
                </label>{" "}
                <br />
                <label className="price" style={{ color: "#E75A03" }}>
                  Price: {result.price}
                </label>{" "}
                <br />
                <label
                  className="text"
                  style={{ fontSize: 12, fontStyle: "oblique" }}>
                  {result.description}
                </label>{" "}
                <br />
                <button className="menuBtn" onClick={()=>{this.addMenu(result)}}>Add to Cart</button>
                <br />
              </div>
            </div>
          );
        });

      return <div className="Menu">{menus}</div>;
    };

    const menuButton = () => {
      return <div className="menuTxt">Menu</div>;
    };
    const mapButton = () => {
      return <button className="mapBtn">Directions</button>;
    };

    const renderImages = () => {
      const images = this.state.images.map((result, index) => {
        return (
          <Image
            key={result + index}
            cloudName="foodfinder"
            publicId={result}
            width="1000"
            height="570"
            crop="scale"
          />
        );
      });

      //return (<Carousel slides={images} autoplay={true} interval={1000}/>)
      return (
        <div className="Carousel">
          <Carousel navButtonsAlwaysVisible="true" animation="slide">
            {images}
          </Carousel>
        </div>
      );
    };

    return (
      <div className="body">
        <h1 className="text" style={{ fontSize: 30, marginLeft: 60 }}>
          {this.state.Restaurant.name.toUpperCase()}
        </h1>
        <div className="info">
          <div className="Images">{renderImages()}</div>
          <ul>
                  <li key="contact" className="contacts">
                    Contact: <u>{this.state.Restaurant.contact}</u>
                  </li>
                  <li key="email" className="contacts">
                    {this.state.Restaurant.email}
                  </li>
          </ul>
          <div style={{ marginLeft: 25 }}>{renderCategory()}</div>
          <div className="text" id="description">
            <div style={{ fontSize: 18 }}>Description</div>
            {this.state.Restaurant.description}
          </div>

          {menuButton()}
          <div className="menuComponents">
            {renderMenus()}
            <button
              className="showMoreBtn"
              style={{ fontSize: 14 }}
              onClick={() => {
                this.state.showBtn
                  ? this.setState({ show: 1000 })
                  : this.setState({ show: 1 });
                this.setState({ showBtn: !this.state.showBtn });
              }}>
              {this.state.showBtn ? (
                <u style={{ fontStyle: "oblique" }}>Show More</u>
              ) : (
                <u style={{ fontStyle: "oblique" }}>Show Less</u>
              )}
            </button>
          </div>
          <hr />
          <div id="bestseller">
            <div className="text" id="bestSellerText">
              BESTSELLERS
            </div>
            <div className="bestSellerImage">
              <Image
                key={this.state.Restaurant.mainPhoto}
                cloudName="foodfinder"
                publicId={this.state.Restaurant.bestSeller.image}
                height="600"
                width="800"
                crop="scale"
              />
            </div>
            <div className="bestSellerElements">
              <div id="bestSellerTitle" style={{ paddingLeft: 30 }}>
                {this.state.Restaurant.bestSeller.title.toUpperCase()}
              </div>
              <div id="bestSellerDescription" style={{ paddingLeft: 30 }}>
                {this.state.Restaurant.bestSeller.description}
              </div>
            </div>
          </div>

          <div className="mapElements">
            {mapButton()}

            <div className="mapImg">
              <Map sendLocation={(e) => {}} getty={location} />
            </div>
            
          </div>

          <div className="recommendation">
            <h3>Similar like this</h3>
            <hr />
            {renderSimilar()}
          </div>
        </div>
        <BrowseBtn />
      </div>
    );
  }
}

export default restaurant;
