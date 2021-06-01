import React, {Component} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'

class login extends Component {  
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
            await axios({
                method: 'post',
                url: 'http://localhost:5000/user/login/',
                data: {
                    email: this.state.email,
                    password: this.state.password
                }                
            }, {withCredentials:true}).then(res=> {
                localStorage.setItem("token", res.data.accesstoken)
                localStorage.setItem('isLogged', true)
                Cookies.set("refreshtoken", res.data.refreshtoken, { expires: 7, path: '/' })
                console.log("Logged In successfully")
                return res
            })

            var cart_session = JSON.parse(sessionStorage.getItem('cart'))
            if(cart_session){
                if(cart_session !== []){
                    let config = {
                        headers :{
                            'Authorization' : localStorage.getItem('token')
                        }
                    }
                    await axios.get('http://localhost:5000/user/info',config)
                        .then((res) =>{
                            var count = 0;
                            var cart = cart_session.filter((result)=>{
                                var pass = true;
                                for(count = 0; count < res.data.cart.length; count ++){
                                    if(result === res.data.cart[count]) pass = false
                                }
                                return pass;
                            })
                            console.log(cart)
                            axios.post('http://localhost:5000/user/addCart',{
                                cart
                            },config)
                                .then((res)=> {
                                    console.log(res)
                                    sessionStorage.setItem('cart',JSON.stringify([]))
                                })
                        })
                }
            }
            
        } catch (err) {
            alert(err)
        }
        
        
        window.location = 'http://localhost:3000/'
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

export default login;