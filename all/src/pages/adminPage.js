// import { React, useState, useEffect } from "react";
// import axios from "axios";
// import { Image } from "cloudinary-react";

// //for set Featured button
// const setFeatured = async (id) => {
//   let config = {
//     headers: {
//       Authorization: localStorage.getItem("token"),
//     },
//   };
//   await axios
//     .post("http://localhost:5000/admin/setFeatured", { id: id }, config)
//     .then((res) => {
//       alert(res.data.msg);
//     });
// };

// //for cancelFeatured button
// const cancelFeatured = async () => {
//   let config = {
//     headers: {
//       Authorization: localStorage.getItem("token"),
//     },
//   };
//   await axios.get("http://localhost:5000/admin/cancel", config).then((res) => {
//     alert(res.data.msg);
//   });
// };

// const AdminPage = () => {
//   const [restaurants, setRestaurants] = useState({});
//   const [role, setRole] = useState(false);

//   const refresh = async () => {
//     const config = {
//       withCredentials: true,
//     };
//     if (localStorage.getItem("isLogged") === "true") {
//       axios
//         .get("http://localhost:5000/user/refreshToken", config)
//         .then((res) => {
//             if(res.data.user.role === -2){
//                 if(role !== true) setRole(true);
//             } else{
//                 if(role !== false) setRole(false)
//             }
//         });
//     }
//   };

//   useEffect(() => {
//     axios({
//       method: "get",
//       url: "http://localhost:5000/restaurant/",
//     }).then((result) => {
//       const all = result.data;
//       setRestaurants(all);
//       console.log(restaurants);
//     });
//     refresh();
//   });

//   // yesma sab restaurant haru dekhau
//   const renders = ()=>{
//       return (<div></div>)
//   }

//   return (<>{role && renders()}</>)
// };

// export default AdminPage;


import { React, useState, useEffect } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";
// import "../css_styles/adminPage.css"

//for set Featured button
const setFeatured = async (id) => {
  console.log(id)
  let config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  await axios
    .post("http://localhost:5000/admin/setFeatured", { id: id }, config)
    .then((res) => {
      alert(res.data.msg);
    });
};

//for cancelFeatured button
const cancelFeatured = async () => {
  let config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  await axios
  .get("http://localhost:5000/admin/cancelFeatured", config)
  .then((res) => {
    alert(res.data.msg);
  });
};

const AdminPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [role, setRole] = useState(false);

  const refresh = async () => {
    const config = {
      withCredentials: true,
    };
    if (localStorage.getItem("isLogged") === "true") {
      axios
        .get("http://localhost:5000/user/refreshToken", config)
        .then((res) => {
            if(res.data.user.role === -2){
                if(role !== true) setRole(true);
            } else{
                if(role !== false) setRole(false)
            }
        });
    }
  };

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/restaurant/",
    }).then((result) => {
      const all = result.data;
      const temp = [...restaurants]
      if(all !== temp)
        {
          setRestaurants(all) 
        }
      
  });
    refresh();
  }
  );


  const restroCard = restaurants.map((result, index)=>
  {

    return(
      <div className = "restroId">
        <div className = "image">
         <Image
            key={result + index}
            cloudName="foodfinder"
            publicId={result.mainPhoto}
            width="200"
            height="150"
            crop="scale"/>
        </div>
        <div className = "text">{result.name}</div>
        {/* { console.log("Results: ",result)} */}
        <button onClick = {()=>setFeatured(result.id)} className = "featureBtn">Feature This</button>
        <button onClick = {()=>cancelFeatured()} className = "cancelBtn" >Cancel Feature</button>
        </div>
    )  
  }
  )

 
  const renders = ()=>{
     return (
      <div className = "bodyAdmin">
        <hr/>
        {restroCard} 
      </div>
      )
  }

  return (<>{role && renders()}</>)
};

export default AdminPage;
