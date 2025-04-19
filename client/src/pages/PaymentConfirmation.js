import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PaymentConfirmation() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      // Redirect to success page after "processing"
      window.location.href = `/payment/success/${params.listingId}`;
    }, 2000);
  };

  if (loading) {
    return <p className="text-center my-7 text-2xl">Loading...</p>;
  }

  if (error || !listing) {
    return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Confirm Your Payment</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Review Details</h2>
        
        <div className="mb-6 flex items-center">
          <img 
            src={listing.imageUrls[0]} 
            alt="Property" 
            className="w-24 h-24 object-cover rounded-lg mr-4"
          />
          <div>
            <h3 className="font-semibold">{listing.name}</h3>
            <p className="text-gray-600">{listing.address}</p>
          </div>
        </div>
        
        <div className="border-t border-b py-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Property {listing.type === 'rent' ? 'Rent' : 'Price'}</span>
            <span>${listing.regularPrice.toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Processing Fee</span>
            <span>${(listing.regularPrice * 0.03).toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${(listing.regularPrice * 1.03).toLocaleString('en-US')}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <div className="flex items-center p-3 border rounded-lg">
            <div className="bg-slate-100 p-2 rounded-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Credit Card</p>
              <p className="text-gray-600">**** **** **** 1234</p>
            </div>
          </div>
        </div>
        
        {isProcessing ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mb-2"></div>
            <p>Processing your payment...</p>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link 
              to={`/payment/${params.listingId}`}
              className="w-1/2 text-center py-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Edit Payment
            </Link>
            <button
              onClick={handleConfirmPayment}
              className="w-1/2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Confirm Payment
            </button>
          </div>
        )}
        
        <p className="mt-4 text-sm text-gray-500 text-center">
          Your payment information is secure and encrypted
        </p>
      </div>
    </main>
  );
}