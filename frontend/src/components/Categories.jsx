import { useState, useEffect, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import '../styles/categories.css';

const API_URL = 'http://localhost:3001/api/evashoes';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);

  // Default categories for fallback
  const defaultCategories = [
    
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories/`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.log('Using default categories');
      setCategories(defaultCategories);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <aside className="categories">
      <h2 className="section-title">DANH MỤC</h2>
      <p className="section-subtitle">Khám phá những mẫu giày hot nhất theo phong cách của bạn</p>
      
      <div className="categories-grid">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className={`category-card ${selectedCategory === category._id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category._id)}
          >
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
    </aside>
  );
}
