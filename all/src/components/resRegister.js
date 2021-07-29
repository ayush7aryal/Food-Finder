import React, { Component } from "react";
import axios from "axios";
import Menu from "./menuComponent";
import Map from "./mapComponent";
import {Image} from 'cloudinary-react';
import "../css_styles/resRegister.css";
import "../css_styles/mapStyle.css";

export default class resRegister extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      name: "",
      email: "",
      catagoryOption: [
        "Nepali",
        "Chinese",
        "Indian",
        "Italian",
        "Tibetan",
        "Continental",
      ],
      category: [],
      description: "",
      contact: "",
      input: "", //for image handling
      selected: "", //for image handling
      preview: "", //for image handling
      previewMultiple: [],
      menu: [
        {
          title: "",
          price: "",
          catagory:[],
          image: "",
        },
      ],
      bestSeller: {
        title: "",
        price: "",
        catagory:[],
        image: "",
      },
      location: {
        latitude: 0,
        longitude: 0,
      },
    };

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    //for category
    this.handlingClickedCard = this.handlingClickedCard.bind(this);

    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeContact = this.onChangeContact.bind(this);
    //for images both for main photo and menu's photo
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleMultipleImage = this.handleMultipleImage.bind(this);
    this.previewMultipleImage = this.previewMultipleImage.bind(this);
    this.removeIMAGE = this.removeIMAGE.bind(this);

    this.onChangelatitude = this.onChangelatitude.bind(this);
    this.onChangelongitude = this.onChangelongitude.bind(this);

    this.getMenu = this.getMenu.bind(this);
    this.sendLocation = this.sendLocation.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  mainPhoto = "";

  //name
  onChangeName(e) {
    e.preventDefault();
    this.setState({
      name: e.target.value,
    });
  }
  //email
  onChangeEmail(e) {
    e.preventDefault();
    this.setState({
      email: e.target.value,
    });
  }
  //category
  handlingClickedCard(prop, e) {
    // e.preventDefault();
    if (this.state.category.includes(prop.title)) {
      console.log(prop.title);
      this.state.category.splice(this.state.category.indexOf(prop.title), 1);
    } else {
      this.state.category.push(prop.title);
    }
    console.log(this.state.category);
  }

  //description
  onChangeDescription(e) {
    e.preventDefault();
    this.setState({
      description: e.target.value,
    });
  }

  //Contact
  onChangeContact(e) {
    e.preventDefault();
    this.setState({
      contact: e.target.value,
    });
  }

  //for all imange input handling of main Photo only
  handleFileInputChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    this.previewImage(file);
    this.setState({
      selected: file,
      input: e.target.value,
    });
  }
  //for image handling of multiple image addition
  handleMultipleImage(e) {
    e.preventDefault();
    const file = e.target.files[0];
    this.previewMultipleImage(file);
  }

  async previewMultipleImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        previewMultiple: [...this.state.previewMultiple, reader.result],
      });
    };
    reader.onerror = (err) => {
      alert(err);
    };
    console.log(this.state.previewMultiple);
  }

  //for viewing all kind of images
  previewImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        preview: reader.result,
      });
    };
    reader.onerror = (err) => {
      alert(err);
    };
  }

  // for location
  onChangelatitude(e) {
    e.preventDefault();
    this.setState({
      location: {
        latitude: e.target.value,
        longitude: this.state.location.longitude,
      },
    });
  }

  onChangelongitude(e) {
    e.preventDefault();
    this.setState({
      location: {
        latitude: this.state.location.latitude,
        longitude: e.target.value,
      },
    });
  }

  async uploadImage(base64EncodedImage) {
    //for uploading images to cloudinary
    try {
      const img = await axios({
        method: "post",
        url: "http://localhost:5000/api/upload/",
        data: { fileStr: base64EncodedImage, id: this.state.id },
        headers: { "content-Type": "application/json" },
      }).then((res) => {
        console.log("response from upload image", res);
        this.mainPhoto = res.data.public_id + "";
      });
      this.setState({
        input: "",
        preview: "",
      });
      console.log(img);
      console.log("Uploaded successfully");
    } catch (err) {
      alert(err);
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    try {
      if (!this.state.selected) {
        console.log("no selectedFile");
        return;
      }
      this.state.previewMultiple.map((result) => {
        this.uploadImage(result);
        return 0;
      });
      await this.uploadImage(this.state.preview); //signature image upload. this is done at last to change mainPhoto to signature photo
      //because the last uploaded photo becomes the mainPhoto as written in uploadImage function
      await axios({
        method: "post",
        url: "http://localhost:5000/restaurant/post",
        data: {
          id: this.state.id,
          name: this.state.name,
          email: this.state.email,
          category: this.state.category,
          description: this.state.description,
          contact: parseInt(this.state.contact, 10),
          mainPhoto: this.mainPhoto,
          menus: this.state.menu,
          bestSeller: this.state.menu[0],
          location: this.state.location,
        },
      }).then((res) => {
        console.log(res);
      });
      let config = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      await axios.post(
        "http://localhost:5000/user/roleChange",
        { id: this.state.id },
        config
      );
      window.location= `http://localhost:3000/restaurant/${this.state.id}`;
    } catch (err) {
      alert(err);
    }
  }

  getMenu(menu) {
    if (this.state.menu[0].title === "") {
      this.setState({
        menu: [menu],
      });
    } else {
      this.setState({
        menu: [...this.state.menu, menu],
      });
    }
    this.setState({
      bestSeller: this.state.menu[0],
    });
  }
  sendLocation(location) {
    this.setState({
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
  }

  componentDidMount() {
    axios({
      method: "post",
      url: "http://localhost:5000/restaurant/getId",
    }).then((res) => {
      var id = res.data;
      this.setState({
        id: id,
      });
      console.log(this.state.id)
    });
  }
  
  removeIMAGE(img){
    let newPMultiple = this.state.previewMultiple.filter((image)=>(
      image!==img
    ));
    this.setState({
      previewMultiple: newPMultiple,
    })
  }

  renderMenu(){
    const { menu } = this.state;
    const CardContainer = (props) => (
      <div className="menu-card-container">
        {menu.map((item, index) => 
              <Card 
                  itemProp = {item}
                  title={item.title} 
                  imgUrl={item.image}
                  key={index}
                  />  
          )}
      </div>
    );

    const Card = (props) => (
        <div className='menu-cardItem' onClick = {()=> this.menuSelected(props.itemProp)}>  
            <Image
                  key={props.index}
                  cloudName='foodfinder'
                  publicId={props.imgUrl}
                  width='250'
                  height='250'
                  crop='scale'
                />
            <div className="card-content">
            <h2>{ props.title }</h2>
            </div>
        </div>
    );

    if(!menu[0].title.length<1){
      console.log(menu);
      return<CardContainer/>
    }else{
      console.log(menu);
      return null;
    }

    
  }
  
  menuSelected(value){
    this.setState({
      text : value.title,
      suggestions: [],
    });
    console.log(value)
    window.location = `http://localhost:3000/restaurant/${value.id}`
  }


  render() {
    const Checkbox = (props) => (
      <div className="selectionCheckbox">
        <input
          type="checkbox"
          onClick={(event) => this.handlingClickedCard(props, event)}
        />
        <label>{props.title}</label>
      </div>
    );

    return (
      <>
        <form onSubmit={this.onSubmit}>
          <div className="registration">
            <div className="registrationOne">
              <div className="registrationName">
                {/* <h3>We invite you</h3> */}
                <h3>Join Our Network...</h3>
                <hr />
                <div className="formControl">
                  <label>Restaurant Name :</label>
                  <input
                    type="text"
                    value={this.state.name}
                    onChange={this.onChangeName}
                  />
                </div>
                <div className="formControl">
                  <label>Restaurant Email :</label>
                  <input
                    type="text"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
                </div>
                <div className="formControl">
                  <label>Restaurant Contact:</label>
                  <input
                    type="text"
                    value={this.state.contact}
                    onChange={this.onChangeContact}
                  />
                </div>
                <div className="formControl">
                  <label>Restaurant Description:</label>
                  <textarea
                    type="text"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                  />
                </div>

                <div className="checkBoxForm">
                  <label>Select catagories</label>
                  <div className="catagorySelect">
                    {this.state.catagoryOption.map((cata, index) => (
                      <Checkbox key={index} title={cata} nameClass={cata} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="signaturePhoto">
                <h3>Signature Photo:</h3>
                <input
                  type="file"
                  value={this.state.input}
                  onChange={this.handleFileInputChange}
                />
                {this.state.preview && (
                  <img
                    src={this.state.preview}
                    alt="chosen"
                    // style={{ height: "300px" }}
                  />
                )}
              </div>
            </div>
            <div className="registrationTwo">
              <div className="location">
                <h3>Pin your Location</h3>
                <Map sendLocation={this.sendLocation} />
                <div>
                  <label className="latitude">
                    Latitude:{" "}
                    <input
                      type="number"
                      value={this.state.location.latitude}
                      onChange={this.onChangelatitude}
                    />
                  </label>
                  <label className="longitude">
                    Longitude:{" "}
                    <input
                      type="number"
                      value={this.state.location.longitude}
                      onChange={this.onChangelongitude}
                    />
                  </label>
                </div>
              </div>
              <div className="MultipleImageSection">
                <div>
                  <h3>Add Images to justify your Restaurant</h3>
                  <hr />
                </div>
                <div className="otherImages">
                  {this.state.previewMultiple.length === 4 ? (
                    alert("You can add 4 images only.")
                  ) : (
                    <input
                      type="file"
                      className="item1"
                      // value={this.state.input}
                      onChange={this.handleMultipleImage}
                    />
                  )}

                  {this.state.previewMultiple &&
                    this.state.previewMultiple.map((img, i) => {
                      return (
                        <div className="MultiIMAGE">
                        <img
                          key={i}
                          src={img}
                          alt="chosen"
                          height="200px"
                          width="300px"
                        />
                        <button onClick={()=>{this.removeIMAGE(img)}}>remove</button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          <div className="menuSection">
            <label>Menus:</label>
            <hr />
            <Menu
              sendDataToParent={this.getMenu}
              dataFromParent={this.state.id}
            />
            <div>{this.renderMenu()}</div> 
          </div>
          <input type="submit" />
        </form>
      </>
    );
  }
}


  
 