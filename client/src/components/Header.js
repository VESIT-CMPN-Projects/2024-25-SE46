import {FaSearch} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import ContactPopup from './ContactPopup'; // Import the ContactPopup component
export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const [isContactPopupOpen, setIsContactPopupOpen] = useState(false); // State for contact popup
    
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    // Function to open the contact popup
    const openContactPopup = (e) => {
        e.preventDefault();
        setIsContactPopupOpen(true);
    };
    
    // Function to close the contact popup
    const closeContactPopup = () => {
        setIsContactPopupOpen(false);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    }, [window.location.search]);

    return (
        <>
            <header className='bg-blue-900 shadow-md'>
                <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                    <Link to={'/'}>
                        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                            <span className='text-yellow-500'>SOBO </span>
                            <span className='text-yellow-500'>THANE</span>
                        </h1>
                        <p className='text-white text-xs hidden sm:block'>Suites of Billionaires' Opulence</p>
                    </Link>

                    <form onSubmit={handleSubmit} className='bg-white rounded-lg flex items-center px-2 py-1'>
                        <input 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            type="text"
                            placeholder="search"
                            className='bg-transparent focus:outline-none w-24 sm:w-64 text-gray-700'
                        />
                        <button>
                            <FaSearch className='text-gray-700'></FaSearch>
                        </button>
                    </form>
                    
                    <ul className='flex gap-4 text-white'>
                        <Link to={'/'}><li className='hidden sm:inline hover:text-yellow-500 transition duration-300'>Home</li></Link>
                        <a href="#" onClick={openContactPopup}><li className='hidden sm:inline hover:text-yellow-500 transition duration-300'>Contact</li></a>
                        <Link to={'/about'}><li className='hidden sm:inline hover:text-yellow-500 transition duration-300'>About</li></Link>
                        <Link to={'/profile'}>
                            {
                                currentUser ? 
                                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                                    : <li className='hover:text-yellow-500 transition duration-300'>Sign In</li>
                            }
                        </Link>
                    </ul>
                </div>
            </header>
            
            {/* Contact Popup Component */}
            <ContactPopup isOpen={isContactPopupOpen} onClose={closeContactPopup} />
        </>
    );
}