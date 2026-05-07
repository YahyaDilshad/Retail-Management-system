import axios from 'axios'


const axiosInstance = axios.create({
    //baseURL : 'http://localhost:5000/api',
     baseURL : 'https://authentic-caring-production-f0ac.up.railway.app/api',
    withCredentials : true
}) 

export default axiosInstance