import React,{ Component}  from 'react';
import {Image} from 'cloudinary-react';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel';
import '../css_styles/similarsStyle.css';
import AboutFood from './images/foodAbout.png';
import Footer from './Elements.js'


class home extends Component{
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
            images: []
        });
    }

    async componentDidMount(){
        try {
            await axios({
                method: 'get',
                url: `http://localhost:5000/restaurant/`,
            })
                .then(res => {
                    const Restaurant = res.data;
                    console.log(Restaurant);
                    Restaurant.map(ins => {
                        let photo = ins.mainPhoto;
                        this.state.images.push(photo);
                        return null;
                    })

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
        } catch (err) {
            alert(err)
        }
    }

    render(){

        const renderImages = ()=>{
            const images = this.state.images.map((result, index)=>{
    
                return (<Image
                        key={result + index}
                        cloudName='foodfinder'
                        publicId={result}
                        width='1400'
                        height='700'
                        crop='scale'
                    />)
            })
    
            // return (<Carousel slides={images} autoplay={true} interval={1000}/>)
            return (
                <div className="Carousel">
                    <Carousel navButtonsAlwaysVisible = 'true' animation="slide">
                        {images}
                    </Carousel>
                </div>
                
            )
        } 
        const renderPopularity =() => {
            const cardsData = [
                {id: 1, title: 'Bajeko Sekuwa', content: 'Thamel', imgUrl: 'https://unsplash.it/200/200'},
                {id: 2, title: 'Jack\'s Momo', content: 'Upper Mustang', imgUrl: 'https://unsplash.it/201/200'},
                {id: 3, title: 'Katti Roll', content: 'Lainchour', imgUrl: 'https://unsplash.it/200/201'},
                {id: 4, title: 'Pizza corner', content: 'Halchowk', imgUrl: 'https://unsplash.it/201/201'},
                {id: 5, title: 'Burger House', content: 'Balaju', imgUrl: 'https://unsplash.it/202/200'},
                {id: 6, title: 'Burger House', content: 'Upper Mustang', imgUrl: 'https://unsplash.it/200/199'},
                {id: 7, title: 'Burger House', content: 'Upper Mustang', imgUrl: 'https://unsplash.it/199/199'},
                {id: 8, title: 'Burger House', content: 'Upper Mustang', imgUrl: 'https://unsplash.it/199/200'},
                {id: 9, title: 'Tatopani House', content: 'Upper Mustang', imgUrl: 'https://unsplash.it/200/198'},
                {id: 10, title: 'Samkosa House', content: 'Upper Mustang', imgUrl: 'https://unsplash.it/198/199'},
              ]
            
            function handlingClickedCard(props){
                console.log(`this is ${props.title}`);
            }

            const Card = (props) => (
            <div className='card' onClick={() => handlingClickedCard(props)}>  
                <img src={ props.imgUrl } 
                alt={ props.alt || 'Image' } />
                <div className="card-content">
                <h2>{ props.title }</h2>
                <p>{ props.content }</p>
                </div>
            </div>
            );

            const CardContainer = (props) => (
                <div className="cards-container">
                  {
                    props.cards.map((card) => (
                      <Card title={ card.title }
                        content={ card.content }
                        imgUrl={ card.imgUrl } />
                    ))
                  }
                </div>
              );
              

            return(
                <div>
                    <h1 style={{textAlign : 'center' }}>Popular spots</h1>
                    <div>
                        <CardContainer cards={cardsData}/>
                    </div>
                </div>
            );
        }

        const renderAboutUs =() =>{
            return(
                <div className='About-container'>
                    <div className='aboutContent'>
                        <h1>About us</h1>
                        <hr style={{width:"40%"}}/>
                        <p>The problem with this syntax is that a different callback is created each time the LoggingButton renders. In most cases, this is fine. However, if this callback is passed as a prop to lower components, those components might do an extra re-rendering. We generally recommend binding in the constructor or using the class fields syntax, to avoid this sort of performance problem. </p>
                    </div>
                    <div className='aboutImg'>
                        <img src={AboutFood} alt="/beautiful food"/>
                    </div>
                </div>
            );
        }
        return(
            <div>
                <div>
                    {renderImages()}
                </div> 
                <div className="container">
                    {renderPopularity()}
                </div>
                <div>
                    {renderAboutUs()}
                </div>
                <Footer/>
                
            </div>
        )
            
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

