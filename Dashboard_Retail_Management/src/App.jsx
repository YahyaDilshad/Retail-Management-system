import React from 'react'
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Orders from "./pages/Orders";
import ClientReviews from "./pages/ClientReviews";
import useAuthStore from './store/authstore.js'
import SalesReports from './pages/Salesreport'
import Setting from "./pages/Settings";
import Users from './pages/Users.jsx';
import Home from './pages/home.jsx'
import Dashboard from './pages/Dashboard.jsx';
import ProductPage from './pages/ProductPage.jsx';
import SignUp from './pages/signUp.jsx'
import Sidebar from './components/sideBar.jsx';

import Header from './components/Header.jsx';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from './lib/axios.js';
import Staff from './pages/staff.jsx' 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Categories from './pages/Categories.jsx';
import StockManagement from './pages/StockManagement.jsx';
import About from './pages/About.jsx';
import StockAttendence from './pages/Stock-Attendence.jsx';
import Biling from './pages/Biling.jsx';
import Revenue from './pages/Revenue.jsx';
import Scanner from './pages/Scanner.jsx';

const App = () => {
  const location = useLocation();
  const hideSidebar = ["/admin/signin", "/admin/signUp"].includes(location.pathname);

  const { data: authData, isLoading , error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
         console.log("Api calling")
        const res = await axiosInstance.get("/auth/check");
        return res.data || null; // Return data if exists
      } catch (error) {
        console.log("reactQuery Erro" , error.message)
        return null; // Return null on error, NOT undefined
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
  
  if(error) console.log("Axios Error" , error.message)
  const user = authData?.user || authData;

  return (
    <div className='relative flex'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" /> 
      {!hideSidebar && <aside className="hidden md:block"><Sidebar /></aside>}

      <main className="flex-1">
        {!hideSidebar && <Header />}
        
        <Routes>
           
          <Route path='/admin/signUp' element={!user ? <SignUp /> : <Navigate to='/admin/dashboard' />} />

          {/* Dashboard /  Home - Protect them */}
          <Route path='/admin/products' element={user ? <ProductPage /> : <Navigate to='/admin/signin' />} />
          <Route path='/admin/all-users' element={user ? <Users /> :  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/staff' element={user ? <Staff /> :  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/dashboard' element={user ? <Dashboard />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/categories' element={user ? <Categories />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/stock' element={user ? <StockManagement />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/client-review' element={user ? <ClientReviews />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/settings' element={user ? <Setting />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/sales-reports' element={user ? <SalesReports />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/about' element={user ? <About />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/staff-attendence' element={user ? <StockAttendence />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/billing' element={user ? <Biling />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/revenue' element={user ? <Revenue />:  <Navigate to='/admin/signin' />}/>
          <Route path='/admin/scanner' element={user ? <Scanner />:  <Navigate to='/admin/signin' />}/>

          {/* Fallback route - Sirf galat URL par chalega */}
          <Route path='*' element={user ? <Navigate to='/admin/dashboard' /> : <Navigate to='/admin/signUp' />} />
        </Routes>
      </main>
    </div>
  );
};


export default App