import React from 'react';

function GetStart() {
  const wrapperStyle = {
    padding: '4rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    gap: '2rem',
  };

  const innerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.4rem',
    background: 'rgb(92, 193, 139)',
    padding: '2rem',
    borderRadius: '12px',
    border: '6px solid rgb(92, 193, 139)',
    flex: 1,
  };

  const primaryTextStyle = {
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.5rem',
    textAlign: 'center',
  };

  const secondaryTextStyle = {
    color: '#cbcbcb',
    fontSize: '1rem',
    textAlign: 'center',
  };

  const buttonStyle = {
    background: 'linear-gradient(270deg, #ffb978 0%, #ff922d 100%)',
    border: '2px solid #fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
  };

  return (
    <section style={wrapperStyle}>
      <div style={containerStyle}>
        {/* Donation Container */}
        <div style={innerContainerStyle}>
          <span style={primaryTextStyle}>Give a little, help a lot</span>
          <span style={secondaryTextStyle}>Every gift counts, every life matters</span>
          <button style={buttonStyle}>
            <a
              href="mailto:softcrowd037@gmail.com"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              Donation
            </a>
          </button>
        </div>

        {/* Adoption Container */}
        <div style={innerContainerStyle}>
          <span style={primaryTextStyle}>Adopt a friend for life</span>
          <span style={secondaryTextStyle}>Give them a loving home they deserve</span>
          <button style={buttonStyle}>
            <a
              href="mailto:adoptions@example.com"
              style={{ textDecoration: 'none', color: '#fff' }}
            >
              Adoption
            </a>
          </button>
        </div>
      </div>
    </section>
  );
}

export default GetStart;
