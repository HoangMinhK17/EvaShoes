import Header from './components/Header';
import Banner from './components/Banner';
import Categories from './components/Categories';
import Products from './components/Products';
import Footer from './components/Footer';
import { CategoryProvider } from './context/CategoryContext';
import './styles/global.css';

function App() {
  return (
    <CategoryProvider>
      <Header />
      <Banner />
      <div className="main-content">
        <Categories />
        <Products />
      </div>
      <Footer />
    </CategoryProvider>
  );
}

export default App;
