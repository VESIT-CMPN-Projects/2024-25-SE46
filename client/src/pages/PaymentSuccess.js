import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PaymentSuccess() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [transactionId] = useState(`TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  const [paymentDate] = useState(new Date().toLocaleDateString());
  
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

  if (loading) {
    return <p className="text-center my-7 text-2xl">Loading...</p>;
  }

  if (error || !listing) {
    return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-3">
      <div className="bg-white p-6 rounded-lg shadow-md my-7">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-green-600">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your payment. Your transaction has been completed.
          </p>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Transaction ID</p>
              <p className="font-medium">{transactionId}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{paymentDate}</p>
            </div>
            <div>
              <p className="text-gray-600">Amount</p>
              <p className="font-medium">${(listing.regularPrice * 1.03).toLocaleString('en-US')}</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium">Credit Card (**** 1234)</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Property Details</h2>
          
          <div className="flex items-center">
            <img 
              src={listing.imageUrls[0]} 
              alt="Property" 
              className="w-24 h-24 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="font-semibold">{listing.name}</h3>
              <p className="text-gray-600">{listing.address}</p>
              <p className="font-medium mt-1">
                ${listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link 
            to="/"
            className="w-1/2 text-center py-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to={`/receipt/${transactionId}`}
            className="w-1/2 bg-slate-700 text-white text-center py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
          >
            View Receipt
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            An email confirmation has been sent to {currentUser?.email}
          </p>
        </div>
      </div>
    </main>
  );
}