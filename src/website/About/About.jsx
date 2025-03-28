import React, { useEffect } from 'react';
import about from '../../assets/img/about.jpg';
import 'aos/dist/aos.css';
import AOS from 'aos';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Styles object
  const styles = {
    aboutSection: {
      padding: '100px 0',
      backgroundColor: '#fffaf3',
      position: 'relative',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 15px',
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '60px',
    },
    sectionSubtitle: {
      display: 'block',
      fontSize: '18px',
      color: 'black',
      fontWeight: '600',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    sectionTitle: {
      fontSize: '25px',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(120deg, rgb(51, 51, 51), rgb(228, 20, 28))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    position: 'relative'
    },
    sectionTitleAfter: {
      content: '""',
      position: 'absolute',
      width: '50px',
      height: '3px',
      background: '#ff6b6b',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    aboutContent: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '30px',
    },
    aboutImage: {
      flex: '1 1 45%',
      position: 'relative',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
    },
    aboutImg: {
      width: '100%',
      height: 'auto',
      transition: 'transform 0.5s ease',
    },
    aboutImageHover: {
      transform: 'scale(1.03)',
    },
    aboutImageOverlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.3)',
      opacity: '0',
      transition: 'opacity 0.3s ease',
    },
    aboutImageOverlayHover: {
      opacity: '1',
    },
    videoPlayBtn: {
      width: '70px',
      height: '70px',
      background: '#ff6b6b',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '24px',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    videoPlayBtnHover: {
      background: '#ff5252',
      transform: 'scale(1.1)',
    },
    aboutText: {
      flex: '1 1 45%',
    },
    aboutHeading: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '20px',
      lineHeight: '1.3',
    },
    aboutIntro: {
      fontStyle: 'italic',
      color: '#666',
      fontSize: '18px',
      marginBottom: '30px',
      borderLeft: '3px solid #ff6b6b',
      paddingLeft: '20px',
    },
    aboutFeatures: {
      margin: '30px 0',
      padding: '0',
      listStyle: 'none',
    },
    featureItem: {
      display: 'flex',
      marginBottom: '25px',
      alignItems: 'flex-start',
    },
    featureIcon: {
      width: '50px',
      height: '50px',
      background: '#fff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ff6b6b',
      fontSize: '20px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      marginRight: '20px',
      flexShrink: '0',
    },
    featureText: {
      flex: '1',
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '5px',
    },
    featureDescription: {
      color: '#666',
      margin: '0',
      fontSize: '16px',
      lineHeight: '1.6',
    },
    aboutHistory: {
      marginTop: '30px',
    },
    historyText: {
      color: '#666',
      fontSize: '16px',
      lineHeight: '1.8',
      marginBottom: '20px',
    },
    signature: {
      fontFamily: '"Dancing Script", cursive',
      fontSize: '24px',
      color: '#333',
      fontWeight: '700',
    },
    // Responsive styles
    '@media (max-width: 992px)': {
      aboutContent: {
        flexDirection: 'column',
      },
      aboutImage: {
        flex: '1 1 100%',
      },
      aboutText: {
        flex: '1 1 100%',
        marginTop: '40px',
      },
    },
    '@media (max-width: 768px)': {
      aboutSection: {
        padding: '60px 0',
      },
      sectionTitle: {
        fontSize: '28px',
      },
      aboutHeading: {
        fontSize: '24px',
      },
      aboutH2: {
        fontSize: '25px',
        fontWeight: '700',
        marginBottom: '10px',
        background: 'linear-gradient(120deg, rgb(51, 51, 51), rgb(228, 20, 28))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        position: 'relative'
      },
    },
    '@media (max-width: 576px)': {
      featureItem: {
        flexDirection: 'column',
      },
      featureIcon: {
        marginBottom: '15px',
        marginRight: '0',
      },
    },
  };

  return (
    <section id="about" style={styles.aboutSection}>
      <div style={styles.container}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionSubtitle}>Our Story</span>
          <h2 style={styles.sectionTitle}>
            About Banjos
            <span style={styles.sectionTitleAfter}></span>
          </h2>
        </div>

        <div style={styles.aboutContent}>
          <div style={styles.aboutImage} data-aos="fade-up" data-aos-delay="100">
            <img src={about} alt="Banjos restaurant" style={styles.aboutImg} />
            <div style={styles.aboutImageOverlay}>
              <a
                href="https://www.youtube.com/@banjosthefoodchain7687"
                style={styles.videoPlayBtn}
                aria-label="Watch our story video"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-play-fill"></i>
              </a>
            </div>
          </div>

          <div style={styles.aboutText} data-aos="fade-up" data-aos-delay="200">
            <h3 style={styles.aboutHeading}>
              Take two freshly baked buns with an appetizing stuffing of richly flavored quality and you have a Banjo!
            </h3>
            <p style={styles.aboutIntro}>
              Originated in 2017, from a passion to revolutionize bun-based cuisine.
            </p>
            
            <ul style={styles.aboutFeatures}>
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <i className="bi bi-check2-circle"></i>
                </div>
                <div style={styles.featureText}>
                  <h4 style={styles.featureTitle}>Diverse Menu</h4>
                  <p style={styles.featureDescription}>
                    Banjos serves a diversified fast food menu to satisfy all tastes.
                  </p>
                </div>
              </li>
              
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div style={styles.featureText}>
                  <h4 style={styles.featureTitle}>Nashik Based</h4>
                  <p style={styles.featureDescription}>
                    We are a Nashik-based food chain with deep local roots.
                  </p>
                </div>
              </li>
              
              <li style={styles.featureItem}>
                <div style={styles.featureIcon}>
                  <i className="bi bi-star"></i>
                </div>
                <div style={styles.featureText}>
                  <h4 style={styles.featureTitle}>Quality Focus</h4>
                  <p style={styles.featureDescription}>
                    We&apos;ve grown tremendously based on our uncompromising quality standards.
                  </p>
                </div>
              </li>
            </ul>
            
            <div style={styles.aboutHistory}>
              <p style={styles.historyText}>
                Our first outlet on College Road started with a small range of delicious burgers, pizzas, sandwiches, and beverages. 
                Today, we continue that tradition of excellence across multiple locations.
              </p>
              <div style={styles.signature}>
                {/* <span>Banjos Team</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;