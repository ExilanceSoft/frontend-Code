import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.png';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileNav = () => {
    setIsMobileNavVisible((prev) => !prev);
  };

  // Close mobile menu when clicking a nav link
  const closeMobileNav = () => {
    setIsMobileNavVisible(false);
  };

  return (
    <header id="header" className={`header fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="topbar d-flex align-items-center">
        <div className="container d-flex justify-content-end justify-content-md-between ml-2">
          <div className="contact-info d-flex align-items-center ml-3">
            <i className="bi bi-phone d-flex align-items-center d-none d-lg-block">
              <span>+1 5589 55488 55</span>
            </i>
            <i className="bi bi-clock ms-4 d-none d-lg-flex align-items-center">
              <span>Mon-Sat: 11:00 AM - 23:00 PM</span>
            </i>
          </div>
          <NavLink to="/WebIndex/Franchise" className="cta-btn ml-3">
            Franchise Inquiry
          </NavLink>
        </div>
      </div>

      <div className="branding d-flex align-items-center">
        <div className="container position-relative d-flex align-items-center justify-content-between">
          <NavLink to="/" className="logo d-flex align-items-center">
            <img src={logo} alt="logo" className="sitename" />
          </NavLink>

          <nav
            id="navmenu"
            className={`navmenu ml-5 ${isMobileNavVisible ? 'mobile-nav-active' : ''}`}
          >
            <ul>
              {[
                { path: '/', name: 'Home' },
                { path: '/WebIndex/about', name: 'About' },
                { path: '/WebIndex/menu', name: 'Menu' },
                { path: '/WebIndex/Job', name: 'Careers' },
                { path: '/WebIndex/Galleryin', name: 'Gallery' },
                { path: '/WebIndex/contact', name: 'Contact' },
                { path: '/WebIndex/Branches', name: 'Branches' },
              ].map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={closeMobileNav} // Close menu on click
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}

              {/* Download Brochure Link */}
              <li>
                <a
                  href="/assets/files/brochure.pdf" // Replace with actual brochure path
                  download="Brochure.pdf"
                  className="download-brochure"
                  title="Download Brochure"
                >
                  <i className="bi bi-download  fs-5"></i> {/* Download Icon */}
                </a>
              </li>
            </ul>
            <i
              className="mobile-nav-toggle d-xl-none bi bi-list"
              onClick={toggleMobileNav}
            ></i>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
