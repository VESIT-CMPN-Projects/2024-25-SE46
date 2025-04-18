import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import ListingItem from '../components/ListingItem'
import Footer from '../components/Footer';
export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  SwiperCore.use([Navigation]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll function
  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function fetchOfferListings() {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        // console.log(error);
      }
    }

    async function fetchRentListings() {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        // console.log(error);
      }
    }

    async function fetchSaleListings() {
      try {
        const res = await fetch(`/api/listing/get?type=sell&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  }, []);

  // Calculate parallax effect
  const parallaxStyle = {
    transform: `translateY(${scrollPosition * 0.4}px)`,
    opacity: Math.max(0, 1 - scrollPosition / 700)
  };

  return (
    <div className="relative">
      {/* Background that extends throughout the page with fixed attachment */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-10" 
        style={{ 
          backgroundImage: "url('https://s3-alpha-sig.figma.com/img/681e/2b89/e7f01d7bf35facfaa85a07e993be9d3b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=CPMppC9K~jFRjl5WSE5yqYOjviiWL-8GhDj8mRumLyC1b8TOF2tVKOSLo7OuTpN~it98rTAoCTCE1HovKGhGCklwz5rvbgGWYgqg0-FFT9iFituGPOC3CTpEOfXJgEMreKelsa0e4JNwrxh3XVjYD9IHvTTc3QAscmO1AismubIUcj3uQv~q6~IXbzW6XrQT2fyVSZ~XVch9rzUj6xYqPQ1M6JYu1EqkSqLiDzJxoK-GIW-hn86KVwYK7AAcgpz2g8h3iFNwrSiVmaRrXYZeHF-WipkMpNko71jS5gqv9d99x12gLdE8lh-B9Sjzb7NyV4XsbazYeHSxNCgDv3gWXA__')", // Replace with actual path
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
      </div>

      {/* Full-screen Hero Section */}
      <div className="relative h-screen">
        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4" style={parallaxStyle}>
          <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl mb-4 drop-shadow-lg">
            Find Your Dream Home
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
            Discover the perfect property from our extensive collection of homes, apartments, and luxury estates.
          </p>
          <button 
            onClick={scrollToContent}
            className="bg-white text-slate-800 hover:bg-slate-100 px-6 py-3 rounded-md font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
          >
            Browse Properties
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Content Section with visual improvements */}
      <div id="content-section" className="relative">
        {/* Decorative curved transition element */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white/90 -translate-y-24"></div>
        
        {/* Upgraded content container with subtle background */}
        <div className="relative bg-gradient-to-b from-white/90 via-white/95 to-sky-50/95 backdrop-blur-sm pt-16 pb-20 min-h-screen">
          <div className="flex flex-col gap-6 p-16 md:p-28 px-3 max-w-6xl mx-auto relative">
            {/* Abstract decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-cyan-300/20 rounded-full blur-3xl -z-10 transform translate-x-1/4 -translate-y-1/4"></div>
            
            <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl relative'>
              Find your next <span className='text-slate-500'>perfect</span>
              <br/>
              place with ease
              {/* Decorative underline */}
              <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-300"></div>
            </h1>
            <div className="text-gray-600 text-xs sm:text-sm mt-4">
              Hrizon Estate is the best place to find your next perfect place to live.
              <br/>
              We have a wide range of properties to choose from.
            </div>
            <Link className='text-blue-600 text-xs sm:text-sm font-bold hover:underline transition-all hover:text-blue-800' to={'/search'}>Let's get started...</Link>
          </div>

          {/* Enhanced Swiper */}
          <div className="relative mb-16">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 -z-10"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
            
            <Swiper navigation className="shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto">
              {
                offerListings && offerListings.length > 0 &&
                offerListings.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <div 
                      style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} 
                      className='h-[500px] relative'
                    >
                      {/* Optional subtle gradient overlay on images */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
          </div>

          {/* Listings Sections with Visual Improvements */}
          <div className='max-w-[87rem] mx-auto p-3 flex flex-col gap-8 my-10 relative'>
            {/* Decorative elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-cyan-100/20 to-blue-200/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/20 to-cyan-200/10 rounded-full blur-3xl -z-10"></div>
            
            {/* Offer Listings Section */}
            {
              offerListings && offerListings.length > 0 && (
                <div className='relative p-6 rounded-xl backdrop-blur-sm bg-white/50 shadow-md border border-blue-50'>
                  <div className='my-0 flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold text-slate-700 relative'>
                      Recent Offers
                      <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300"></div>
                    </h2>
                    <Link to={'/search?offer=true'} className='text-sm text-blue-600 hover:underline font-medium transition-colors hover:text-blue-800'>Show more offers</Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {
                      offerListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id}></ListingItem>
                      ))
                    }
                  </div>
                </div>
              )
            }
            
            {/* Rent Listings Section */}
            {
              rentListings && rentListings.length > 0 && (
                <div className='relative p-6 rounded-xl backdrop-blur-sm bg-white/50 shadow-md border border-blue-50'>
                  <div className='my-3 flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold text-slate-700 relative'>
                      Recent places for rent
                      <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300"></div>
                    </h2>
                    <Link to={'/search?type=rent'} className='text-sm text-blue-600 hover:underline font-medium transition-colors hover:text-blue-800'>Show more places for Rent</Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {
                      rentListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id}></ListingItem>
                      ))
                    }
                  </div>
                </div>
              )
            }
            
            {/* Sale Listings Section */}
            {
              saleListings && saleListings.length > 0 && (
                <div className='relative p-6 rounded-xl backdrop-blur-sm bg-white/50 shadow-md border border-blue-50'>
                  <div className='my-3 flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold text-slate-700 relative'>
                      Recent places for Sale
                      <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300"></div>
                    </h2>
                    <Link to={'/search?type=sell'} className='text-sm text-blue-600 hover:underline font-medium transition-colors hover:text-blue-800'>Show more places for sale</Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {
                      saleListings.map((listing) => (
                        <ListingItem listing={listing} key={listing._id}></ListingItem>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
          
          {/* Footer accent */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
}