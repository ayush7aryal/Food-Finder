// import React, {useState} from 'react';
// import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import MapGL, { Marker, Popup } from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import '../css_styles/mapStyle.css'
import axios from 'axios'
import marker from './images/marker.png'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZS1uLWQiLCJhIjoiY2twMHZxNWt1MGtqejJwbXdyYWRhcGtlayJ9.JQqhBWRo_UsWmHcipmpn0Q'
 
const Map = ({sendLocation, getty}) => {

  const [showPopup, togglePopup] = useState(null);

  var [restaurant, setRestaurant] = useState([{
    id: '',
    name: '',
    location:{
      latitude: 0,
      longitude: 0
    }
  }])
  var [set, setSet] = useState(true);
  const [viewport, setViewport] = useState({
    latitude: 28.3949,
    longitude: 84.1240,
    zoom: 9
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  var [loc, setLoc] = useState({
      latitude: 28.3949,
      longitude: 84.1240
  });
 
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
 
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    // eslint-disable-next-line
    []
  );

  var location = async (e)=>{
    const locat = {
        longitude: e.lngLat[0],
        latitude: e.lngLat[1]
    }
    await sendLocation(locat)
    setLoc(locat);    
  }
  
  const _locateUser = async ()=> {
    
    navigator.geolocation.getCurrentPosition(async position => {
      var location ={
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      }
      setViewport({
        latitude: position.coords.latitude,
        longitude:position.coords.longitude,
        zoom: viewport.zoom
      })
      await sendLocation(location);
      setLoc(location)
    });
    
  }

  useEffect(()=>{
    if(set){
    if(getty){
    var center = {
      latitude: parseFloat(getty.latitude),
      longitude: parseFloat(getty.longitude),
      zoom: 15
    }
    console.log(getty)
    setViewport(center)
    setSet(false);
  }}
  },[getty,set])

  useEffect(()=>{
    axios({
      method:'get',
      url:'http://localhost:5000/restaurant/'
  })
      .then(result=>{
          const all = result.data
          setRestaurant(all);
      })
  },[])

  // Only rerender markers if props.data has changed
  const mark = React.useMemo(() => restaurant.map(
    result => (
      <Marker key={result.name} longitude={parseFloat(result.location.longitude)} latitude={parseFloat(result.location.latitude)} >
          <img src={marker} alt= '' key={result} onClick={()=>togglePopup(result)}/>
        {/*<div key={result} onClick={()=>togglePopup(result)}>Restaurant</div>*/}
      </Marker>
    )
  ), [restaurant]);

  return (
    <div className="mapcontainer">
        
      <MapGL
        ref={mapRef}
        {...viewport}
        width="98%"
        height="38rem" 
        // border="10px"
        mapStyle='mapbox://styles/e-n-d/ckp0xwsl831ha18mp8u8v9dd1'
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onClick={location}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
        />
        {!getty && (<Marker {...loc} offsetLeft={-20} offsetTop={-10}> 
            <div>Here</div>
        </Marker>)}
        {mark}
        {showPopup && <Popup
          latitude={parseFloat(showPopup.location.latitude)}
          longitude={parseFloat(showPopup.location.longitude)}
          closeButton={true}
          closeOnClick={false}
          onClose={() => togglePopup(false)}
          anchor="top" 
          offsetLeft={20}
          offsetTop={10} >
          <div>{showPopup.name}</div>
        </Popup>}
      </MapGL>
      {!getty &&(<button className="getloc" onClick={_locateUser}>Get Current Location</button>)}
    </div>
  );
};
 
export default Map

// export default function Map(){
//     const [viewport, setViewport] = useState({
//         latitude: 45,
//         longitude: -75,
//         width: '800px',
//         height: '800px',
//         zoom: 8
//     });

//     return(
//         <div>
//             <ReactMapGL
//                 {...viewport}
//                 mapboxApiAccessToken = 'pk.eyJ1IjoiZS1uLWQiLCJhIjoiY2twMHZxNWt1MGtqejJwbXdyYWRhcGtlayJ9.JQqhBWRo_UsWmHcipmpn0Q'
//                 mapStyle = 'mapbox://styles/e-n-d/ckp0xwsl831ha18mp8u8v9dd1'
//                 onViewportChange={viewport => {
//                     setViewport(viewport);
//                 }}
//                 />                
//         </div>
//     )
// }