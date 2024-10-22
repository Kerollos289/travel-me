//App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TouristRegister from "./touristRegister";
import TravelJobsRegister from "./travelJobsRegister";
import Login from "./login";
import AdvertiserPage from "./AdvertiserPage";
import TourGuidePage from "./TourGuidePage";
import TourismGovernorPage from "./TourismGovernorPage";
import ChangePassword from "./ChangePassword";
import TouristPage from "./touristPage";
import ItineraryPage from "./ItineraryPage"; 
import MuseumPage from "./MuseumPage"; 
import ActivityCategoryPage from "./activityCategoryPage";
import PreferenceTagsPage from "./preferenceTagsPage";
import SalesReport from "./SalesPage";
import NotAccepted from "./notAccepted";
import Admin from "./admin";
import AdvertiserProfile from "./AdvertiserProfile";
import SellerPage from "./sellerPage";
import AdminDelete from "./adminDelete";
import AdminCreateAccount from "./adminCreateAccount";
import TouristProfile from "./touristProfile";
import GuestPage from "./GuestPage"; 
import AdvertiserMainPage from "./AdvertiserMainPage"; 
import TourGuideMainPage from "./TourGuideMainPage"; 
import AdminMainPage from "./AdminMainPage"; // Import the new AdminMainPage
import AdminDeleteRequest from "./adminDeleteRequest";
import ForgetPassword from "./forgetPassword";
import SellerMainPage from "./SellerMainPage";
import "./App.css";
import "./ButtonStyles.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to TravelMe</h1>
      <div className="buttons-container">
        <Link to="/tourist-register">
          <button className="register-btn">Register as Tourist</button>
        </Link>
        <Link to="/travel-jobs-register">
          <button className="register-btn">Register for Travel Jobs</button>
        </Link>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
        <Link to="/advertiser-main">
          <button className="role-btn">Advertiser</button>
        </Link>
        <Link to="/tour-guide-main">
          <button className="role-btn">Tour Guide</button>
        </Link>
        <Link to="/tourism-governor">
          <button className="role-btn">Tourism Governor</button>
        </Link>
        <Link to="/change-password">
          <button className="role-btn">Change Password</button>
        </Link>
        <Link to="/tourist-page">
          <button className="role-btn">Tourist</button>
        </Link>
        <Link to="/seller-main">
          <button className="role-btn">Seller Main Page</button>
        </Link>
        <Link to="/admin-main">
          <button className="role-btn">Admin Main Page</button>
        </Link>
        <Link to="/not-accepted">
          <button className="role-btn">Not Accepted</button>
        </Link>
         <Link to="/forget-password">
          <button className="role-btn">Forget Password</button>{" "}
          {/* Link to GuestPage */}
        </Link>
        <Link to="/admin-delete-request">
          <button className="role-btn">Admin Delete Request</button>{" "}
          {/* Link to GuestPage */}
        </Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tourist-register" element={<TouristRegister />} />
        <Route path="/travel-jobs-register" element={<TravelJobsRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/advertiser" element={<AdvertiserPage />} />
        <Route path="/tour-guide-main" element={<TourGuideMainPage />} />
        <Route path="/tour-guide" element={<TourGuidePage />} />
        <Route path="/tourism-governor" element={<TourismGovernorPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/tourist-page" element={<TouristPage />} />
        <Route path="/seller-page" element={<SellerPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/not-accepted" element={<NotAccepted />} />
        <Route path="/advertiser-profile" element={<AdvertiserProfile />} />
        <Route path="/tourist-profile" element={<TouristProfile />} />
        <Route path="/itinerary" element={<ItineraryPage />} /> 
        <Route path="/museum" element={<MuseumPage />} /> 
        <Route path="/admin-delete" element={<AdminDelete />} />
        <Route path="/admin-create" element={<AdminCreateAccount />} />
        <Route path="/admin-main" element={<AdminMainPage />} />
        <Route path="/advertiser-main" element={<AdvertiserMainPage />} /> {/* AdvertiserMainPage route */}
        <Route path="/activity-categories" element={<ActivityCategoryPage />} />
        <Route path="/preference-tags" element={<PreferenceTagsPage />} />
        <Route path="/sales-page" element={<SalesReport />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/admin-delete-request" element={<AdminDeleteRequest />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/seller-main" element={<SellerMainPage />} /> {/* New route for SellerMainPage */}
        {/* Include other routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
