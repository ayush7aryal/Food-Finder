import axios from "axios";

const instance = axios.create({
    baseURL: 'https://food-finder-8yyx.onrender.com',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });


  // Add a request interceptor
instance.interceptors.request.use(config => {
    // Change the method to OPTIONS for all requests
    config.method = 'OPTIONS';
    // Optionally, modify other request configurations here
    return config;
   }, error => {
    // Handle request error
    return Promise.reject(error);
   });

  export default instance;

