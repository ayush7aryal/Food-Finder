import React, { Component } from "react";
import axios from "axios";
import Menu from "./menuComponent";
import Map from "./mapComponent";
import { Image } from "cloudinary-react";
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
        "Others"
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
    this.renderMenu = this.renderMenu.bind(this);
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
        url: "https://food-finder-seven.vercel.app/api/upload/",
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
        url: "https://food-finder-seven.vercel.app/restaurant/post",
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
        "https://food-finder-seven.vercel.app/user/roleChange",
        { id: this.state.id },
        config
      );
      window.location = `http://localhost:3000/restaurant/${this.state.id}`;
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
      method: "get",
      url: "https://food-finder-seven.vercel.app/restaurant/getId",
    }).then((res) => {
      var id = res.data;
      console.log("from id call",res.data)
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
                <label htmlFor="signaturePhoto-upload">
                  <div className="signature-upload">
                  <svg height="25pt" width="25pt" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-plus" class="svg-inline--fa fa-user-plus fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                  <span>Upload Image</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="signaturePhoto-upload"
                  style={{display:"none"}}
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
                  {this.state.previewMultiple.length === 4 ? (()=>alert("You can add 4 images only.")
                  ) : (
                    <>
                      <label htmlFor="file-upload">
                        <div className="upload-MultiIMAGE">
                        <svg height="25pt" viewBox="0 -18 512 512" width="25pt" xmlns="http://www.w3.org/2000/svg"><path d="m432 0h-352c-44.113281 0-80 35.886719-80 80v280c0 44.113281 35.886719 80 80 80h190c7.628906 0 14.59375-4.339844 17.957031-11.191406 3.359375-6.847656 2.53125-15.015625-2.140625-21.046875l-52.3125-67.609375 144.992188-184.425782 93.503906 111.546876v33.726562c0 11.046875 8.953125 20 20 20s20-8.953125 20-20v-221c0-44.113281-35.886719-80-80-80zm-38.671875 111.152344c-3.871094-4.617188-9.609375-7.253906-15.640625-7.148438-6.027344.09375-11.6875 2.898438-15.410156 7.636719l-154.015625 195.894531-52.445313-67.773437c-3.789062-4.898438-9.628906-7.761719-15.816406-7.761719-.007812 0-.019531 0-.027344 0-6.199218.007812-12.046875 2.890625-15.824218 7.804688l-44.015626 57.21875c-6.734374 8.757812-5.097656 21.3125 3.65625 28.046874 8.757813 6.738282 21.3125 5.097657 28.046876-3.65625l28.210937-36.671874 89.1875 115.257812h-149.234375c-22.054688 0-40-17.945312-40-40v-280c0-22.054688 17.945312-40 40-40h352c22.054688 0 40 17.945312 40 40v125.007812zm-253.328125-39.152344c-33.085938 0-60 26.914062-60 60s26.914062 60 60 60 60-26.914062 60-60-26.914062-60-60-60zm0 80c-11.027344 0-20-8.972656-20-20s8.972656-20 20-20 20 8.972656 20 20-8.972656 20-20 20zm372 229c0 11.046875-8.953125 20-20 20h-55v55c0 11.046875-8.953125 20-20 20s-20-8.953125-20-20v-55h-55c-11.046875 0-20-8.953125-20-20s8.953125-20 20-20h55v-55c0-11.046875 8.953125-20 20-20s20 8.953125 20 20v55h55c11.046875 0 20 8.953125 20 20zm0 0"/></svg>
                        <span>Upload Image</span>
                        
                        </div>
                      
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        style={{display:"none"}}
                        // value={this.state.input}
                        onChange={this.handleMultipleImage}
                      />
                    </>
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
                        <button onClick={()=>{this.removeIMAGE(img)}}><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg></button>
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
          <input className="tab tab-active" type="submit" />
        </form>
      </>
    );
  }
}


  
 
