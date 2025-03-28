import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  // Inline CSS styles
  const styles = {
    footer: {
      backgroundColor: '#0c0b09',
      color: '#fff',
      padding: '60px 0 30px',
      fontFamily: '"Poppins", sans-serif',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 15px',
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: '0 -15px',
    },
    footerCol: {
      flex: '0 0 25%',
      maxWidth: '25%',
      padding: '0 15px',
      marginBottom: '30px',
      '@media (max-width: 992px)': {
        flex: '0 0 50%',
        maxWidth: '50%',
      },
      '@media (max-width: 768px)': {
        flex: '0 0 100%',
        maxWidth: '100%',
      },
    },
    flexItem: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    icon: {
      fontSize: '20px',
      color: '#e4141c',
      marginRight: '15px',
      marginTop: '4px',
    },
    footerHeading: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '15px',
      position: 'relative',
      paddingBottom: '10px',
    },
    footerHeadingAfter: {
      content: '""',
      position: 'absolute',
      display: 'block',
      width: '50px',
      height: '2px',
      background: '#cda45e',
      bottom: '0',
      left: '0',
    },
    footerText: {
      fontSize: '14px',
      lineHeight: '1.8',
      marginBottom: '0',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    strongText: {
      color: '#fff',
      fontWeight: '600',
    },
    socialLinks: {
      display: 'flex',
      marginTop: '15px',
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      marginRight: '10px',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      ':hover': {
        backgroundColor: '#cda45e',
        color: '#1a1814',
      },
    },
    copyright: {
      textAlign: 'center',
      paddingTop: '30px',
      marginTop: '30px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: '14px',
    },
    credits: {
      marginTop: '10px',
    },
    creditsLink: {
      color: '#cda45e',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      ':hover': {
        color: '#d9b871',
        textDecoration: 'underline',
      },
    },
    loginLink: {
      color: 'rgba(255, 255, 255, 0.7)',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      ':hover': {
        color: '#cda45e',
      },
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.row}>
          {/* Address Column */}
          <div style={styles.footerCol}>
            <div style={styles.flexItem}>
              <FaMapMarkerAlt style={styles.icon} />
              <div>
                <h4 style={{ ...styles.footerHeading, ':after': styles.footerHeadingAfter }}>Address</h4>
                <p style={styles.footerText}>
                  A108 Adam Street<br />
                  New York, NY 535022
                </p>
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div style={styles.footerCol}>
            <div style={styles.flexItem}>
              <FaPhoneAlt style={styles.icon} />
              <div>
                <h4 style={{ ...styles.footerHeading, ':after': styles.footerHeadingAfter }}>Contact</h4>
                <p style={styles.footerText}>
                  <span style={styles.strongText}>Phone:</span> +1 5589 55488 55<br />
                  <span style={styles.strongText}>Email:</span> info@example.com
                </p>
              </div>
            </div>
          </div>

          {/* Hours Column */}
          <div style={styles.footerCol}>
            <div style={styles.flexItem}>
              <FaClock style={styles.icon} />
              <div>
                <h4 style={{ ...styles.footerHeading, ':after': styles.footerHeadingAfter }}>Opening Hours</h4>
                <p style={styles.footerText}>
                  <span style={styles.strongText}>Mon-Sat:</span> 11AM - 11PM<br />
                  <span style={styles.strongText}>Sunday:</span> Closed
                </p>
              </div>
            </div>
          </div>

          {/* Social Column */}
          <div style={styles.footerCol}>
            <h4 style={{ ...styles.footerHeading, ':after': styles.footerHeadingAfter }}>Follow Us</h4>
            <div style={styles.socialLinks}>
              <a href="/" style={styles.socialLink} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="/" style={styles.socialLink} aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="/" style={styles.socialLink} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="/" style={styles.socialLink} aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.copyright}>
        <div style={styles.credits}>
          Designed by <a href="https://exilance.com" style={styles.creditsLink}>Exilance</a>
          <br />
          <Link to="/WebIndex/Login" style={styles.loginLink}>Admin Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;