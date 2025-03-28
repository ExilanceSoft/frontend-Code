import React, { useState, useEffect } from 'react';
import './MenuPage.css';

const Menu = () => {
  const [activeFilter, setActiveFilter] = useState('*');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://127.0.0.1:8000";

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/menu`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter items based on activeFilter and category "special"
  const filteredItems = menuItems.filter(item => {
    // Filter by 'special' category if 'activeFilter' is '*'
    const isSpecialCategory = item.category_name === 'special';
    if (activeFilter === '*') {
      return isSpecialCategory; 
    }
    if (activeFilter === 'filter-veg') {
      return isSpecialCategory && item.is_veg; 
    }
    if (activeFilter === 'filter-non-veg') {
      return isSpecialCategory && !item.is_veg; 
    }
    return false;
  });

  if (loading) {
    return (
      <section id="menu" className="menu section">
        <div className="container text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="menu section">
        <div className="container text-center py-5">
          <div className="alert alert-danger">Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="menu section">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Menu</h2>
          <p>Check Our <span className="description-title">Special Menu</span></p>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul className="menu-filters">
              <li
                className={activeFilter === '*' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('*')}
              >
                All
              </li>
              <li
                className={activeFilter === 'filter-veg' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('filter-veg')}
              >
                Veg
              </li>
              <li
                className={activeFilter === 'filter-non-veg' ? 'filter-active' : ''}
                onClick={() => setActiveFilter('filter-non-veg')}
              >
                Non-Veg
              </li>
            </ul>
          </div>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="200">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="col-lg-6 menu-item"
            >
              <div className="menu-item-card">
                <img
                  src={`${BASE_URL}${item.image_url}`}
                  className="menu-img"
                  alt={item.name}
                />
                <div className="menu-content">
                  <a href="#">{item.name}</a>
                  <span>${item.price.toFixed(2)}</span>
                </div>
                <div className="menu-ingredients">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;