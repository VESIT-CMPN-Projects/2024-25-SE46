import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaShare, FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaRegHeart, FaStar, FaUser, FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'
import Footer from '../components/Footer';

export default function Listing() {
    SwiperCore.use([Navigation, EffectFade, Pagination]);

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewHover, setReviewHover] = useState(0);
    const [reviewComment, setReviewComment] = useState('');

    const params = useParams();
    const { currentUser } = useSelector((state) => state.user)

    // Hardcoded reviews data
    const mockReviews = [
        {
            id: 1,
            userName: "Sarah Johnson",
            rating: 5,
            date: "December 15, 2023",
            comment: "Absolutely stunning property! The views are breathtaking and the amenities are top-notch. The location is perfect - close to everything yet peaceful and quiet.",
        },
        {
            id: 2,
            userName: "Michael Chen",
            rating: 4,
            date: "December 10, 2023",
            comment: "Beautiful modern space with great natural light. The kitchen is well-equipped and the bedrooms are spacious. Only minor issue was parking during peak hours.",
        },
        {
            id: 3,
            userName: "Emma Davis",
            rating: 5,
            date: "December 5, 2023",
            comment: "This property exceeded all our expectations! The interior design is impeccable, and the attention to detail is remarkable.",
        }
    ];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={index < rating ? "text-[#273A78]" : "text-gray-300"}
            />
        ));
    };

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId])

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        // For now, just close the modal and reset form
        setShowReviewForm(false);
        setReviewRating(0);
        setReviewComment('');
    };

    return (
        <div>
        <main className="bg-gray-50">
            {loading && (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#273A78]"></div>
                </div>
            )}
            {error && (
                <div className="h-screen flex items-center justify-center">
                    <p className="text-2xl text-red-600 font-light">Something went wrong!</p>
                </div>
            )}
            {listing && !loading && !error && (
                <>
                    {/* Image Slider Section */}
                    <div className="relative">
                        <Swiper
                            navigation
                            pagination={{ type: 'fraction' }}
                            effect="fade"
                            className="h-[70vh] md:h-[80vh]"
                        >
                            {listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div
                                        className="h-full w-full relative"
                                        style={{
                                            background: `url(${url}) center no-repeat`,
                                            backgroundSize: 'cover'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button
                                className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-300"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 2000)
                                }}
                            >
                                <FaShare className="text-[#273A78]" />
                            </button>
                            <button className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-300">
                                <FaRegHeart className="text-[#273A78]" />
                            </button>
                        </div>

                        {copied && (
                            <div className="absolute top-20 right-4 z-10 bg-white shadow-lg rounded-lg px-4 py-2">
                                Link copied to clipboard
                            </div>
                        )}
                    </div>

                    {/* Main Content Section */}
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Left Column - Property Details */}
                                <div className="md:col-span-2">
                                    {/* Property Title and Location */}
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        {listing.name}
                                    </h1>

                                    <p className="flex items-center gap-2 text-gray-600 mb-6">
                                        <FaMapMarkerAlt className="text-[#273A78]" />
                                        {listing.address}
                                    </p>

                                    {/* Property Tags */}
                                    <div className="flex gap-4 mb-8">
                                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-[#273A78] text-white">
                                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                        </span>
                                        {listing.offer && (
                                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-600 text-white">
                                                ${+listing.regularPrice - +listing.discountPrice} OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Property Features */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50">
                                                <FaBed className="text-xl text-[#273A78]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Bedrooms</p>
                                                    <p className="font-semibold">{listing.bedRooms}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50">
                                                <FaBath className="text-xl text-[#273A78]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Bathrooms</p>
                                                    <p className="font-semibold">{listing.bathRooms}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50">
                                                <FaParking className="text-xl text-[#273A78]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Parking</p>
                                                    <p className="font-semibold">{listing.parking ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50">
                                                <FaChair className="text-xl text-[#273A78]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Furnished</p>
                                                    <p className="font-semibold">{listing.furnished ? 'Yes' : 'No'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                                        <p className="text-gray-600 leading-relaxed">
                                            {listing.description}
                                        </p>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="mt-12 border-t pt-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Property Reviews
                                            </h2>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {renderStars(4.7)}
                                                </div>
                                                <span className="text-lg font-semibold text-gray-700">4.7</span>
                                                <span className="text-gray-500">
                                                    ({mockReviews.length} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Reviews List */}
                                        <div className="space-y-6">
                                            {mockReviews.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="bg-gray-50 rounded-xl p-6 transition-transform hover:scale-[1.02] duration-300"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-[#273A78]/20 flex items-center justify-center">
                                                                <FaUser className="text-[#273A78]" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">
                                                                    {review.userName}
                                                                </h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {review.date}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Write Review Button */}
                                        {currentUser && (
                                            <button 
                                                onClick={() => setShowReviewForm(true)}
                                                className="mt-8 px-6 py-3 bg-[#273A78] hover:bg-[#1e2d60] text-white rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2"
                                            >
                                                <FaStar />
                                                Write a Review
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Price and Contact */}
                                <div className="md:col-span-1">
                                    <div className="sticky top-8">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <div className="mb-6">
                                                <p className="text-3xl font-bold text-gray-900">
                                                    ${listing.offer ? 
                                                        listing.discountPrice.toLocaleString('en-US') : 
                                                        listing.regularPrice.toLocaleString('en-US')}
                                                    {listing.type === 'rent' && ' / month'}
                                                </p>
                                                {listing.offer && (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        ${listing.regularPrice.toLocaleString('en-US')}
                                                    </p>
                                                )}
                                            </div>

                                            {currentUser && listing.userRef !== currentUser._id && !contact && (
                                                <button
                                                    onClick={() => setContact(true)}
                                                    className="w-full bg-[#273A78] hover:bg-[#1e2d60] text-white rounded-lg py-4 font-semibold transition-colors duration-300"
                                                >
                                                    Contact Landlord
                                                </button>
                                            )}

                                            {contact && <Contact listing={listing} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review Form Modal */}
                    {showReviewForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
                                    <button 
                                        onClick={() => setShowReviewForm(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <FaTimes className="text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    {/* Rating Stars */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">
                                            Rating
                                        </label>
                                        <div className="flex gap-2">
                                            {[...Array(5)].map((_, index) => {
                                                const ratingValue = index + 1;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={ratingValue}
                                                        onClick={() => setReviewRating(ratingValue)}
                                                        onMouseEnter={() => setReviewHover(ratingValue)}
                                                        onMouseLeave={() => setReviewHover(0)}
                                                        className="text-2xl focus:outline-none transition-colors"
                                                    >
                                                        <FaStar 
                                                            className={`${
                                                                ratingValue <= (reviewHover || reviewRating)
                                                                    ? 'text-[#273A78]'
                                                                    : 'text-gray-300'
                                                            } transform hover:scale-110 transition-transform`}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Review Text */}
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">
                                            Your Review
                                        </label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#273A78] focus:ring-2 focus:ring-[#273A78]/20 transition-all"
                                            rows="4"
                                            placeholder="Share your experience with this property..."
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#273A78] hover:bg-[#1e2d60] text-white rounded-lg py-3 font-semibold transition-colors duration-300"
                                    >
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </main>
        <Footer/>
        </div>
    )
}