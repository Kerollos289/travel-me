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
import GuestPage from "./GuestPage"; // Import GuestPage
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
        <Link to="/advertiser">
          <button className="role-btn">Advertiser</button>
        </Link>
        <Link to="/tour-guide">
          <button className="role-btn">Tour Guide</button>
        </Link>
        <Link to="/tourism-governor">
          <button className="role-btn">Tourism Governor</button>
        </Link>
        <Link to="/change-password">
          <button className="role-btn">Change Password</button>
        </Link>
        <Link to="/itinerary">
          <button className="role-btn">Itinerary</button>
        </Link>
        <Link to="/museum">
          <button className="role-btn">Museum</button>
        </Link>
        <Link to="/activity-categories">
          <button className="role-btn">Activity Categories</button>
        </Link>
        <Link to="/preference-tags">
          <button className="role-btn">Preference Tags</button>
        </Link>
        <Link to="/tourist-page">
          <button className="role-btn">Tourist</button>
        </Link>
        <Link to="/admin">
          <button className="role-btn">Admin</button>
        </Link>
        <Link to="/not-accepted">
          <button className="role-btn">Not Accepted</button>
        </Link>
        <Link to="/advertiser-profile">
          <button className="role-btn">Advertiser Profile</button>
        </Link>
        <Link to="/seller-page">
          <button className="role-btn">Seller Page</button>
        </Link>
        <Link to="/sales-page">
          <button className="role-btn">Sales Report</button>
        </Link>
        <Link to="/admin-delete">
          <button className="role-btn">Admin Delete</button>
        </Link>
        <Link to="/admin-create">
          <button className="role-btn">Admin Create Account</button>
        </Link>
        <Link to="/tourist-profile">
          <button className="role-btn">Tourist Profile</button>
        </Link>
        <Link to="/guest">
          <button className="role-btn">Guest Sales</button> {/* Link to GuestPage */}
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
        <Route path="/activity-categories" element={<ActivityCategoryPage />} />
        <Route path="/admin-delete" element={<AdminDelete />} />
        <Route path="/preference-tags" element={<PreferenceTagsPage />} />
        <Route path="/admin-create" element={<AdminCreateAccount />} />
        <Route path="/sales-page" element={<SalesReport />} /> 
        <Route path="/guest" element={<GuestPage />} /> {/* Route for GuestPage */}
      </Routes>
    </Router>
  );
}

export default App;
