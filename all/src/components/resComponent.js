import React, { Component } from 'react';
import axios from 'axios';
import {Image} from 'cloudinary-react';

export default class Restaurant extends Component{
    constructor(props){
        super(props)
        this.state = {
            Restaurant: {

            }
        }
    }

    async componentDidMount(){
        const id = this.props.match.params.id;
            await axios({
                method: 'get',
                url: `http://localhost:5000/restaurant/${id}`,
            })
                .then(res => {
                    const result = res.data;
                    console.log(res)
                    this.setState({
                        Restaurant: result
                    });
                    
                })
                .catch(err => console.error(err))
    }

    render(){
        return(<div>
            <h1>Restaurant</h1>
            {console.log(this.state.Restaurant)}
        </div>)
    }
}