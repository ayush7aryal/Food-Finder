import React, {Component} from 'react';
import {Image} from 'cloudinary-react';
import axios from 'axios';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Carousel from 'react-material-ui-carousel'
import '../css_styles/similarsStyle.css'

class restaurant extends Component {  

    constructor(props){
        super(props);

        this.state = ({
            Restaurant: {
                id: '',
                name: '',
                email: '',
                description: '',
                contact: '',
                mainPhoto: '',
                category: [],
                menus: [{
                    title: '',
                    description: '',
                    image: '',
                    price : ''
                }],
                bestSeller: {
                    title: '',
                    price: '',
                    description: '',
                    image: ''
                },
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
                    console.log(res)
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
                return (<li key={result + index}>{ result }</li>)
              });
            return <div><ul>{category}</ul></div>
        }

        const renderSimilar = ()=>{
            const ren = this.state.similar.map((result, index)=>{
                return (<div key={result.name + index} className="container">
                        <Image
                            key={index}
                            cloudName='foodfinder'
                            publicId={result.mainPhoto}
                            height='150'
                            crop='scale'
                    />
                        <div className="labels">
                        <label className="labels">{result.name}</label><br />
                        <label className="labels">Lat: {result.location.latitude} Lon: {result.location.longitude}</label>
                        </div>
                        </div>)               
        
            })

            const Arrow = ({ text, className }) => {
                return (
                  <div
                    className={className}
                  >{text}</div>
                );
              };
              
              const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
              const ArrowRight = Arrow({ text: '>', className: 'arrow-next' }); 

              return (
                  <div className="a">
                      <ScrollMenu
                        data={ren}
                        arrowLeft={ArrowLeft}
                        arrowRight={ArrowRight}
                      />
                  </div>
              )
        }

        const renderMenus = ()=>{
            const menus = this.state.Restaurant.menus.map((result, index)=>{
                return (<div key={result.title + index} className="container">
                    <Image
                        key={index}
                        cloudName='foodfinder'
                        publicId={result.image}
                        height='150'
                        crop='scale'
                    />
                    <div className="labels">
                        <label>{result.title}</label> <br />
                        <label>{result.description}</label> <br />
                        <label>Price: {result.price}</label> <br />
                    </div>
                </div>)
            })

            
            return (<>MENUS: 
                <div className="Menu">{menus}</div> </>
                )
        }

        const renderImages = ()=>{
            const images = this.state.images.map((result, index)=>{

                return (<Image
                        key={result + index}
                        cloudName='foodfinder'
                        publicId={result}
                        width='800'
                        height='500'
                        crop='scale'
                    />)
            })

            // return (<Carousel slides={images} autoplay={true} interval={1000}/>)
            return (
                <div className="Carousel">
                    <Carousel navButtonsAlwaysVisible = 'true'>
                    {images}
                </Carousel>
                </div>
                
            )
        }

        return(
            <div>
                <h1>Restaurant</h1>
                <hr />
                <div className="info">
                    {this.state.Restaurant.name}
                    <div className='Images'>
                        {renderImages()}
                    </div>                    
                    <div className="catcon">
                        <div id="contact">
                            <ul>
                                <li key='contact'>{this.state.Restaurant.contact}</li>
                                <li key='email'>{this.state.Restaurant.email}</li>
                            </ul>
                        </div>
                    </div>
                    <div id="des">
                        {this.state.Restaurant.description}
                    </div>
                    {renderCategory()}
                    {renderMenus()}
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

