import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Supplements from './pages/Supplements';
import DietFood from './pages/DietFood';
import Coaching from './pages/Coaching';
import GymWear from './pages/GymWear';
import Equipment from './pages/Equipment';

import Calculator from './pages/Calculator';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';

const NotFound = () => (
  <div className="p-8 text-center text-white">404 - Page Not Found</div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="coaching" element={<Coaching />} />
            <Route path="diet-food" element={<DietFood />} />
            <Route path="supplements" element={<Supplements />} />
            <Route path="gym-wear" element={<GymWear />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
