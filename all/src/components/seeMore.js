import React,{useState} from 'react'
import renderMenus from 'restaurantComponent'
const Link = () => {
    const [SeeMore, setSeeMore] = useState(false);
    const text= SeeMore ? 'Show More' : 'Show Less';
    return (
        <div>
        <a className="SeeMoreText" onClick={()=>{setSeeMore(!SeeMore)}}><div>{text}</div></a>
        {renderMenus(SeeMore)}
        </div>
    )
}

export default Link
