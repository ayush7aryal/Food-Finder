import React, { Component } from "react";
import { Image } from "cloudinary-react";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import "../css_styles/similarsStyle.css";
import AboutFood from "./images/foodAbout.png";
import Footer from "./Elements.js";

class home extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
        url: `http://localhost:5000/restaurant/`,
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
            window.location = "http://localhost:3000/";
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
            console.log(link)
            const data = link.street ? link.street : link.adminArea5;
            if (data && data.length > 3) {
              return data;
            } else {
              return "Unknown Location";
            }
          })
          .catch((err) => console.error(err));
        console.log(val);
        const temp = {
          name: res.name,
          loc: val,
          id: res.id,
          imgUrl: res.mainPhoto,
        };
        this.setState({
            cardsData: [...this.state.cardsData, temp]
        })
        // console.log(cardsData[cardsData.length-1])
      });
      console.log(cards[0]);
      this.setState({
        cardsData: cards,
      });
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const renderImages = () => {
      const images = this.state.images.map((result, index) => {
        return (
          <Image
            key={result + index}
            cloudName="foodfinder"
            publicId={result}
            width="1400"
            height="700"
            crop="scale"
          />
        );
      });

      // return (<Carousel slides={images} autoplay={true} interval={1000}/>)
      return (
        <div className="Carousel">
          <Carousel navButtonsAlwaysVisible="true" animation="slide">
            {images}
          </Carousel>
        </div>
      );
    };
    const renderPopularity = () => {
      console.log("state: ", this.state.cardsData[0].name);
      function handlingClickedCard(props) {
        window.location = `http://localhost:3000/restaurant/${props.id}`;
      }

      const Card = (props) => (
        <div className="card" onClick={() => handlingClickedCard(props)}>
          <Image
                        key={props.id}
                        cloudName='foodfinder'
                        publicId={props.imgUrl}
                        width='450'
                        height='420'
                        crop='scale'
                    />
          <div className="card-content">
            <h2>{props.title}</h2>
            {props.location}
            {/* props.location.latitude,props.location.longitude */}
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
          <h1 style={{ textAlign: "center" }}>Popular spots</h1>
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
            <hr style={{ width: "40%" }} />
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
        <div>{renderImages()}</div>
        {this.state.cardsData[0] && (
          <div className="container">{renderPopularity()}</div>
        )}
        <div>{renderAboutUs()}</div>
        <Footer />
      </div>
    );
  }
}

export default home;

// const restaurantImg = [
//     {
//     img: "https://docs.google.com/uc?export=download&id=15FqcVuQibdrxcbseeT1voLeCNOqxg5TW",
//     },
//     {
//     img: "https://docs.google.com/uc?export=download&id=1K6kZuWK1Zr6CQpBvSlvuZ6hziHH__49G",
//     },
//     {
//     img: "https://docs.google.com/uc?export=download&id=1lijCcfAeihE90f7vcPgT7Hl8G1aocUOC",
//     },
//     {
//     img: "https://docs.google.com/uc?export=download&id=17y6_tx4GFspBgQ3-OEcUWK2-FJwOiOab"
//     },

// ];
