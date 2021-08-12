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
import edit from "./images/edit_icon.png";
import delete_icon from "./images/delete.png";
// import add from "./images/add.png";
import Menu from "./menuComponent";

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
          latitude: 0,
          longitude: 0,
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
      pop: "", //map, head
      index: -1, //for deleting menu
      editName: "",
      editEmail: "",
      editCategory: [],
      editContact: "",
      editDescription: "",
      Nepali: false,
      Chinese: false,
      menuAdd: false,
    };
    this.addMenu = this.addMenu.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
  }

  onChangeName(e) {
    e.preventDefault();
    this.setState({
      editName: e.target.value,
    });
  }

  onChangeEmail(e) {
    e.preventDefault();
    this.setState({
      editEmail: e.target.value,
    });
  }

  onChangeDescription(e) {
    e.preventDefault();
    this.setState({
      editDescription: e.target.value,
    });
  }

  onChangeContact(e) {
    e.preventDefault();
    this.setState({
      editContact: e.target.value,
    });
  }

  // onChangeName(e){
  //   e.preventDefault()
  //   this.setState({
  //     name: e.target.value
  //   })
  // }

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
      console.log(this.props.id);
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
            this.setState({
              editName: Restaurant.name,
              editContact: Restaurant.contact,
              editDescription: Restaurant.description,
              editEmail: Restaurant.email,
              editCategory: Restaurant.category,
            });
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
          <div onClick={()=>{window.location = `http://localhost:3000/restaurant/${result.id}`}} key={result.name + index} className="container">
            <Image
              key={index}
              cloudName="foodfinder"
              publicId={result.mainPhoto}
              height="150"
              crop="scale"
            />
            <div className="similarText" style={{ fontSize: 18, fontWeight: "bolder" }}>
              
                {result.name.toUpperCase()}
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
        <div className="similarRes">
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
                <img
                onClick={() => {
                  this.setState({ pop: "deleteMenu" });
                  this.setState({ index: index });
                }}
                src={delete_icon}
                alt=""
                className="edit"
                id="deleteMenu"
              />
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
                <button
                  className="menuBtn"
                  onClick={() => {
                    this.addMenu(result);
                  }}>
                  Add to Cart
                </button>
                <br />
              </div>

              
              {this.state.Restaurant.bestSeller !==
                this.state.Restaurant.menus[index] && (
                <button
                  onClick={async () => {
                    const res = { ...this.state.Restaurant };
                    res.bestSeller = this.state.Restaurant.menus[index];
                    await this.setState({ Restaurant: res });
                    editRestaurant();
                  }}>
                  Set as BestSeller
                </button>
              )}
            </div>
          );
        });

      return <div className="Menu">{menus}</div>;
    };

    function getMenu(menu) {
      const res = { ...this.state.Restaurant };
      res.menus.push(menu);
      this.setState({
        Restaurant: res,
      });
      editRestaurant();
    }

    const menuButton = () => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
          className="menuTxt">
          <label>Menu</label>
          <Menu style={{ marginRight: 10 }} sendDataToParent={getMenu} dataFromParent={this.state.Restaurant.id} />
        </div>
      );
    };
    const mapButton = () => {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <button className="mapBtn">Directions</button>
          <img
            onClick={() => {
              // this.state.pop = "head";
              this.setState({ pop: "map" });
            }}
            src={edit}
            alt=""
            className="edit"
            id="editMap"
          />
        </div>
      );
    };

    const renderImages = () => {
      const images = this.state.images.map((result, index) => {
        return (
          <Image
            style={{ width: "100%", height: "100%" }}
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

    //image deletion through public id
    const deletePhoto = async (publicId) => {
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.post("http://localhost:5000/api/destroy", publicId, config);
    };

    //edit function for all edits
    const editRestaurant = async () => {
      console.log("edit: ", this.state.Restaurant);
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };

      await axios
        .post(
          "http://localhost:5000/restaurant/update",
          this.state.Restaurant,
          config
        )
        .then((result, err) => {
          if (!err) {
            return alert("Restaurant description updated successfully!");
          }
          alert("Couldn't update the information!");
        });
    };

    //edit section start
    const map = () => {
      var temp_loc = {
        latitude: 0,
        longitude: 0,
      };
      return (
        <div>
          <div
            className={
              this.state.pop === "map"
                ? "pop-dialog-parent active"
                : "pop-dialog-parent"
            }
            id="pop-dialog">
            <div className="pop-header">
              <div className="pop-title">RESTAURANT LOCATION</div>
              <button
                onClick={() => {
                  this.setState({ pop: "" });
                }}
                className="pop-close">
                &times;
              </button>
            </div>
            <div className="pop-body">
              <Map
                sendLocation={(location) => {
                  temp_loc = location;
                }}
              />
            </div>
            <div
              onClick={() => {
                const temp = this.state.Restaurant;
                temp.location.latitude = temp_loc.latitude - 0;
                temp.location.longitude = temp_loc.longitude - 0;
                temp.location = temp_loc;
                this.setState({
                  Restaurant: temp,
                });
                editRestaurant();
              }}
              className="pop-setBtn">
              Update
            </div>
          </div>
          <div
            onClick={() => {
              this.setState({ pop: "" });
            }}
            className={
              this.state.pop === "map" ? "overlay active" : "overlay"
            }></div>
        </div>
      );
    };

    const editHeadSection = () => {
      const catagoryOption = [
        "Nepali",
        "Chinese",
        "Indian",
        "Italian",
        "Tibetan",
        "Continental",
        "Others",
      ];

      const Checkbox = (props) => (
        <div className="selectionCheckbox">
          {/* {this.state.editCategory.includes(props.title) && ( */}
          <input
            type="checkbox"
            checked={this.state.editCategory.includes(props.title)}
            onChange={() => {
              if (this.state.editCategory.includes(props.title)) {
                const temp = [...this.state.editCategory];

                temp.splice(this.state.editCategory.indexOf(props.title), 1);
                this.setState({
                  editCategory: temp,
                });
              } else {
                const temp = [...this.state.editCategory];
                temp.push(props.title);
                // this.state.editCategory.push(props.title);
                this.setState({
                  editCategory: temp,
                });
              }
            }}
          />
          <label for={props.title}>{props.title}</label>
        </div>
      );

      return (
        <>
          <div
            className={
              this.state.pop === "head"
                ? "pop-dialog-parent active"
                : "pop-dialog-parent"
            }
            id="pop-dialog">
            <div className="pop-header">
              <div className="pop-title">Edit</div>
              <button
                onClick={() => {
                  this.setState({ pop: "" });
                  this.setState({
                    editName: this.state.Restaurant.name,
                    editEmail: this.state.Restaurant.email,
                    editContact: this.state.Restaurant.contact,
                    editCategory: this.state.Restaurant.category,
                    editDescription: this.state.Restaurant.description,
                  });
                }}
                className="pop-close">
                &times;
              </button>
            </div>
            <div className="pop-body">
              <ul>
                <li>
                  Name:{" "}
                  <input
                    type="text"
                    onChange={this.onChangeName}
                    value={this.state.editName}
                  />
                </li>
                <li>
                  Email:{" "}
                  <input
                    type="text"
                    value={this.state.editEmail}
                    onChange={this.onChangeEmail}
                  />
                </li>
                <li>
                  Contact:{" "}
                  <input
                    type="text"
                    value={this.state.editContact}
                    onChange={this.onChangeContact}
                  />
                </li>
                <li>
                  Description:{" "}
                  <input
                    type="text"
                    value={this.state.editDescription}
                    onChange={this.onChangeDescription}
                  />
                </li>
              </ul>
              <div className="checkBoxForm">
                <label>Select catagories</label>
                <div className="catagorySelect">
                  {catagoryOption.map((cata, index) => (
                    <Checkbox key={index} title={cata} nameClass={cata} />
                  ))}
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                const temp = this.state.Restaurant;
                temp.name = this.state.editName;
                temp.contact = this.state.editContact;
                temp.email = this.state.editEmail;
                temp.category = this.state.editCategory;
                temp.description = this.state.editDescription;
                this.setState({
                  Restaurant: temp,
                });
                editRestaurant();
              }}
              className="pop-setBtn">
              Update
            </div>
          </div>
          <div
            onClick={() => {
              this.setState({ pop: "" });
              this.setState({
                editName: this.state.Restaurant.name,
                editEmail: this.state.Restaurant.email,
                editContact: this.state.Restaurant.contact,
                editCategory: this.state.Restaurant.category,
                editDescription: this.state.Restaurant.description,
              });
            }}
            className={
              this.state.pop === "head" ? "overlay active" : "overlay"
            }></div>
        </>
      );
    };

    const deleteMenu = () => {
      return (
        <div>
          <div
            className={
              this.state.pop === "deleteMenu"
                ? "pop-dialog-parent active"
                : "pop-dialog-parent"
            }
            id="pop-dialog">
            <div className="pop-header">
              <div className="pop-title">Remove Menu</div>
              <button
                onClick={() => {
                  this.setState({ pop: "" });
                }}
                className="pop-close">
                &times;
              </button>
            </div>
            <div className="pop-body">
              Are you sure you want to remove the MENU?
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}>
              <div
                onClick={() => {
                  this.setState({ pop: "" });
                }}
                className="pop-setBtn">
                Cancel
              </div>
              <div
                onClick={() => {
                  const temp = this.state.Restaurant;
                  const t = temp.menus.splice(this.state.index, 1);
                  this.setState({
                    Restaurant: temp,
                  });
                  editRestaurant();
                  if (t.image) deletePhoto(t.image);
                  this.setState({ pop: "" });
                }}
                className="pop-setBtn">
                Yes
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              this.setState({ pop: "" });
            }}
            className={
              this.state.pop === "deleteMenu" ? "overlay active" : "overlay"
            }></div>
        </div>
      );
    };

    // const editMenu = (index) => {
    //   const item = this.state.Restaurant.menus[index];
    //   return (
    //     <>
    //       <div
    //         className={
    //           this.state.pop === "menu"
    //             ? "pop-dialog-parent active"
    //             : "pop-dialog-parent"
    //         }
    //         id="pop-dialog">
    //         <div className="pop-header">
    //           <div className="pop-title">Edit Menu</div>
    //           <button
    //             onClick={() => {
    //               this.setState({ pop: "menu" });
    //             }}
    //             className="pop-close">
    //             &times;
    //           </button>
    //         </div>
    //         <div className="pop-body">
    //           {/* <Map  sendLocation={sendLocation} /> */}
    //           <ul>
    //             <li>
    //               Title:{" "}
    //               <input
    //                 defaultValue={item.title}
    //                 onChange={(e) => {
    //                   item.title = e.target.value;
    //                 }}
    //               />
    //             </li>
    //             <li>
    //               Description:{" "}
    //               <input
    //                 defaultValue={item.description}
    //                 onChange={(e) => {
    //                   item.description = e.target.value;
    //                 }}
    //               />
    //             </li>
    //             <li>
    //               Title:{" "}
    //               <input
    //                 defaultValue={item.price}
    //                 onChange={(e) => {
    //                   item.price = e.target.value;
    //                 }}
    //               />
    //             </li>
    //           </ul>
    //         </div>
    //         <div onClick={() => {}} className="pop-setBtn">
    //           Update Menu
    //         </div>
    //       </div>
    //       <div
    //         onClick={() => {
    //           this.setState({ pop: "" });
    //         }}
    //         className={
    //           this.state.pop === "menu" ? "overlay active" : "overlay"
    //         }></div>
    //     </>
    //   );
    // };

    return (
      <>
        <div className="info">
          
            <div className='headName'>
              <h1 className="text" style={{ fontSize: 30, width: 300, marginLeft: 60 }}>
                {this.state.Restaurant.name.toUpperCase()}
              </h1>
              <div className='editDiv'>
              <img
                onClick={() => {
                  // this.state.pop = "head";
                  this.setState({ pop: "head" });
                }}
                src={edit}
                alt=""
                className="edit"
                id="editHead"
              />
              </div>
              
            </div>

            <div className="Images">{renderImages()}</div>
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}>
              <div className="bestSellerImage" style={{ width: "65%" }}>
                <Image
                  style={{ width: "100%", height: "auto" }}
                  key={this.state.Restaurant.mainPhoto}
                  cloudName="foodfinder"
                  publicId={this.state.Restaurant.bestSeller.image}
                  height="600"
                  width="800"
                  crop="scale"
                />
              </div>
              <div
                className="bestSellerElements"
                style={{ marginLeft: "5px", marginRight: "5px" }}>
                <div id="bestSellerTitle">
                  {this.state.Restaurant.bestSeller.title.toUpperCase()}
                </div>
                <div id="bestSellerDescription">
                  {this.state.Restaurant.bestSeller.description}
                </div>
              </div>
            </div>
          </div>

          <div className="mapElements">
            <div className="mapImg">
              {mapButton()}
              <Map sendLocation={(e) => {}} getty={location} />
            </div>
            <div id="catcon">
              <div id="bestSellerTitle">
               
              </div>
            </div>
          </div>

          <div className="recommendation">
            <h3>Similar like this</h3>
            <hr />
            {renderSimilar()}
          </div>
        </div>
        <BrowseBtn />
        {editHeadSection()}
        {map()}
        {deleteMenu()}
      </>
    );
  }
}

export default restaurant;
