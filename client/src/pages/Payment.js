import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Payment() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle payment processing here
    // For now, redirect to the confirmation page
    window.location.href = `/payment/confirm/${params.listingId}`;
  };

  if (loading) {
    return <p className="text-center my-7 text-2xl">Loading...</p>;
  }

  if (error || !listing) {
    return <p className="text-center my-7 text-2xl">Something went wrong!</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">
        {listing.type === 'rent' ? 'Rent Payment' : 'Property Purchase'}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Property summary */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Property Summary</h2>
          <div className="mb-4">
            <img 
              src={listing.imageUrls[0]} 
              alt="Property" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <h3 className="text-lg font-semibold">{listing.name}</h3>
          <p className="text-gray-600">{listing.address}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold text-2xl text-slate-700">
              ${listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </span>
          </div>
        </div>

        {/* Payment form */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          <div className="mb-4">
            <p className="font-semibold">Select Payment Method:</p>
            <div className="flex gap-4 mt-2">
              <button 
                type="button"
                className={`px-4 py-2 rounded-lg border ${
                  paymentMethod === 'credit' ? 'bg-slate-700 text-white' : 'bg-white'
                }`}
                onClick={() => setPaymentMethod('credit')}
              >
                Credit Card
              </button>
              <button 
                type="button"
                className={`px-4 py-2 rounded-lg border ${
                  paymentMethod === 'bank' ? 'bg-slate-700 text-white' : 'bg-white'
                }`}
                onClick={() => setPaymentMethod('bank')}
              >
                Bank Transfer
              </button>
            </div>
          </div>

          {paymentMethod === 'credit' && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="cardName">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="cardNumber">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="**** **** **** ****"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="expiryDate">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="cvv">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="***"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
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

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Complete Payment
              </button>
            </form>
          )}

          {paymentMethod === 'bank' && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="accountName">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="accountName"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="accountNumber">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  placeholder="**** **** **** ****"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="routingNumber">
                  Routing Number
                </label>
                <input
                  type="text"
                  id="routingNumber"
                  placeholder="*********"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  required
                />
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${listing.regularPrice.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Processing Fee</span>
                  <span>${(listing.regularPrice * 0.01).toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(listing.regularPrice * 1.01).toLocaleString('en-US')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Complete Payment
              </button>
            </form>
          )}
          
          <p className="mt-4 text-sm text-gray-500 text-center">
            By completing this payment, you agree to our <Link to="/terms" className="text-blue-600">Terms of Service</Link>
          </p>
        </div>
      </div>
    </main>
  );
}