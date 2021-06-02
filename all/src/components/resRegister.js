import React, { Component } from 'react';
import axios from 'axios';
import Menu from './menuComponent';
import Map from './mapComponent';

export default class resRegister extends Component {
    constructor(props){
        super(props);

        this.state ={
            id: 0,
            name: '',
            email: '',
            category: [],
            description: '',
            contact: '',
            input: '', //for image handling
            selected: '', //for image handling
            preview: '', //for image handling
            menu: [{
                title: '',
                price: '',
                description: '',
                image: ''
            }],
            bestSeller: {
                title: '',
                price: '',
                description: '',
                image: ''
            },
            location: {
                latitude: 0,
                longitude: 0
            }
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        //for category
        this.onAddCategory = this.onAddCategory.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onRemoveCategory = this.onRemoveCategory.bind(this);

        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeContact = this.onChangeContact.bind(this);
        //for images both for main photo and menu's photo
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
        this.previewImage = this.previewImage.bind(this);
        this.uploadImage = this.uploadImage.bind(this);

        this.onChangelatitude = this.onChangelatitude.bind(this);
        this.onChangelongitude = this.onChangelongitude.bind(this);

        this.getMenu = this.getMenu.bind(this)
        this.sendLocation = this.sendLocation.bind(this)

        this.onSubmit = this.onSubmit.bind(this);
    }

    mainPhoto = '';

    //name
    onChangeName(e){
        e.preventDefault();
        this.setState({
            name: e.target.value
        })
    }
    //email
    onChangeEmail(e){
        e.preventDefault();
        this.setState({
            email: e.target.value
        })
    }
    //category
    onAddCategory(e){
        e.preventDefault()
        this.setState({
            category: [...this.state.category, "" ]
        })
    }

    onChangeCategory(e, index){
        e.preventDefault()
        // eslint-disable-next-line
        this.state.category[index] = e.target.value

        this.setState({
            category: this.state.category
        })
    }

    onRemoveCategory(index){
        this.state.category.splice(index,1)

        //update the state
        this.setState({category: this.state.category})
    }

    //description
    onChangeDescription(e){
        e.preventDefault();
        this.setState({
            description: e.target.value
        })
    }

    //Contact
    onChangeContact(e){
        e.preventDefault();
        this.setState({
            contact: e.target.value
        })
    }

    //for all imange input handling of main Photo only
    handleFileInputChange(e){ 
        e.preventDefault()
        const file = e.target.files[0];
        this.previewImage(file);
        this.setState({
            selected : file,
            input : e.target.value
        })
    }

    //for viewing all kind of images
    previewImage( file){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend =()=>{
            this.setState({
                preview : reader.result
            })
        }
        reader.onerror = (err)=>{
            alert(err)
        }
    }

    // for location
    onChangelatitude(e){
        e.preventDefault();
        this.setState({
            location:{
                latitude: e.target.value,
                longitude: this.state.location.longitude
            }
        })
    }

    onChangelongitude(e){
        e.preventDefault();
        this.setState({
            location:{
                latitude: this.state.location.latitude,
                longitude: e.target.value
            }
        })
    }
    
    async uploadImage(base64EncodedImage){ //for uploading images to cloudinary
        try {
            const img = await axios({
                method: 'post',
                url: 'http://localhost:5000/api/upload/',
                data: {fileStr : base64EncodedImage,
                id: this.state.id},
                headers : {'content-Type': 'application/json'},
            })
                .then(res =>{
                    console.log("response from upload image",res)
                    this.mainPhoto = res.data.public_id + ''
                })
            this.setState({
                input : '',
                preview: '',
            })
            console.log(img)
            console.log("Uploaded successfully")
        } catch (err) {
            alert(err)
        }
    }

    async onSubmit(e){
        e.preventDefault();
        try {
            if(!this.state.selected) {
                console.log("no selectedFile")
                return
            }
            const img_upload = await this.uploadImage(this.state.preview);
            console.log(img_upload)
            await axios({
                method: 'post',
                url: 'http://localhost:5000/restaurant/post',
                data: {
                    id: this.state.id,
                    name: this.state.name,
                    email: this.state.email,
                    category: this.state.category,
                    description: this.state.description,
                    contact : parseInt(this.state.contact, 10),
                    mainPhoto: this.mainPhoto,
                    menus: this.state.menu,
                    bestSeller: this.state.menu[0],
                    location: this.state.location
                }
            })
                .then(res =>{
                    console.log(res)
                })
        } catch (err) {
            alert(err)
        }
    }

    getMenu(menu){
        if(this.state.menu[0].title === ''){
            this.setState({
                menu: [menu]
            })
        } else {
            this.setState({
                menu: [...this.state.menu, menu]
            })
        }
        this.setState({
            bestSeller: this.state.menu[0]
        })
    }
    sendLocation(location){
        this.setState({
            location:{
                latitude: location.latitude,
                longitude: location.longitude
            }
        })
    }

    componentDidMount(){
        axios({
            method: 'post',
            url: 'http://localhost:5000/restaurant/getId'
        })
            .then(res =>{
                var id = res.data
                this.setState({
                    id: id
                })
            }) 
    }

    render() {
        return (
            <>
                <form className="form" onSubmit={this.onSubmit}>
                    <div>
                        <div className="form-input">
                            <h2>Restaurant Register</h2>
                            <hr />
                            <label>Restaurant Name: <input type= "text" value={this.state.name} onChange={this.onChangeName} /></label>
                            <label>Restaurant Email: <input type= "text" value={this.state.email} onChange={this.onChangeEmail} /></label>
                            <label>Category: 
                                {this.state.category.map((result, index)=>{
                                    return (
                                        <div key={index}>
                                            <input type="text" value={result} onChange={(e)=>this.onChangeCategory(e, index)} />
                                            <button type="button" onClick={()=>this.onRemoveCategory(index)}>Remove</button>
                                        </div>
                                    )
                                })} 
                                <button type="button" onClick = {this.onAddCategory}>Add Category</button>
                            </label>    
                            <label>Restaurant Description: <input type= "text" value={this.state.description} onChange={this.onChangeDescription} /></label>
                            <label>Restaurant Contact: <input type= "text" value={this.state.contact} onChange={this.onChangeContact} /></label>
                        </div>
                        <div className="image">
                            <h3>Signature Photo:</h3> 
                            <input type= "file" value={this.state.input} onChange={this.handleFileInputChange} />
                            {this.state.preview && (
                                <img src={this.state.preview}
                                    alt="chosen"
                                    style={{height:'300px'}}
                                />
                            )}
                        </div>
                    </div>
                    <div className="location">
                            <h3>Location</h3>
                            <Map sendLocation={this.sendLocation} />
                            <label>Latitude: <input type= "number" value={this.state.location.latitude} onChange={this.onChangelatitude} /></label>
                            <label>Longitude: <input type= "number" value={this.state.location.longitude} onChange={this.onChangelongitude} /></label>
                    </div>
                    <div className="menu">
                        <label>Menus:</label>
                        <hr />
                        <Menu 
                            sendDataToParent = {this.getMenu}
                            dataFromParent = {this.state.id}
                        />
                    </div>
                    <input type="submit" />
                </form>  
            </>
        )
    }
}


