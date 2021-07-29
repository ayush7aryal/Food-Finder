import { React, useState, useEffect } from "react";
import axios from "axios";
import { Image } from "cloudinary-react";

//for set Featured button
const setFeatured = async (id) => {
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
  await axios.get("http://localhost:5000/admin/cancel", config).then((res) => {
    alert(res.data.msg);
  });
};

const AdminPage = () => {
  const [restaurants, setRestaurants] = useState({});
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
      setRestaurants(all);
      console.log(restaurants);
    });
    refresh();
  });

  // yesma sab restaurant haru dekhau
  const renders = ()=>{
      return (<div></div>)
  }

  return (<>{role && renders()}</>)
};

export default AdminPage;
