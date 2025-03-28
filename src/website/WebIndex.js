import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Hero from './Hero/Hero';
import Menu from './Menu/Menu';
import WhyUs from './WhyUs/WhyUs';
import Testimonials from './Testimonials/Testimonials';
import Gallery from './Gallery/Gallery';
import About from './About/About';
import Contact from './Contact/Contact';
import Footer from './Footer/Footer';
import AboutPage from './About/AboutPage';
import MenuPage from'./Menu/MenuPage'
import Events from './Events/Events'
import Job from './Job/Job'
import Galleryin from './Gallery/Galleryin';
import Contactus from './Contact/Contactus';
import Feedback from './Contact/Feedback';
import Login from './Login/Login'
import GalleryDetails from './Gallery/GalleryDetails';
import Branches from './Branches/Branches'
import './GoshalaPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Franchise from './Franchise';
const Home = () => (
  <>
    <Hero />
    <About />
    <WhyUs />
    <Menu />
    <Testimonials />
    <Gallery />
    <Contact />
  </>
);


function WebIndex() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/Events" element={<Events />} />
        <Route path='/Job' element={<Job/>}/>
        <Route path='/Galleryin' element={<Galleryin/>}/>
        <Route path='/Feedback' element={<Feedback/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Franchise' element={<Franchise/>}/>
        <Route path='/Branches' element={<Branches/>}/>

        <Route path='/GalleryDetails' element={<GalleryDetails/>}/>
        {/* Redirect any unknown route to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default WebIndex;
