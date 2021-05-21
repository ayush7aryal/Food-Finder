import axios from 'axios';
import React, {Component} from 'react';


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
            }],
            text: '',
            suggestions: []
        })

        this.onChangeText =this.onChangeText.bind(this);
        this.rendersuggestions = this.rendersuggestions.bind(this);
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
            })
    }

    onChangeText(e){
        const value = e.target.value;
        let suggestions = [];
        if(value.length > 0){
            const regex = new RegExp(`${value}`, 'i');
            suggestions = this.state.restaurants.sort().filter(v => regex.test(v.name));
        } 
        this.setState(() => ({suggestions: suggestions, text: value}));
    }

    rendersuggestions(){
        const { suggestions} = this.state;
        if (suggestions.length === 0 ){
          return null;
        }
        return(
          <ul>
            {suggestions.map((item, index) => <li key={item + index} className='list' onClick = {()=> this.suggestionSelected(item)}>{item.name}</li>)}
          </ul>
        );
      }
    
    suggestionSelected(value){
        this.setState({
          text : value.name,
          suggestions: [],
        });
        window.location = `http://localhost:3000/restaurant/${value.id}`
      }

    render(){
        return(
            <div>
                <h1>Dashboard</h1>
                <div className="search-bar">
                    <input value={this.state.text} onChange={this.onChangeText} placeholder='Search here'/>
                    {this.rendersuggestions()}
                </div>
            </div>
        );
    }
}

export default dashboard;

