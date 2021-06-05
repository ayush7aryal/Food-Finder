import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Image } from 'cloudinary-react';
import '../css_styles/similarsStyle.css'

var cart_items = ()=>{
    if(sessionStorage.getItem('cart') && localStorage.getItem('isLogged') !== 'true'){
        console.log(JSON.parse(sessionStorage.getItem('cart')))
        return JSON.parse(sessionStorage.getItem('cart'))
    } else{
        return []
    }
}

const Cart = ()=>{

    var [cart,setCart] = useState(cart_items)
    var [total, setTotal] = useState([])

    useEffect(()=>{
        if(localStorage.getItem('isLogged') === 'true'){
            let config = {
                headers :{
                    'Authorization' : localStorage.getItem('token')
                }
            }                
            axios.get('http://localhost:5000/user/info',config)
                .then((res) =>{
                    var cart_temp = res.data.cart
                    setCart(cart_temp)
                    console.log(cart_temp)
                    var i = 0;
                    var t = [];
                    for( i = 0; i < cart_temp.length; i++ ){
                        t[t.length] = 1;
                    }
                    setTotal(t);
                })
                .catch((err)=> console.log(err))
        } else{
            console.log(cart)
            var i = 0;
            var t = [];
            for( i = 0; i < cart.length; i++ ){
                t[t.length] = 1;
            }
            setTotal(t);
        }
    },[])
    
    const subtract = (index)=>{
        var temp = [...total];
        if(temp[index] >1) temp[index]--
        setTotal(temp)
    }

    const add = (index)=>{
        var temp = [...total]
        temp[index]++
        setTotal(temp)
    }

    const remove = async (index)=>{
        console.log(index)
        var temp = [...cart];
        temp.splice(index, index+1);
        setCart(temp);
        if(localStorage.getItem('isLogged') !== 'true'){
            sessionStorage.setItem('cart', JSON.stringify(temp))
        } else{
            let config = {
                headers :{
                    'Authorization' : localStorage.getItem('token')
                }
            }     
            await axios.post('http://localhost:5000/user/changeCart',{
                cart: temp
            },config)
        }
        
    }

    const renderCart = (total)=>{

        const menus = cart.map((result, index)=>{
            return (<div key={'0' + index} className="container">
                <div>
                    <Image
                        key={index}
                        cloudName='foodfinder'
                        publicId={result.menu.image}
                        height='150'
                        crop='scale'
                    />
                    <div className="labels">
                        <label>{result.menu.title}</label> <br />
                        <label>{result.menu.description}</label> <br />
                        <label>Price: {result.menu.price}</label> <br />
                    </div>
                        <div>
                            <button key={'btn' + index} onClick={()=>subtract(index)}>-</button>
                            {total[index]}
                            <button onClick={()=> add(index)}>+</button>
                        </div>
                        Price: {result.menu.price * total[index]}
                        <button onClick={()=> remove(index)}>Remove from Cart</button>
                </div>
            </div>)
            
        })

        return (
            <div className="Menu">{menus}</div>
            )
        
        }

    return(
        <div>
            Cart
            {renderCart(total)}
        </div>
    )
}

export default Cart;