import React, { useState, useEffect, useRef } from 'react';

const ContactPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const modalRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here when backend is implemented
    console.log('Form submitted:', formData);
    // Reset form and close popup
    setFormData({ name: '', email: '', phone: '', message: '' });
    onClose();
  };
  
  // Close popup when clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Return null if popup is not open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay with dimmed background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        className="bg-white rounded-md shadow-lg w-full max-w-md mx-4 z-10 relative"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        {/* Modal header */}
        <div className="bg-blue-900 p-6 rounded-t-md">
          <h2 className="text-2xl font-semibold text-center text-yellow-500">Enquire Now</h2>
        </div>
        
        {/* Logo and branding section */}
        <div className="p-6 flex justify-center">
          <div className="text-center">
            <h1 className="font-bold text-xl flex flex-wrap justify-center">
              <span className="text-yellow-500">SOBO </span>
              <span className="text-blue-900">THANE</span>
            </h1>
            <p className="text-gray-600 text-xs">Suites of Billionaires' Opulence</p>
          </div>
        </div>
        
        {/* Register text */}
        <div className="px-6 text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Register Here And Avail The <span className="text-yellow-500">Best Offers!</span>
          </h3>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
            
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message (Optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 h-24"
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-medium py-2 px-4 rounded transition-colors"
              >
                Submit
              </button>
            </div>
            
            {/* Privacy policy checkbox */}
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="privacy"
                className="mt-1"
                required
              />
              <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                By submitting I accept <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
              </label>
            </div>
          </div>
        </form>
        
        {/* Service features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-t border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="text-yellow-500 mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <p className="font-medium text-blue-900">Instant Call Back</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-yellow-500 mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <p className="font-medium text-blue-900">Free Site Visit</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="text-yellow-500 mb-2">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="font-medium text-blue-900">Unmatched Price</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;