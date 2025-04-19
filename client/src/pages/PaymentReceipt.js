import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PaymentReceipt() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const transactionId = params.transactionId;
  const paymentDate = new Date().toLocaleDateString();
  
  // In a real app, you would fetch the transaction details from your backend
  // This is hardcoded for demonstration purposes
  const [transaction] = useState({
    id: transactionId,
    date: paymentDate,
    amount: 250000,
    fee: 7500,
    total: 257500,
    property: {
      name: "Luxury Apartment with City View",
      address: "123 Main St, New York, NY 10001",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      type: "rent",
      price: 250000
    },
    paymentMethod: "Credit Card (**** 1234)"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="max-w-3xl mx-auto p-3 print:p-0">
      <div className="bg-white p-8 rounded-lg shadow-md my-7 print:shadow-none">
        <div className="flex justify-between items-center mb-8 print:mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Receipt</h1>
            <p className="text-gray-600">Transaction #{transaction.id}</p>
          </div>
          <div className="print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
          </div>
        </div>
        
        <div className="border-b pb-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{transaction.date}</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium">{transaction.paymentMethod}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>
          <div className="flex items-center">
            <img 
              src={transaction.property.image} 
              alt="Property" 
              className="w-20 h-20 object-cover rounded-lg mr-4"
            />
            <div>
              <h3 className="font-semibold">{transaction.property.name}</h3>
              <p className="text-gray-600">{transaction.property.address}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
          
          <div className="border-b pb-4">
            <div className="flex justify-between mb-2">
              <span>Property {transaction.property.type === 'rent' ? 'Rent' : 'Price'}</span>
              <span>${(transaction.property.price / 100).toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Processing Fee</span>
              <span>${(transaction.fee / 100).toLocaleString('en-US')}</span>
            </div>
          </div>
          
          <div className="pt-4 flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span>${(transaction.total / 100).toLocaleString('en-US')}</span>
          </div>
        </div>
        
        <div className="border-t pt-6 text-center">
          <div className="mb-2">
            <p className="font-medium">Real Estate Co.</p>
            <p className="text-gray-600">1234 Business Ave, Suite 500</p>
            <p className="text-gray-600">San Francisco, CA 94107</p>
            <p className="text-gray-600">support@realestate.co</p>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Thank you for your business!
          </p>
        </div>
      </div>

      <div className="text-center mb-8 print:hidden">
        <Link 
          to="/"
          className="text-blue-600 hover:underline"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
} 