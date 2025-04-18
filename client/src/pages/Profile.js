import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import {signoutUserStart, signoutUserSuccess, signoutUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, updateUserStart, updateUserSuccess, updateUserFailure} from '../redux/user/userSlice';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state)=> state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [emptyData, setEmptyData] = useState(false);
  const [openListings, setOpenListings] = useState(false);

  const dispatch = useDispatch();

  function handleFileUpload(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://api.cloudinary.com/v1_1/dbzrbmfi8/image/upload");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setProfileImage(response.url);
        setFormData({...formData, avatar: response.url});
        setUploadError(null);
      } else {
        setUploadError("Upload failed with status: " + xhr.status);
      }
      setProgress(0);
    };

    xhr.onerror = () => {
      setUploadError("An error occurred during the upload.");
      setProgress(0);
    };

    xhr.send(data);
  }

  function handleChange(e){
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  async function handleSubmit(e){
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleDeleteUser(){
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function handleSignoutUser(){
    try {
      dispatch(signoutUserStart());
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if(data.success === false){
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  }

  async function handleShowListings(){
    setShowListingsError(false);
    if(!openListings){      
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if(data.success === false){
          setShowListingsError(true);
          return;
        }
        if(data.length === 0){
          setEmptyData(true);
          return;
        }
        setUserListings(data);
        setOpenListings(true);
      } catch (error) {
        setShowListingsError(true);
      }
    }else{
      setOpenListings(false);
      setUserListings([]);      
    }
  }

  async function handleListingDelete(listingId){
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if(data.success === false){
        return;
      }
      setUserListings((prev)=> prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
    }
  }

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Profile</h1>
          <p className="text-slate-500 max-w-xl mx-auto">Manage your account details and property listings</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-[#F5F7FF] rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Profile Banner */}
              <div className="h-32 bg-gradient-to-r from-bg-[#273A78] to-bg-[#273A78]"></div>
              
              {/* Profile Info */}
              <div className="px-6 pb-6 -mt-16 relative">
                <div className="flex justify-center">
                  <div className="relative group">
                    <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} accept="image/*" hidden/>
                    <div 
                      onClick={()=> fileRef.current.click()} 
                      className="h-32 w-32 rounded-full border-4 border-white bg-[#F5F7FF] shadow-md overflow-hidden cursor-pointer"
                    >
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-sm font-medium">Change Photo</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Upload Progress */}
                <div className="w-full mt-3">
                  {uploadError ? (
                    <p className="text-red-600 text-sm text-center bg-red-50 py-1 px-2 rounded-md">{uploadError}</p>
                  ) : progress > 0 && progress < 100 ? (
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div className="bg-[#273A78] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                      <p className="text-xs text-center mt-1 text-slate-500">{`Uploading ${progress}%`}</p>
                    </div>
                  ) : progress === 100 ? (
                    <p className="text-[#273A78] text-sm text-center bg-[#273A78] py-1 px-2 rounded-md">Image uploaded successfully!</p>
                  ) : null}
                </div>
                
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-slate-800">{currentUser.username}</h2>
                  <p className="text-slate-500 text-sm mt-1">{currentUser.email}</p>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={handleShowListings} 
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center ${
                      openListings 
                        ? 'bg-slate-100 text-slate-700 hover:bg-[#EEF1FF]' 
                        : 'bg-[#273A78] text-white hover:bg-[#273A78]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    {openListings ? 'Hide My Listings' : 'Show My Listings'}
                  </button>
                  
                  <Link 
                    to="/create-listing" 
                    className="w-full bg-[#273A78] text-white py-2.5 px-4 rounded-lg text-sm font-medium text-center hover:bg-[#273A78] transition-all duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Listing
                  </Link>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="border-t border-slate-100 px-6 py-4">
                <h3 className="text-sm font-medium text-slate-500 mb-3">Account Management</h3>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={handleSignoutUser} 
                    className="text-slate-600 text-sm font-medium hover:text-slate-800 transition-colors duration-300 flex items-center py-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                  
                  <button 
                    onClick={handleDeleteUser} 
                    className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors duration-300 flex items-center py-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Update Form & Listings */}
          <div className="lg:col-span-8">
            {/* Update Profile Form */}
            <div className="bg-[#F5F7FF] rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#273A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Update Profile
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input 
                        onChange={handleChange} 
                        defaultValue={currentUser.username} 
                        type="text" 
                        placeholder="Username" 
                        className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#273A78] focus:border-[#273A78] outline-none transition-all" 
                        id="username"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input 
                        onChange={handleChange} 
                        defaultValue={currentUser.email} 
                        type="email" 
                        placeholder="Email" 
                        className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#273A78] focus:border-[#273A78] outline-none transition-all" 
                        id="email"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      onChange={handleChange} 
                      type="password" 
                      placeholder="New Password" 
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-[#273A78] focus:border-[#273A78] outline-none transition-all" 
                      id="password"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">Leave blank to keep current password</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-[#273A78] text-white py-3 rounded-lg font-medium hover:bg-[#273A78] transition-all duration-300 disabled:bg-[#273A78] disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : 'Update Profile'}
                  </button>
                </div>
              </form>
              
              {/* Status Messages */}
              {error && (
                <div className="mt-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              
              {updateSuccess && (
                <div className="mt-5 bg-[#273A78] border text-[#273A78] text-[#273A78] px-4 py-3 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#273A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Profile updated successfully!
                </div>
              )}
            </div>
            
            {/* Listings Section */}
            {showListingsError && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error showing listings. Please try again.
              </div>
            )}
            
            {emptyData && (
              <div className="bg-amber-50 border border-amber-100 text-amber-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You don't have any listings yet. Create your first listing!
              </div>
            )}
            
            {userListings && userListings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#273A78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Your Listings ({userListings.length})
                </h2>
                
                <div className="space-y-5">
                  {userListings.map((listing) => (
                    <div key={listing._id} className="bg-[#EEF1FF] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-slate-100">
                      <div className="flex flex-col sm:flex-row">
                        <Link to={`/listing/${listing._id}`} className="sm:w-1/3 lg:w-1/4 relative group">
                          <img 
                            src={listing.imageUrls[0]} 
                            alt="listing-cover" 
                            className="h-48 sm:h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        </Link>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-4">
                            <Link to={`/listing/${listing._id}`} className="text-lg font-bold text-slate-800 hover:text-[#273A78] transition-colors line-clamp-1">
                              {listing.name}
                            </Link>
                            <p className="text-sm text-slate-500 mt-1 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {listing.address}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-auto">
                            <Link to={`/update-listing/${listing._id}`} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#273A78]/10 text-[#273A78] hover:bg-teal-100 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleListingDelete(listing._id)} 
                              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                            <Link to={`/listing/${listing._id}`} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#EEF1FF] text-slate-700 hover:bg-slate-300 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}