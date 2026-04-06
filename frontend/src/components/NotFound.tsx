import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f0fa 100%)',
    padding: '2rem'
  };

  const contentStyle: CSSProperties = {
    maxWidth: '800px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '3rem',
    textAlign: 'center'
  };

  const schoolBrandingStyle: CSSProperties = {
    marginBottom: '2rem'
  };

  const schoolLogoStyle: CSSProperties = {
    height: '80px',
    marginBottom: '1rem'
  };

  const schoolNameStyle: CSSProperties = {
    color: '#2c3e50',
    fontSize: '1.8rem',
    margin: '0'
  };

  const errorCodeStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2rem 0'
  };

  const digitStyle: CSSProperties = {
    fontSize: '8rem',
    fontWeight: 'bold',
    color: '#3498db',
    lineHeight: '1'
  };

  const mascotStyle: CSSProperties = {
    height: '120px',
    margin: '0 1.5rem',
    animation: 'bounce 2s infinite'
  };

  const subtitleStyle: CSSProperties = {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto'
  };

  const actionButtonsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const baseButtonStyle: CSSProperties = {
    padding: '0.8rem 1.5rem',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none'
  };

  const primaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: '#3498db',
    color: 'white'
  };

  const secondaryButtonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: 'white',
    color: '#3498db',
    border: '2px solid #3498db'
  };

  const quickLinksStyle: CSSProperties = {
    marginTop: '2rem'
  };

  // Animation style (would need to be in a global CSS file or style tag)
  const animationStyle = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{animationStyle}</style>
      <div style={contentStyle}>
        

        <div>
          <div style={errorCodeStyle}>
            <span style={digitStyle}>4</span>
            <img 
              src={`${import.meta.env.VITE_IMAGE_URL}/defaults/logo.png`}
              alt="School Mascot" 
              style={mascotStyle}
            />
            <span style={digitStyle}>4</span>
          </div>
          
          <h2>Class Dismissed Early!</h2>
          <p style={subtitleStyle}>
            The page you're looking for seems to have skipped class. 
            Don't worry, we'll help you find your way back to learning.
          </p>
          
          <div style={actionButtonsStyle}>
            <button 
              onClick={() => navigate('/')}
              style={primaryButtonStyle}
            >
              Return to Homepage
            </button>
            <button 
              onClick={() => navigate(-1)}
              style={secondaryButtonStyle}
            >
              Go Back
            </button>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;