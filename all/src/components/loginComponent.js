import React, {Component} from 'react';
import axios from 'axios';

class register extends Component {  
    constructor(props){
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: '',
            password: ''
        }
    }

    onChangeEmail(e){
        e.preventDefault();
        this.setState({
            email: e.target.value
        })
    }

    onChangePassword(e){
        e.preventDefault();
        this.setState({
            password: e.target.value
        })
    }

    async onSubmit(e){
        e.preventDefault();

        try {

            const config = {
                headers:{
                    'Content-Type' : 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }

            await axios({
                method: 'post',
                url: 'http://localhost:5000/user/login/',
                data: {
                    email: this.state.email,
                    password: this.state.password
                },
                headers : config.headers,
            })
        } catch (err) {
            alert(err)
        }
        console.log("Logged In successfully")
        //window.location = 'http://localhost:3000/'
    }


    render(){
        return(
            <div>
                <h2>Login Page</h2>
                <hr />
                <form onSubmit= {this.onSubmit}>
                    <p>Email: <input type= 'text' value= {this.state.email} onChange = {this.onChangeEmail} /></p>
                    <p>Password: <input type= 'text' value= {this.state.password} onChange = {this.onChangePassword} /></p>
                    <button type= 'submit'>Submit</button>
                </form>
            </div>
        );
    }
}

export default register;