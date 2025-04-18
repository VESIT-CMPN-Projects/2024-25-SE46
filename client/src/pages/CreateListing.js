
import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { FaUpload, FaTrash, FaHome, FaBed, FaBath, FaMoneyBillWave } from 'react-icons/fa';
import Footer from '../components/Footer';

export default function CreateListing() {
  const DEFAULT_IMAGE = 'https://res.cloudinary.com/dwliqvb4o/image/upload/v1743611437/ff061825fa8e44bf8108de5c786c0062_i87rzq.jpg';
  
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const[image,setImage]=useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({    
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    regularPrice: 100,
    discountPrice: 0,
    bathRooms: 1,
    bedRooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false
  });

  const {currentUser} = useSelector(state=> state.user);
  const navigate = useNavigate();

async function handleImageSubmit() {
  try {
    if(image){
      await storeImage(image)
      console.log("image stored");
    }
  } catch (error) {
    console.error(error);
  }
  // setError('');
  // setUploading(true);

  // if (files.length === 0) {
  //   setUploadError('Please Choose an image to Upload');
  //   setUploading(false);
  //   return;
  // }

  // if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
  //   try {
  //     const urls = [];
  //     for (let i = 0; i < files.length; i++) {
  //       const url = await storeImage(files[i]);
  //       urls.push(url);
  //     }
  //     setFormData({
  //       ...formData,
  //       imageUrls: formData.imageUrls.concat(urls),
  //     });
  //   } catch (error) {
  //     setUploadError('Failed to upload one or more images');
  //   } finally {
  //     setUploading(false);
  //   }
  // } else {
  //   setUploadError('You can only upload 6 images per listing');
  //   setUploading(false);
  // }
}

async function storeImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ryan1234");
  data.append("cloud_name", "dwliqvb4o");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dwliqvb4o/image/upload`,
      {
        method: 'POST',
        body: data
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const result = await response.json();
    return result.secure_url;

  } catch (error) {
    setUploadError(error.message);
    throw error;
  }
}


  function handleRemoveImage(index){
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i)=> i !== index)
    })
  }

  function handleChange(e){
    setError('');

    if(e.target.id === 'sell' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(+formData.regularPrice < +formData.discountPrice) return setError('Discounted Price must be lower than regular price');
      setLoading(true);
      setError(false);

      // If no images uploaded, use default image
      const finalFormData = {
        ...formData,
        imageUrls: formData.imageUrls.length === 0 ? [DEFAULT_IMAGE] : formData.imageUrls
      };

      const res = await fetch(`/api/listing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...finalFormData,
          userRef: currentUser._id
        }),
      });
  
      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      navigate('/profile');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  function fileInput(){
    setUploadError('');
    setError('');
  }
 
  return (
    <div>
    <main className='p-6 max-w-5xl mx-auto'>
        <div className="text-center mb-8">
          <h1 className='text-3xl font-bold text-blue-900 my-2'>Create a Premium Listing</h1>
          <p className="text-gray-600">Add your luxury property to SOBO Thane's exclusive collection</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-lg shadow-lg p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Left Column */}
            <div className='space-y-6'>
              <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b border-gray-200">Property Details</h2>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-1 font-medium">Property Name</label>
                  <input 
                    onChange={handleChange} 
                    value={formData.name} 
                    type="text" 
                    placeholder='Luxury Villa Name' 
                    className='border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    id='name' 
                    maxLength='62' 
                    minLength='10' 
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 mb-1 font-medium">Description</label>
                  <textarea 
                    onChange={handleChange} 
                    value={formData.description} 
                    placeholder='Describe this luxury property...' 
                    className='border border-gray-300 p-3 rounded-lg w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    id='description' 
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-700 mb-1 font-medium">Address</label>
                  <input 
                    onChange={handleChange} 
                    value={formData.address} 
                    type="text" 
                    placeholder='Property Location' 
                    className='border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    id='address' 
                    required
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b border-gray-200">Property Features</h2>
                
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
                  <div className='flex items-center gap-2'>
                    <input 
                      onChange={handleChange} 
                      checked={formData.type === 'sell'} 
                      type="checkbox" 
                      id='sell' 
                      className='w-5 h-5 accent-yellow-500' 
                    />
                    <span className="font-medium">For Sale</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input 
                      onChange={handleChange} 
                      checked={formData.type === 'rent'} 
                      type="checkbox" 
                      id='rent' 
                      className='w-5 h-5 accent-yellow-500' 
                    />
                    <span className="font-medium">For Rent</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input 
                      onChange={handleChange} 
                      checked={formData.parking} 
                      type="checkbox" 
                      id='parking' 
                      className='w-5 h-5 accent-yellow-500' 
                    />
                    <span className="font-medium">Parking</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input 
                      onChange={handleChange} 
                      checked={formData.furnished} 
                      type="checkbox" 
                      id='furnished' 
                      className='w-5 h-5 accent-yellow-500' 
                    />
                    <span className="font-medium">Furnished</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input 
                      onChange={handleChange} 
                      checked={formData.offer} 
                      type="checkbox"
                      id='offer' 
                      className='w-5 h-5 accent-yellow-500' 
                    />
                    <span className="font-medium">Special Offer</span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-6 mb-2'>
                  <div className='flex items-center gap-3 border border-gray-200 p-3 rounded-lg'>
                    <FaBed className="text-blue-900" />
                    <input 
                      onChange={handleChange} 
                      value={formData.bedRooms} 
                      type="number" 
                      id='bedRooms' 
                      min='1' 
                      max='10' 
                      required 
                      className='p-2 w-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    />
                    <p className="font-medium">Bedrooms</p>
                  </div>
                  
                  <div className='flex items-center gap-3 border border-gray-200 p-3 rounded-lg'>
                    <FaBath className="text-blue-900" />
                    <input 
                      onChange={handleChange} 
                      value={formData.bathRooms} 
                      type="number" 
                      id='bathRooms' 
                      min='1' 
                      max='10' 
                      required 
                      className='p-2 w-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    />
                    <p className="font-medium">Bathrooms</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b border-gray-200">Pricing</h2>
                
                <div className='flex flex-wrap gap-6'>
                  <div className='flex items-center gap-3 border border-gray-200 p-3 rounded-lg'>
                    <FaMoneyBillWave className="text-green-600" />
                    <input 
                      onChange={handleChange} 
                      value={formData.regularPrice} 
                      type="number" 
                      id='regularPrice' 
                      min='50' 
                      required 
                      className='p-2 w-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    />
                    <div className='flex flex-col'>
                      <p className="font-medium">Regular Price</p>
                      <span className='text-xs text-gray-500'>($ / month)</span>
                    </div>                  
                  </div>
                  
                  {formData.offer && (
                    <div className='flex items-center gap-3 border border-gray-200 p-3 rounded-lg'>
                      <FaMoneyBillWave className="text-yellow-500" />
                      <input 
                        onChange={handleChange} 
                        value={formData.discountPrice} 
                        type="number" 
                        id='discountPrice' 
                        min='0' 
                        required 
                        className='p-2 w-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
                      />
                      <div className='flex flex-col'>
                        <p className="font-medium">Discounted Price</p>
                        <span className='text-xs text-gray-500'>($ / month)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b border-gray-200">
                  Property Images
                  <span className='text-sm font-normal text-gray-600 ml-2 block mt-1'>The first image will be the cover (max 6)</span>
                </h2>

                <div className='flex flex-col gap-4'>
                  <div className='flex gap-2'>
                    <div className="relative flex-1">
                      <input 
                        onClick={fileInput} 
                        onChange={(e)=>setImage(e.target.files)} 
                        className='p-3 border border-gray-300 rounded-lg w-full bg-white' 
                        type="file" 
                        id='images' 
                        accept='image/*' 
                        multiple 
                      />
                    </div>
                    <button 
                      disabled={uploading} 
                      type='button' 
                      onClick={handleImageSubmit} 
                      className='p-3 bg-blue-900 text-white rounded-lg uppercase hover:bg-blue-800 disabled:opacity-70 flex items-center gap-2'
                    >
                      <FaUpload />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  
                  {uploadError && <p className='text-red-600 text-sm mt-1'>{uploadError}</p>}
                  
                  <div className="mt-2 max-h-96 overflow-y-auto pr-2">
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=> (
                      <div key={url} className='flex justify-between p-3 border border-gray-200 rounded-lg mb-3 items-center'>
                        <div className="flex items-center gap-3">
                          {index === 0 && <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Cover</span>}
                          <img src={url} alt="listing-image" className='w-20 h-20 object-cover rounded-lg' />
                        </div>
                        <button 
                          onClick={()=>handleRemoveImage(index)} 
                          type='button' 
                          className='p-2 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-1'
                        >
                          <FaTrash /> 
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-8">
                <button 
                  disabled={uploading || loading} 
                  className='w-full p-4 bg-blue-900 text-white rounded-lg uppercase font-semibold hover:bg-blue-800 disabled:opacity-70 flex items-center justify-center gap-2'
                >
                  <FaHome />
                  {loading ? 'Creating Listing...' : 'Create Luxury Listing'}
                </button>
                
                {error && <p className='text-red-600 text-sm mt-3 text-center'>{error}</p>}
              </div>
            </div>
          </div>
        </form>
    </main>
    <Footer/>
    </div>
  );
}