import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Home } from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Header from './Pages/Header';
import Footer from './Pages/Footer';
import { Products } from './Pages/Products';
import { ProductsDetails } from './Pages/ProductsDetails';
import NotFound from './Pages/NotFound';
import { ShowWishlist } from './Pages/ShowWishList';
import { ConfirmOrder } from './Pages/ConfirmOrder';
import ReviewSection from './Pages/Reviewsection';
import Contact from './Pages/Contact';
import OrderTracking from './Pages/OrderTracking';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsOfService from './Pages/TermsOfServices';
import Payment from './Pages/Payment';
import AdminPanel from './Pages/AdminPannel';

function LayoutWithHeaderFooter() {
  return (
    <>
      <Header />
      <Outlet /> 
      <Footer />
    </>
  );
}

function LayoutWithoutHeaderFooter() {
  return (
    <>
      <Outlet />  
          </>
  );
}

function ProductsLayout() {
  return (
    <>
      <Products />
      <ReviewSection />   
      <Contact />         
    </>
  );
}

function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />  
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Header and Footer */}
        <Route element={<LayoutWithHeaderFooter />}>
          <Route path="/products" element={<ProductsLayout />} />  {/* Products with Reviews and Contact */}
          <Route path="/products/:id" element={<ProductsDetails />} />
          <Route path="/wishlist" element={<ShowWishlist />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/reviews" element={<ReviewSection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path='/payment' element={<Payment/>}/>
        </Route>

        {/* Routes without Header and Footer (SignIn/SignUp) */}
        <Route element={<LayoutWithoutHeaderFooter />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<AdminPanel/>}/>
        </Route>

        {/* Routes with only Header (Home) */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
