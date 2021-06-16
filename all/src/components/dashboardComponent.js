import axios from 'axios';
import React, {Component} from 'react';
import {Image} from 'cloudinary-react';
import searchIcon from './images/search-solid.svg';
import '../css_styles/dashboardComponent.css';
import Footer from './Elements.js'

class dashboard extends Component {
    constructor(props){
        super(props)

        this.state = ({
            restaurants:[{
                id: '',
                location: {
                    latitude: '',
                    longitude: ''
                },
                name: '',
                mainPhoto: '',
                menus:[],
            }],
            searchTerm:'menu',
            text: '',
            suggestions: []
        })

        this.onChangeText =this.onChangeText.bind(this);
        this.onClickText =this.onClickText.bind(this);
        this.rendersuggestions = this.rendersuggestions.bind(this);
        this.renderCatagories = this.renderCatagories.bind(this);

    }

    async componentDidMount(){
        await axios({
            method:'get',
            url:'http://localhost:5000/restaurant/'
        })
            .then(result=>{
                const all = result.data
                this.setState({
                    restaurants: all
                })
                console.log(this.state.restaurants);
            })
    }

    onClickText(e){
        const value = this.state.text;
        let suggestions = [];
        if(value.length > 0){
            const regex = new RegExp(`${value}`, 'i');
            if(this.state.searchTerm === 'restaurant'){
                // console.log(this.state.restaurants);
                suggestions = this.state.restaurants.sort().filter(v => regex.test(v.name));
            }else if(this.state.searchTerm === 'menu'){
                this.state.restaurants.forEach(res =>  {
                    res.menus.forEach(menu => suggestions.push({menu:menu,id:res.id}));
                });
                suggestions = suggestions.sort().filter(v => regex.test(v.menu.title)); 
                // console.log(suggestions) ;
            }
            
        } 
        console.log(suggestions);
        this.setState(() => ({suggestions: suggestions, text: value}));
    }

    onChangeText(e){
        const value =  e.target.value;
        this.setState(() => ({text: value}));
    }

    renderCatagories(){
        const MenuCataSection = () =>(
            <div className="selection">
                <form className="selectionChild">
                    <label>Catagories : </label>
                    <select name="catagories" id="catagory">
                    <option value="" selected disabled hidden>Choose here</option>
                        <option value="BreakFast">BreakFast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Desert">Desert</option>
                    </select>
                </form>

                <form className="selectionChild">
                    <label>Sort By : </label>
                    <select name="sortBy" id="sortBy">
                    <option value="" selected disabled hidden>Choose here</option>
                        <optgroup label="price">
                            <option value="lowToHigh">Low to High</option>
                            <option value="highToLow">High to Low</option>
                        </optgroup>
                    </select>
                </form>
            </div>
        );

        const RestaurantCataSection = () => (
            <div className="selection">
                <form className="selectionChild">
                    <label>Catagories</label>
                    <select name="catagories" id="catagory">
                    <option value="" selected disabled hidden>Choose here</option>
                        <option value="Nepali">Nepali</option>
                        <option value="Indian">Indian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Italian">Italian</option>
                    </select>
                </form>

                <form className="selectionChild">
                    <label>Sort By</label>
                    <select name="sortBy" id="sortBy">
                    <option value="" selected disabled hidden>Choose here</option>
                        <option value="volvo">Popularity</option>
                        <option value="saab">Distance</option>
                        <option value="opel">Recently added</option>  
                    </select>
                </form>
            </div>
        );

        return(
            this.state.searchTerm === "menu" ? <MenuCataSection/> : <RestaurantCataSection/>
        )
    }

    rendersuggestions(){
        const { suggestions} = this.state;

        const CardContainer = (props) => (
            <div className="card-container">
              {suggestions.map((item, index) => 
                    <Card 
                        itemProp = {item}
                        title={item.name ? item.name : item.menu.title} 
                        imgUrl={item.mainPhoto ? item.mainPhoto : item.menu.image}
                        key = {item.id ? item.id : item.id}
                        />  
                )}
            </div>
          );

        const Card = (props) => (
            <div className='cardItem' onClick = {()=> this.suggestionSelected(props.itemProp)}>  
                <Image
                        key={props.key}
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

        if (suggestions.length === 0 ){
          return <div style={{height:"33vh"}}></div>;
        }
        return <CardContainer/>  
    }

    suggestionSelected(value){
        this.setState({
          text : value.name,
          suggestions: [],
        });
        console.log(value)
        window.location = `http://localhost:3000/restaurant/${value.id}`
    }

    changeSearchTerm(){
        this.state.searchTerm === "menu" ? this.setState({searchTerm : "restaurant"}) : this.setState({searchTerm : "menu"});
    }
    
    // 
    render(){
        return(
            <div>
                <div className="search-section">
                    <input className="search-input" value={this.state.text} onChange={this.onChangeText} placeholder={`Enter ${this.state.searchTerm} name...`}/>
                    <button className="search-btn" onClick={this.onClickText}><img src={searchIcon}/></button>
                </div>
                <div className="search-change-section">
                        Search By :  <button onClick={() => this.changeSearchTerm()}>{this.state.searchTerm} Title</button>
                        
                </div>
                <div>{this.renderCatagories()}</div>
                <div>{this.rendersuggestions()}</div>
                <Footer/>
            </div>
        );
    }
}

export default dashboard;


{/* search bar  */}
 {/* <div className="search-bar">
    <div>
        <input value={this.state.text} onChange={this.onChangeText} placeholder='Search here'/>
        <button type="button"className="restaurantSearch" onClick={this.searchByRestaurant()}>Restaurant </button>
        <button type="button" className="foodSearch" onClick={this.searchByFood()}>Food </button>
    </div>
    {this.rendersuggestions()}
</div> 

 searchByRestaurant(){

    }

    searchByFood(){

    }
<li 
    key={item + index} 
    className='list' 
    onClick = {()=> this.suggestionSelected(item)}>{item.name}
</li>  */}
