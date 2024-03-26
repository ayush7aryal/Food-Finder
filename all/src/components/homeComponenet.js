import React, { Component } from "react";
import { Image } from "cloudinary-react";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import "../css_styles/homeComponent.css";
import AboutFood from "./images/foodAbout.png";
import "../css_styles/adminPage.css"


class home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      featuredRes: {
        id: '',
        name: "",
        description: "",
        contact: "",
        photo: [],
        mainPhoto: ""
      },
      Restaurant: [
        {
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
      ],
      images: [],
      cardsData: [],
    };
  }

  async componentDidMount() {
    try {
      await axios({
        method: "get",
        url: `https://food-finder-seven.vercel.app/restaurant/`,
      })
        .then((res) => {
          const Restaurant = res.data;
          Restaurant.map((ins) => {
            let photo = ins.mainPhoto;
            this.state.images.push(photo);
            return null;
          });

          if (!Restaurant) {
            alert("Could not find the restaurant you are looking for!");
            window.location = "https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/";
          } else {
            this.setState({
              Restaurant: Restaurant,
            });
          }
        })
        .catch((err) => console.error(err));

      let cards = [];

      this.state.Restaurant.forEach(async (res) => {
        const val = await axios({
          method: "get",
          url: `http://www.mapquestapi.com/geocoding/v1/reverse?key=YoqS9w9cHGAvG28dQBhg19RhJmAZEm7G&location=${res.location.latitude},${res.location.longitude}&includeRoadMetadata=true&includeNearestIntersection=true`,
        })
          .then((result) => {
            const link = result.data.results[0].locations[0];
            // console.log(link)
            const data = link.street ? link.street : link.adminArea5;
            if (data && data.length > 3) {
              return data;
            } else {
              return "Unknown Location";
            }
          })
          .catch((err) => console.error(err));
        // console.log(val);
        const temp = {
          name: res.name,
          loc: val,
          id: res.id,
          imgUrl: res.mainPhoto,
        };
        this.setState({
          cardsData: [...this.state.cardsData, temp],
        });
        // console.log(cardsData[cardsData.length-1])
      });

      // console.log(cards[0]);
      this.setState({
        cardsData: cards,
      });

      await axios
        .get("https://food-finder-seven.vercel.app/admin/getFeatured")
        .then((result) => {
          //if (!result.data.msg) {
            const fRes = result.data;
            this.state.featuredRes.id = fRes.id;
            this.state.featuredRes.name = fRes.name;
            this.state.featuredRes.description = fRes.description;
            this.state.featuredRes.contact = fRes.contact;
            this.state.featuredRes.mainPhoto = fRes.mainPhoto;
            //}
          console.log(this.state.featuredRes)
        });
      if (this.state.featuredRes.id !== '') {
        await axios.get(
          `https://food-finder-seven.vercel.app/api/images/${this.state.featuredRes.id}`
        ).then((result)=>{
          this.state.featuredRes.photo = result.data;
          console.log("Photo: ", this.state.featuredRes.photo)
        })
      }
    } catch (err) {
      alert(err);
    }
  }

  render() {

    const renderFeatured = () =>{

      return(
        <div className = "featureBody">
          <div className = "featureImg">
          <Image
            style={{width:"100%",height:"100%"}}
            key={this.state.featuredRes.id}
            cloudName="foodfinder"
            publicId={this.state.featuredRes.mainPhoto}
            width="700"
            height="300"
            crop="scale"
          />
          </div>
          <div className = "featureRestaurant">
            <div className="featureRestaurantSec">
              <span className="featureSpan1">{this.state.featuredRes.name}</span>
              <span className="featureSpan2">{this.state.featuredRes.description}</span>
              <button 
                onClick = {() => window.location = `https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/restaurant/${this.state.featuredRes.id}`} 
                className="viewMoreBtn">
                <span>View More</span> 
                <svg width="13px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
              </button>
            </div>
            <svg class="arrows">
							<path class="a1" d="M0 0 L30 32 L60 0"></path>
							<path class="a2" d="M0 20 L30 52 L60 20"></path>
							<path class="a3" d="M0 40 L30 72 L60 40"></path>
						</svg>
          </div>
        </div>
      );
    }

    const renderPopularity = () => {
      // console.log("state: ", this.state.cardsData[0].name);

      function handlingClickedCard(props) {
        window.location = `https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/restaurant/${props.id}`;
      }

      const Card = (props) => (
        <div className="cardPop" onClick={() => handlingClickedCard(props)}>
          <Image
            style={{width:"100%",height:"80%"}}
            key={props.id}
            cloudName="foodfinder"
            publicId={props.imgUrl}
            width="400"
            height="400"
            responsive="true"
            crop="scale"
          />
          <div className="card-content">
            <h2>{props.title}</h2>
            <h4>{props.location}</h4>
          </div>
        </div>
      );

      const CardContainer = (props) => (
        <div key={props} className="cards-container">
          {props.cards.map((card) => (
            <Card
              key={card.id}
              title={card.name}
              location={card.loc}
              imgUrl={card.imgUrl}
              id={card.id}
            />
          ))}
        </div>
      );

      return (
        <div>
          <h1 className="PopularHeading">Popular spots</h1>
          <div>
            <CardContainer cards={this.state.cardsData} />
          </div>
        </div>
      );
    };

    const renderAboutUs = () => {
      return (
        <div className="About-container">
          <div className="aboutContent">
            <h1>About us</h1>
            
            <p>
              The problem with this syntax is that a different callback is
              created each time the LoggingButton renders. In most cases, this
              is fine. However, if this callback is passed as a prop to lower
              components, those components might do an extra re-rendering. We
              generally recommend binding in the constructor or using the class
              fields syntax, to avoid this sort of performance problem.{" "}
            </p>
          </div>
          <div className="aboutImg">
            <img src={AboutFood} alt="/beautiful food" />
          </div>
        </div>
      );
    };
    return (
      <div>
        <div>{renderFeatured()}</div>
        {this.state.cardsData[0] && <div>{renderPopularity()}</div>}
        <div>{renderAboutUs()}</div>
      </div>
    );
  }
}

export default home;