import React, {Component} from 'react';
import axios from 'axios';
import '../css_styles/loginComponent.css';

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
            isDisabled:true,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            emailError:false,   
            passwordError:false, 

            wording: 'Show',
            type: 'password', 
        }
    }

    validateEmail(email){
        const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
        const result = pattern.test(email);
        if(result===true){
          this.setState({
            emailError:false,
            email:email
          })
        } else{
          this.setState({
            emailError:true
          })
        }
      }

    validatePassword(input){
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if(!re.test(input)){
            this.setState({
                passwordError:true
              })
        }else{
            this.setState({
                passwordError:false,
                password:input,
                isDisabled:false
              })
        };
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
        this.validateEmail(e.target.value);
    }

    onChangePhone(e){
        e.preventDefault();
        this.setState({
            phone: e.target.value
        })
    }

    onChangePassword(e){
        e.preventDefault();
        this.validatePassword(e.target.value);
    }

    changeState() {
        var oldState = this.state.type;
        var isTextOrHide = (oldState === 'password');
        var newState = (isTextOrHide) ? 'text' : 'password';
        var newWord = (isTextOrHide) ? 'Hide' : 'Show';
        this.setState({
          type: newState,
          wording: newWord
        })
    }

    async onSubmit(e){
        e.preventDefault();

        try {
            await axios({
              method: "post",
              url: "https://food-finder-jade.vercel.app/user/register/",
              data: {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                phone: parseInt(this.state.phone, 10),
                password: this.state.password,
              },
              withCredentials: true,
              headers: { "content-Type": "application/json" },
            }).then((res) => {
              // console.log(res.data)
              localStorage.setItem("token", res.data.accesstoken);
            });
        } catch (err) {
            alert(err)
        }

        window.location = 'https://food-finder-frontend-21sfvanyy-ayush7aryals-projects.vercel.app/'
    }

    render(){
        return(
            <div className="formBody">
                <div className="formContainer">

                    <form onSubmit= {this.onSubmit} className="form">
                    <h2>Register</h2>

                    <div class="form-control">
                        <input 
                            type= 'text' 
                            placeholder="First Name"
                            required aria-required="true"
                            value= {this.state.firstName}
                            onChange = {(e) => {this.onChangefirstName(e)}} />
                    </div>

                    <div class="form-control">
                        <input 
                            type= 'text' 
                            placeholder="Last Name"
                            required aria-required="true"
                            value= {this.state.lastName}
                            onChange = {(e) => {this.onChangelastName(e)}} />
                    </div>

                    <div class="form-control">
                        <input 
                            type= 'text'
                            placeholder="Email"
                            required aria-required="true"
                            onChange = {(e) => {this.onChangeEmail(e)}} />
                        {this.state.emailError ? <span style={{color: "red"}}>Please Enter valid email address. For exampe:test@test.com</span> : ''}
                    </div>

                    <div class="form-control">
                        <input 
                            type= 'number' 
                            placeholder="Phone Number"
                            required aria-required="true"
                            value= {this.state.phone}
                            onChange = {(e) => {this.onChangePhone(e)}} />
                    </div>
                    <div class="form-control">
                        <label>
                        <input 
                            type= {this.state.type} 
                            placeholder="Password"
                            required aria-required="true"
                            onChange = {(e) => {this.onChangePassword(e)}} />
                        <span className="password-trigger" onClick={()=>this.changeState()}>{this.state.wording}</span>
                        </label> 
                        {this.state.passwordError ? <span style={{color: "red"}}>
                            Password is invalid.A password must be between 8 to 15 characters which contain at least one lowercase, uppercase, digit, and special character. 
                        </span> : ''}
                    </div>

                    <button type= 'submit'
                    disabled={this.state.isDisabled} >Submit</button>
                    </form>
                </div>
            </div>
            
        );
    }
}

export default register;