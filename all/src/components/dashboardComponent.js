import axios from "axios";
import React, { Component } from "react";
import { Image } from "cloudinary-react";
import searchIcon from "./images/search-solid.svg";
import "../css_styles/dashboardComponent.css";

import breakfast from "../components/images/catagory/breakfast.png";
import lunch from "../components/images/catagory/lunch.png";
import snack from "../components/images/catagory/snack.png";
import dinner from "../components/images/catagory/dinner.png";

class dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: [
        {
          id: "",
          location: {
            latitude: "",
            longitude: "",
          },
          name: "",
          mainPhoto: "",
          menus: [],
        },
      ],

      searchTerm: "menu",
      catagory: [{ for: "menu", value: "" }],
      text: "",
      suggestions: [],
      holdSuggestion: [],
      restaurantCatagory: [
        { name: "Nepali", img: breakfast },
        { name: "Indian", img: lunch },
        { name: "Tibetan", img: snack },
        { name: "Chinese", img: dinner },
        { name: "Continental", img: snack },
        { name: "Italian", img: dinner },
      ],
      menuCatagory: [
        { name: "BreakFast", img: breakfast },
        { name: "Lunch", img: lunch },
        { name: "Snack", img: snack },
        { name: "Dinner", img: dinner },
      ],
      userLocation: {
        latitude: "",
        longitude: "",
      },
    };

    this.onChangeText = this.onChangeText.bind(this);
    this.onClickText = this.onClickText.bind(this);

    this.filteringRestaurant = this.filteringRestaurant.bind(this);
    this.filteringMenu = this.filteringMenu.bind(this);
    this.onSorting = this.onSorting.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.rendersuggestions = this.rendersuggestions.bind(this);
    this.renderCatagories = this.renderCatagories.bind(this);
  }

  async componentDidMount() {
    await axios({
      method: "get",
      url: "https://food-finder-jade.vercel.app/restaurant",
      withCredentials: true,
    }).then((result) => {
      const all = result.data;
      this.setState({
        restaurants: all,
      });
      console.log(this.state.restaurants);
    });
  }

  onClickText(e) {
    const value = this.state.text;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      if (this.state.searchTerm === "restaurant") {
        // console.log(this.state.restaurants);
        suggestions = this.state.restaurants
          .sort()
          .filter((v) => regex.test(v.name));
      } else if (this.state.searchTerm === "menu") {
        this.state.restaurants.forEach((res) => {
          res.menus.forEach((menu) =>
            suggestions.push({ menu: menu, id: res.id })
          );
        });
        suggestions = suggestions
          .sort()
          .filter((v) => regex.test(v.menu.title));
        // console.log(suggestions) ;
      }
    }

    this.setState(() => ({ suggestions: suggestions, text: value }));
    this.setState(() => ({ holdSuggestion: suggestions }));
    console.log(suggestions);
    console.log(this.state.text);
  }

  onChangeText(e) {
    const value = e.target.value;
    this.setState(() => ({ text: value }));
  }

  // filteringsection left cuz  of no catagory in menu
  filteringRestaurant(category) {
    let filtered = this.state.suggestions.filter((result) =>
      result.category.includes(category)
    );
    console.log(filtered);
    console.log(category);

    this.setState(() => ({ suggestions: filtered }));
  }
  filteringMenu(catagoryName) {
    let filtered = this.state.holdSuggestion.filter((result) =>
      result.menu.catagory.includes(catagoryName)
    );
    console.log(filtered);
    console.log(catagoryName);
    this.setState(() => ({ suggestions: filtered }));
  }

  async calculateDistance() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    });
    var near;
    if (this.state.suggestions[0]) {
      near = this.state.suggestions.map((result) => {
        let d = calcCrow(
          this.state.userLocation.latitude,
          this.state.userLocation.longitude,
          result.location.latitude,
          result.location.longitude
        );
        console.log(d, result.name);

        return {
          ...result,
          distance: d,
        };
      });
    } else {
      near = this.state.restaurants.map((result) => {
        let d = calcCrow(
          this.state.userLocation.latitude,
          this.state.userLocation.longitude,
          result.location.latitude,
          result.location.longitude
        );
        console.log(d, result.name);

        return {
          ...result,
          distance: d,
        };
      });
    }

    // await this.setState({suggestions: near},()=>{console.log(this.state.suggestions,"asynSuggestions")})

    console.log("near", near);
    this.state.suggestions = near;
    console.log(this.state.suggestions, "after assignment");
  }

  async onSorting(e) {
    let option = e;

    if (option === "distance" && !this.state.suggestions.distance) {
      this.calculateDistance();
      console.log("inside if sort");
    }

    let sortedList = [...this.state.suggestions].sort(
      (a, b) => b[option] - a[option]
    );
    console.log(sortedList, "sortedList");
    await this.setState(() => ({ suggestions: sortedList }));
  }

  async onSortingPrice(e) {
    let option = e;
    if (option === "highToLow") {
      let sortedList = [...this.state.suggestions].sort(
        (a, b) => b.menu.price - a.menu.price
      );
      await this.setState(() => ({ suggestions: sortedList }));
      sortedList.map((cata) => {
        console.log(cata.menu.price);
      });
    } else {
      let sortedList = [...this.state.suggestions].sort(
        (a, b) => a.menu.price - b.menu.price
      );
      await this.setState(() => ({ suggestions: sortedList }));
    }
    this.state.suggestions.map((cata) => {
      console.log(cata.menu.price);
    });
  }

  renderCatagories() {
    const MenuCataSection = () => (
      <div>
        <div className="selection">
          <div className="selectionChild1">
            <select
              onChange={(e) => {
                this.onSortingPrice(e.target.value);
              }}
            >
              <option value="" selected disabled hidden>
                Sort By
              </option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          <label>Catagories</label>

          <div className="selectionChild2">
            {this.state.menuCatagory.map((cata, index) => (
              <div
                key={index}
                className="Particularcata"
                onClick={() => this.filteringMenu(cata.name)}
                activeStyle={{
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                <img alt="" src={cata.img} />
                <span>{cata.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const RestaurantCataSection = () => (
      <div className="selection">
        <div className="selectionChild1">
          <select
            onChange={(e) => {
              this.onSorting(e.target.value);
            }}
          >
            <option value="" selected disabled hidden>
              Sort By
            </option>
            <option value="popularity">Popularity</option>
            <option value="distance">Distance</option>
            <option value="id">Recently added</option>
          </select>
        </div>
        <label>Catagories</label>
        <div className="selectionChild2">
          <div className="selectionChild2">
            {this.state.restaurantCatagory.map((cata, index) => (
              <div
                key={index}
                className="Particularcata"
                onClick={() => {
                  this.filteringRestaurant(cata.name);
                }}
              >
                <img alt="" src={cata.img} />
                <span>{cata.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return this.state.searchTerm === "menu" ? (
      <MenuCataSection />
    ) : (
      <RestaurantCataSection />
    );
  }

  rendersuggestions() {
    var { suggestions } = this.state;
    const CardContainer = (props) => (
      <div className="card-container">
        {suggestions.map((item, index) => (
          <Card
            itemProp={item}
            title={item.name ? item.name : item.menu.title}
            imgUrl={item.mainPhoto ? item.mainPhoto : item.menu.image}
            key={item.id ? item.id : item.id}
          />
        ))}
      </div>
    );

    const Card = (props) => (
      <div
        className="cardItem"
        onClick={() => this.suggestionSelected(props.itemProp)}
      >
        <Image
          key={props.key}
          cloudName="foodfinder"
          publicId={props.imgUrl}
          width="250"
          height="250"
          crop="scale"
        />
        <div className="card-content">
          <h2>{props.title}</h2>
        </div>
      </div>
    );

    return <CardContainer />;
  }

  suggestionSelected(value) {
    this.setState({
      text: value.name,
      suggestions: [],
    });
    console.log(value);
    window.location = `https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/restaurant/${value.id}`;
  }

  changeSearchTerm(e) {
    this.setState({ searchTerm: e.target.value });
    console.log(e.label);
    // this.state.searchTerm === "menu" ? this.setState({searchTerm : "restaurant"}) : this.setState({searchTerm : "menu"});
  }

  //
  render() {
    return (
      <div>
        <div className="search-section">
          <div className="search-select1">
            <select
              value={this.searchTerm}
              className="search-change-section"
              onChange={(e) => this.changeSearchTerm(e)}
            >
              <option value="menu">Menu</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div className="search-select2">
            <input
              className="search-input"
              value={this.state.text}
              onChange={this.onChangeText}
              placeholder={`Enter ${this.state.searchTerm} name...`}
            />
            <button className="search-btn" onClick={this.onClickText}>
              <img alt="" src={searchIcon} />
            </button>
          </div>
        </div>

        <div>{this.renderCatagories()}</div>
        <div>{this.rendersuggestions()}</div>
      </div>
    );
  }
}

export default dashboard;

function calcCrow(latitude1, lon1, latitude2, lon2) {
  var R = 6371; // km
  var dLat = toRad(latitude2 - latitude1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(latitude1);
  var lat2 = toRad(latitude2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}
