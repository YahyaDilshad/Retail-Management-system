import axios from 'axios'


const axiosInstance = axios.create({
   // baseURL : 'http://localhost:5000/api',
   baseURL : 'https://retail-management-systembackend12.vercel.app/api',
    withCredentials : true
}) 

export default axiosInstance