import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
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
import SearchPage from './pages/Search';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

const NotFound = () => (
  <div className="p-8 text-center text-white">404 - Page Not Found</div>
);

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/admin" element={<Admin />} />
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
              <Route path="search" element={<SearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
