import Header from './components/Header';
import Banner from './components/Banner';
import Categories from './components/Categories';
import Products from './components/Products';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { CategoryProvider } from './context/CategoryContext';
import { CartProvider } from './context/CartContext';
import './styles/global.css';

function App() {
  return (
    <CategoryProvider>
      <CartProvider>
        <Header />
        <Banner />
        <div className="main-content">
          <Categories />
          <Products />
        </div>
        <Cart />
        <Footer />
      </CartProvider>
    </CategoryProvider>
  );
}

export default App;
