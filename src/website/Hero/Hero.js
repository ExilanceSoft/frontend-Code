import React from 'react';
import heroVideo from '../../assets/img/India1.mp4'; // Import the video file

const Hero = () => {
  return (
    <section id="hero" className="hero">
      <video autoPlay muted loop className="hero-video">
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default Hero;
