import { useContext } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import Categories from './components/Categories';
import Products from './components/Products';
import Footer from './components/Footer';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import { CategoryProvider } from './context/CategoryContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './styles/global.css';
import { useNavigate, Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout";
import MyOrders from "./components/MyOrders";
import UserInfo from "./components/UserInfo";
function AppContent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // Nếu user là admin, hiển thị dashboard
  if (user && user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Nếu không phải admin, hiển thị store bình thường
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Banner />
            <div className="main-content">
              <Categories />
              <Products />
            </div>
          </>
        } />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<UserInfo />} />
      </Routes>
      <Cart />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
