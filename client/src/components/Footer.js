import React, { useEffect, useRef } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  // Refs for DOM elements that need responsive styling
  const footerSectionsRef = useRef([]);
  const newsletterRef = useRef(null);
  const footerBottomRef = useRef(null);
  const socialIconsRef = useRef(null);

  // Handle responsive styling with useEffect
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const footerSections = footerSectionsRef.current;
      const newsletter = newsletterRef.current;
      const footerBottom = footerBottomRef.current;
      const socialIcons = socialIconsRef.current;
      
      if (width <= 992) {
        footerSections.forEach(section => {
          if (section) {
            section.style.flex = '1 0 calc(33.333% - 1rem)';
          }
        });
        if (newsletter) {
          newsletter.style.flex = '1 0 calc(50% - 1rem)';
        }
      } else {
        footerSections.forEach(section => {
          if (section) {
            section.style.flex = '1';
          }
        });
        if (newsletter) {
          newsletter.style.flex = '1';
        }
      }
      
      if (width <= 768) {
        footerSections.forEach(section => {
          if (section) {
            section.style.flex = '1 0 calc(50% - 1rem)';
          }
        });
        if (newsletter) {
          newsletter.style.flex = '1 0 100%';
        }
        if (footerBottom) {
          footerBottom.style.flexDirection = 'column';
          footerBottom.style.textAlign = 'center';
        }
        if (socialIcons) {
          socialIcons.style.marginTop = '1rem';
          socialIcons.style.justifyContent = 'center';
        }
      } else if (width > 768) {
        if (footerBottom) {
          footerBottom.style.flexDirection = 'row';
          footerBottom.style.textAlign = 'left';
        }
        if (socialIcons) {
          socialIcons.style.marginTop = '0';
          socialIcons.style.justifyContent = 'flex-start';
        }
      }
      
      if (width <= 576) {
        footerSections.forEach(section => {
          if (section) {
            section.style.flex = '1 0 100%';
          }
        });
      }
    };

    // Apply initially
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up the ref collecting function
  const setFooterSectionRef = (el) => {
    if (el && !footerSectionsRef.current.includes(el)) {
      footerSectionsRef.current.push(el);
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div ref={setFooterSectionRef} style={styles.footerSection}>
          <h3 style={styles.heading}>Opening hours</h3>
          <p style={styles.paragraph}>Mon-Fri 08:00AM - 08:00PM</p>
          <p style={styles.paragraph}>Sat-Sun 08:00AM - 08:00PM</p>
        </div>

        <div ref={setFooterSectionRef} style={styles.footerSection}>
          <h3 style={styles.heading}>Find Us</h3>
          <p style={styles.paragraph}>Sobo Thane,Kapurbawdi,</p>
          <p style={styles.paragraph}>Thane West, 400610</p>
          <p style={styles.paragraph}>(022) 2375-4887</p>
          <p style={styles.paragraph}>sobothane@gmail.com</p>
        </div>

        <div ref={setFooterSectionRef} style={styles.footerSection}>
          <h3 style={styles.heading}>Property</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}><a href="/apartments" style={styles.link}>Apartments</a></li>
            <li style={styles.listItem}><a href="/villas" style={styles.link}>Villa's</a></li>
            <li style={styles.listItem}><a href="/houses" style={styles.link}>Houses</a></li>
            <li style={styles.listItem}><a href="/commercial" style={styles.link}>Commercial</a></li>
          </ul>
        </div>

        <div ref={setFooterSectionRef} style={styles.footerSection}>
          <h3 style={styles.heading}>Links</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}><a href="/" style={styles.link}>Home</a></li>
            <li style={styles.listItem}><a href="/property" style={styles.link}>Property</a></li>
            <li style={styles.listItem}><a href="/about" style={styles.link}>About</a></li>
            <li style={styles.listItem}><a href="/contact" style={styles.link}>Contact</a></li>
          </ul>
        </div>

        <div ref={newsletterRef} style={styles.footerSection}>
          <h3 style={styles.heading}>Newsletter</h3>
          <p style={styles.paragraph}>Subscribe to our newsletter</p>
          <div style={styles.newsletterForm}>
            <input type="email" placeholder="Your email" style={styles.input} />
            <button type="submit" style={styles.button}>Subscribe</button>
          </div>
        </div>
      </div>

      <div ref={footerBottomRef} style={styles.footerBottom}>
        <p style={styles.copyright}>©Copyright SOBO THANE 2025.</p>
        <div ref={socialIconsRef} style={styles.socialIcons}>
          <a href="#" aria-label="Facebook" style={styles.socialLink}><FaFacebook /></a>
          <a href="#" aria-label="Twitter" style={styles.socialLink}><FaTwitter /></a>
          <a href="#" aria-label="Instagram" style={styles.socialLink}><FaInstagram /></a>
          <a href="#" aria-label="YouTube" style={styles.socialLink}><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
};

// Styles object with all the CSS
const styles = {
  footer: {
    backgroundColor: '#0D47A1',
    color: 'white',
    padding: '3rem 2rem 1rem',
    fontFamily: 'Arial, sans-serif'
  },
  footerContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: '2rem'
  },
  footerSection: {
    flex: '1',
    minWidth: '200px',
    marginBottom: '1.5rem',
    paddingRight: '1rem'
  },
  heading: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    fontWeight: '500'
  },
  paragraph: {
    margin: '0.5rem 0',
    fontSize: '0.9rem',
    color: '#ccc'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    marginBottom: '0.5rem'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease'
  },
  newsletterForm: {
    display: 'flex',
    marginTop: '0.5rem'
  },
  input: {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px 0 0 4px',
    width: '100%',
    fontSize: '0.9rem'
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s ease'
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap'
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#999',
    margin: '0.5rem 0'
  },
  socialIcons: {
    display: 'flex',
    gap: '1rem'
  },
  socialLink: {
    color: 'white',
    fontSize: '1.2rem',
    transition: 'opacity 0.3s ease'
  }
};

export default Footer;