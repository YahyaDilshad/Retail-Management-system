import React from 'react'
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { Loader } from 'lucide-react'; // Loader icon
import 'react-toastify/dist/ReactToastify.css'; 

import axiosInstance from './lib/axios.js';
import Sidebar from './components/sideBar.jsx';
import Header from './components/Header.jsx';

// Pages
import SignUp from './pages/signUp.jsx'
import Dashboard from './pages/Dashboard.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Users from './pages/Users.jsx';
import Staff from './pages/staff.jsx' 
import Categories from './pages/Categories.jsx';
import StockManagement from './pages/StockManagement.jsx';
import ClientReviews from './pages/ClientReviews.jsx';
import Setting from './pages/Settings.jsx';
import SalesReports from './pages/Salesreport'
import About from './pages/About.jsx';
import StockAttendence from './pages/Stock-Attendence.jsx';
import Biling from './pages/Biling.jsx';
import Revenue from './pages/Revenue.jsx';
import Scanner from './pages/Scanner.jsx';
import StoreManagement from './pages/store.jsx';
import MessageCenter from './pages/messageCenter.jsx';

const App = () => {
  const location = useLocation();

  const { data: authData, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        return res.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  const user = authData?.user || authData;

  // 1. Agar check ho raha hai to loading dikhao
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-[#13786E]" size={40} />
      </div>
    );
  }

  // Sidebar sirf tab dikhao jab user login ho AUR signup page par na ho
  const showSidebarAndHeader = user && !["/admin/signUp", "/admin/signin"].includes(location.pathname);

  return (
    <div className='relative flex min-h-screen bg-gray-50'>
      <ToastContainer position="top-right" autoClose={3000} /> 
      
      {showSidebarAndHeader && <Sidebar />}

      <main className={`flex-1 ${showSidebarAndHeader ? "ml-0" : ""}`}>
        {showSidebarAndHeader && <Header />}
        
        <Routes>
          {/* Auth Route */}
          <Route path='/admin/signUp' element={!user ? <SignUp /> : <Navigate to='/admin/dashboard' />} />

          {/* Protected Routes - Redirect to /admin/signUp if not logged in */}
          <Route path='/admin/dashboard' element={user ? <Dashboard /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/products' element={user ? <ProductPage /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/all-users' element={user ? <Users /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/staff' element={user ? <Staff /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/categories' element={user ? <Categories /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/stock' element={user ? <StockManagement /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/client-review' element={user ? <ClientReviews /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/settings' element={user ? <Setting /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/sales-reports' element={user ? <SalesReports /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/about' element={user ? <About /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/staff-attendence' element={user ? <StockAttendence /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/billing' element={user ? <Biling /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/revenue' element={user ? <Revenue /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/scanner' element={user ? <Scanner /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/store' element={user ? <StoreManagement /> : <Navigate to='/admin/signUp' />} />
          <Route path='/admin/messages' element={user ? <MessageCenter /> : <Navigate to='/admin/signUp' />} />
          
          {/* Fallback route */}
          <Route path='*' element={user ? <Navigate to='/admin/dashboard' /> : <Navigate to='/admin/signUp' />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;