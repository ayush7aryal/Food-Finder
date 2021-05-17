import React, {Component} from 'react';
import axios from 'axios';

class register extends Component {  
    constructor(props){
        super(props);

        this.onChangefirstName = this.onChangefirstName.bind(this);
        this.onChangelastName = this.onChangelastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: ''
        }
    }

    onChangefirstName(e){
        e.preventDefault();
        this.setState({
            firstName: e.target.value
        })
    }

    onChangelastName(e){
        e.preventDefault();
        this.setState({
            lastName: e.target.value
        })
    }

    onChangeEmail(e){
        e.preventDefault();
        this.setState({
            email: e.target.value
        })
    }

    onChangePhone(e){
        e.preventDefault();
        this.setState({
            phone: e.target.value
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
            await axios({
                method: 'post',
                url: 'http://localhost:5000/user/register/',
                data: {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    phone: parseInt(this.state.phone, 10),
                    password: this.state.password
                },
                headers : {'content-Type': 'application/json'},
            })
                .then((res)=>{
                    // console.log(res.data)
                    localStorage.setItem('token', res.data.accesstoken)
                })
        } catch (err) {
            alert(err)
        }

        window.location = 'http://localhost:3000/user/login'
    }


    render(){
        return(
            <div>
                <h2>Register Page</h2>
                <hr />
                <form onSubmit= {this.onSubmit}>
                    <p>First Name: <input type= 'text' value= {this.state.firstName} onChange = {this.onChangefirstName} /></p>
                    <p>Last Name: <input type= 'text' value= {this.state.lastName} onChange = {this.onChangelastName} /></p>
                    <p>Email: <input type= 'text' value= {this.state.email} onChange = {this.onChangeEmail} /></p>
                    <p>Phone: <input type= 'text' value= {this.state.phone} onChange = {this.onChangePhone} /></p>
                    <p>Password: <input type= 'text' value= {this.state.password} onChange = {this.onChangePassword} /></p>
                    <button type= 'submit'>Submit</button>
                </form>
            </div>
        );
    }
}

export default register;