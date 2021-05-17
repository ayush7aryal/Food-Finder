import React, {Component} from 'react';
import {Image} from 'cloudinary-react';
import axios from 'axios';
import '../css_styles/similarsStyle.css'

class restaurant extends Component {  

    constructor(props){
        super(props);

        this.state = ({
            Restaurant: {
                name: '',
                email: '',
                description: '',
                contact: '',
                mainPhoto: '',
                category: [],
                bestSeller: {
                    title: '',
                    price: '',
                    description: '',
                    image: ''
                },
                menu: [{}],
                location:{
                    latitude: '',
                    longitude: ''
                }
            },
            images: [],
            similar: [{
                id: '',
                name: '',
                mainPhoto: '',
                location: {
                    latitude: '',
                    longitude: ''
                }
            }]
        });
    }

    async componentDidMount(){
        try {
            const id = this.props.match.params.id;
            await axios({
                method: 'get',
                url: `http://localhost:5000/restaurant/${id}`,
            })
                .then(res => {
                    const Restaurant = res.data;
                    if(!Restaurant){
                        alert("Could not find the restaurant you are looking for!")
                        window.location = 'http://localhost:3000/';
                    } else{
                        this.setState({
                            Restaurant: Restaurant
                        });
                    }
                })
                .catch(err => console.error(err))
                
        
            await axios({
                method: 'get',
                url: `http://localhost:5000/api/images/${id}`,
            })
                .then(res =>{
                    const data = res.data
                    this.setState({
                        images: data
                    })
                })
                .catch(err => alert(err))
                
            await axios({
                method: 'post',
                url: 'http://localhost:5000/restaurant/similar',
                data: {
                    id: id
                }
            })
                .then(res =>{
                    const similar = res.data
                    this.setState({
                        similar: similar
                    })
                })
                .catch(err => alert(err))
        } catch (err) {
            alert(err)
        }
    }

    render(){

        const renderCategory = ()=>{
            const category = this.state.Restaurant.category.map((result,index) => {
                return (<li>{ result }</li>)
              });
            return <div><ul>{category}</ul></div>
        }

        const renderSimilar = ()=>{
            const ren = this.state.similar.map((result, index)=>{
                return (<div className="container">
                        <Image
                            key={index}
                            cloudName='foodfinder'
                            publicId={result.mainPhoto}
                            height='150'
                            crop='scale'
                    />
                        <div class="labels">
                        <label className="labels">{result.name}</label><br />
                        <label className="labels">Lat: {result.location.latitude} Lon: {result.location.longitude}</label>
                        </div>
                        </div>)               
        
            })
            return <div className="Similars">{ren}</div>
        }

        return(
            <div>
                <h1>Restaurant</h1>
                <hr />
                {console.log(this.state.Restaurant)}
                <div className="info">
                    {this.state.Restaurant.name}
                    <Image
                        key={this.state.Restaurant._id}
                        cloudName='foodfinder'
                        publicId={this.state.Restaurant.mainPhoto}
                        width='800'
                        height='800'
                        crop='scale'
                    />
                    <div className="catcon">
                        <div id="contact">
                            <ul>
                                <li>{this.state.Restaurant.contact}</li>
                                <li>{this.state.Restaurant.email}</li>
                            </ul>
                        </div>
                    </div>
                    <div id="des">
                        {this.state.Restaurant.description}
                    </div>
                    {renderCategory()}
                    <div id="bestseller">
                        <h3>Bestseller</h3>
                        <div className="bDes">
                            <Image
                                key={this.state.Restaurant.mainPhoto}
                                cloudName='foodfinder'
                                publicId={this.state.Restaurant.bestSeller.image}
                                width='500'
                                height='450'
                                crop='scale'
                            />
                            <h2>{this.state.Restaurant.bestSeller.title}</h2>
                            <h3>{this.state.Restaurant.bestSeller.description}</h3>
                            <label>Price: {this.state.Restaurant.bestSeller.price}</label>
                        </div>
                    </div>
                    <div className="Map">
                        <h3>Map</h3>
                    </div>
                    <hr />
                    <div className="recommendation">
                        <h3>Similar like this</h3>
                        <hr />
                        {renderSimilar()}
                    </div>
                </div>
            </div>
        );
    }
}

export default restaurant;

