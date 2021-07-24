import { BrowserRouter as Route,Link} from 'react-router-dom';
import '../css_styles/elementStyle.css'
import facebook from './images/facebook.png'
import instagram from './images/instagram.png'
import blogger from './images/blogger.png'
import { NavLink } from 'react-router-dom'


const Footer = () => {

    const checkLogin = () => {
        if(localStorage.getItem("isLogged") === "true") 
            {
                window.location = "http://localhost:3000/restaurant/register";
            }else{
                window.location = "http://localhost:3000/restaurant/register";
                // window.location = "http://localhost:3000/user/login";
            }      
    }

    return (
        <footer className='footerAllElements'>
            <ul className='termsConditions'>
                {/*link inside <li>*/}
                <li>Legal</li>
                <li>Terms & Conditions</li>
                <li>Privacy and Policy</li>
            </ul>
            <div className='connectWithUs'>Connect with us</div>
            <ul className='list'>
                <li className='fb'><NavLink to='/'><img alt="" src={facebook}/></NavLink></li>
                <li className='insta'><NavLink to='/'><img alt="" src={instagram}/></NavLink></li> 
                <li className='blogger'><a href='https://foodfinderlogs.blogspot.com/' target='_/blank'><img alt="" src={blogger}/></a></li> 
            </ul>
            <p className='connectWithUs' style={{marginLeft: 60}}>Are you a Restaurant Owner?</p>
            <button className='registerBtn' onClick={checkLogin}>List Your Restaurant</button>
            
            <div className='copyright'>
                <span>&#169; FoodFinder 2021</span>
            </div>
        </footer>
    )
}

const BrowseBtn = () => {
    return (
        <button onClick = {console.log('Some Function Here')} className = 'browseBtn'>
            Browse all
        </button>
        
    )
}





export {Footer};
export default BrowseBtn;
// export default Footer;

