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
import ItineraryPage from "./ItineraryPage"; // Add ItineraryPage
import MuseumPage from "./MuseumPage"; // Add MuseumPage
import ActivityCategoryPage from "./activityCategoryPage";
import PreferenceTagsPage from './preferenceTagsPage'; 
//import SalesReport from "./SalesPage"; // Import SalesPage component
import NotAccepted from "./notAccepted";
import Admin from "./admin";
import AdvertiserProfile from "./AdvertiserProfile";
import SellerPage from "./sellerPage";
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
        {/* <Link to="/sales-page">
          <button className="role-btn">Sales Report</button>
        </Link> */}
        <Link to="/tourist-page">
          <button className="role-btn">tourist</button>
        </Link>
        <Link to="/admin">
          <button className="role-btn">admin</button>
        </Link>
        <Link to="/not-accepted">
          <button className="role-btn">not accepted</button>
        </Link>
        <Link to="/advertiser-profile">
          <button className="role-btn">not accepted</button>
        </Link>
        <Link to="/seller-page">
          <button className="role-btn">not accepted</button>
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
        <Route path="/itinerary" element={<ItineraryPage />} />{" "}
        {/* ItineraryPage route */}
        <Route path="/museum" element={<MuseumPage />} />{" "}
        {/* MuseumPage route */}
        <Route path="/activity-categories" element={<ActivityCategoryPage />} />
        <Route path="/preference-tags" element={<PreferenceTagsPage />} />
        {/* <Route path="/sales-page" element={<SalesReport />} /> Add SalesPage route */}
      </Routes>
    </Router>
  );
}

export default App;
