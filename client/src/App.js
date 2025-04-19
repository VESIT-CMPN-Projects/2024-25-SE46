import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Payment from './pages/Payment';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentReceipt from './pages/PaymentReceipt';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/search' element={<Search />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
          {/* ✅ Move these outside of update-listing route */}
          <Route path='/payment/:listingId' element={<Payment />} />
          <Route path='/payment/confirm/:listingId' element={<PaymentConfirmation />} />
          <Route path='/payment/success/:listingId' element={<PaymentSuccess />} />
          <Route path='/receipt/:transactionId' element={<PaymentReceipt />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
