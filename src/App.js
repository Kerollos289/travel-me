import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import TouristRegister from "./touristRegister";
import TravelJobsRegister from "./travelJobsRegister";
import Login from "./login";
import AdvertiserPage from "./AdvertiserPage";
import TourGuidePage from "./TourGuidePage";
import TourismGovernorPage from "./TourismGovernorPage";
import ChangePassword from "./ChangePassword";
import ItineraryPage from "./ItineraryPage";
import ActivityPage from "./activityCategoryPage";
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
import TouristPage from "./touristPage";
import TouristProfile from "./touristProfile";
import TouristBookItineraries from "./touristBookItineraries";
import TouristBookActivities from "./touristBookActivities";
import TouristBookMuseums from "./touristBookMuseums";
import GuestPage from "./GuestPage";
import AdvertiserMainPage from "./AdvertiserMainPage";
import TourGuideMainPage from "./TourGuideMainPage";
import AdminMainPage from "./AdminMainPage";
import AdminDeleteRequest from "./adminDeleteRequest";
import ForgetPassword from "./forgetPassword";
import SellerMainPage from "./SellerMainPage";
import MyBookings from "./MyBookings";
import AvailableBookings from "./AvailableBookings";
import Activities2 from "./Activities2";
import Itineraries2 from "./Itineraries2";
import Museums2 from "./Museums2";
import AdvertiserReport from "./advertiserReport";
import TourGuideReport from "./tourGuideReport";
import AdminItineraries from "./adminItineraries";
import AdminCount from "./adminCount";
import TouristBookFlights from "./touristBookFlights";
import TouristPreference from "./touristPreferences";
import TouristBookMarkedActivities from "./touristBookmarkedActivities";
import RateTourGuide from "./rateTourGuide";
import vid from "../src/vids/demo.mp4";
import FlightMain from "./flightMain";
import HotelMain from "./hotelMain";
import HotelOffers from "./HotelSearchOffers";
import TouristBookedHotels from "./touristBookedHotels";
import TouristBookedFlights from "./touristBookedFlights";
import TouristFileComplaint from "./touristFileComplaint";
import AdminViewAllComplaints from "./AdminViewAllComplaints";
import TouristViewComplaints from "./touristViewComplaints";
import CreateProduct from "./createProduct";
import TouristViewProducts from "./touristViewProducts";
import TouristViewWishlist from "./touristViewWishlist";
import TouristCart from "./touristCart";
import AdminSellerViewProducts from "./AdminSellerViewProducts";
import PromoCodesPage from "./PromoCodesPage";
import RequestPromoCode from "./RequestPromoCode";
import ApplyPromoCode from "./ApplyPromoCode";
import "./activityCategoryPage.css";

import AdminActivities from "./adminActivities";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to TravelMe</h1>
      {/* Video Section */}
      <div className="video-container">
        <h2>Watch our Introduction Video</h2>
        <video src={vid} controls />
      </div>
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
        <Link to="/activities2">
          <button className="register-btn">Available Activities</button>
        </Link>
        <Link to="/itineraries2">
          <button className="register-btn">Available Itineraries</button>
        </Link>
        <Link to="/museums2">
          <button className="register-btn">
            Available Museums and Historical Places
          </button>
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
        <Route path="/seller-page" element={<SellerPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/not-accepted" element={<NotAccepted />} />
        <Route path="/advertiser-profile" element={<AdvertiserProfile />} />
        <Route path="/tourist-page" element={<TouristPage />} />
        <Route path="/tourist-profile" element={<TouristProfile />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/museum" element={<MuseumPage />} />
        <Route path="/admin-delete" element={<AdminDelete />} />
        <Route path="/admin-create" element={<AdminCreateAccount />} />
        <Route path="/admin-main" element={<AdminMainPage />} />
        <Route path="/advertiser-main" element={<AdvertiserMainPage />} />
        <Route path="/activity-categories" element={<ActivityCategoryPage />} />
        <Route path="/preference-tags" element={<PreferenceTagsPage />} />
        <Route path="/sales-page" element={<SalesReport />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/admin-delete-request" element={<AdminDeleteRequest />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/tourist-book-itineraries"
          element={<TouristBookItineraries />}
        />
        <Route
          path="/tourist-book-activities"
          element={<TouristBookActivities />}
        />
        <Route path="/tourist-book-museums" element={<TouristBookMuseums />} />
        <Route path="/seller-main" element={<SellerMainPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />{" "}
        {/* Route for MyBookings */}
        <Route
          path="/available-bookings"
          element={<AvailableBookings />}
        />{" "}
        {/* Route for AvailableBookings */}
        <Route path="/activities2" element={<Activities2 />} />{" "}
        {/* Route for Activities2 */}
        <Route path="/itineraries2" element={<Itineraries2 />} />{" "}
        {/* Route for Itineraries2 */}
        <Route path="/museums2" element={<Museums2 />} />{" "}
        {/* Route for Museums2 */}
        <Route path="/advertiser-report" element={<AdvertiserReport />} />
        <Route path="/tour-guide-report" element={<TourGuideReport />} />
        <Route path="/admin-itineraries" element={<AdminItineraries />} />
        <Route path="/admin-activities" element={<AdminActivities />} />
        <Route path="/admin-count" element={<AdminCount />} />
        <Route path="/tourist-book-flights" element={<TouristBookFlights />} />
        <Route path="/tourist-preferences" element={<TouristPreference />} />
        <Route
          path="/tourist-bookmarked-activities"
          element={<TouristBookMarkedActivities />}
        />
        <Route path="/promo-codes" element={<PromoCodesPage />} />
        <Route path="/reqpromo" element={<RequestPromoCode />} />
        <Route path="/applypromo" element={<ApplyPromoCode />} />
        <Route path="/rate-tour-guide" element={<RateTourGuide />} />
        <Route path="/flight-main" element={<FlightMain />} />
        <Route path="/hotel-main" element={<HotelMain />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route
          path="/HotelOffers/:hotelId/:username"
          element={<HotelOffers />}
        />
        <Route
          path="/tourist-booked-hotels"
          element={<TouristBookedHotels />}
        />
        <Route
          path="/tourist-booked-flights"
          element={<TouristBookedFlights />}
        />
        <Route
          path="/tourist-file-complaint"
          element={<TouristFileComplaint />}
        />
        <Route
          path="/admin-view-complaint"
          element={<AdminViewAllComplaints />}
        />
        <Route
          path="/tourist-view-complaint"
          element={<TouristViewComplaints />}
        />
        <Route
          path="/tourist-view-products"
          element={<TouristViewProducts />}
        />
        <Route
          path="/admin-seller-view-products"
          element={<AdminSellerViewProducts />}
        />
        <Route
          path="/tourist-view-wishlist"
          element={<TouristViewWishlist />}
        />
        <Route path="/tourist-cart" element={<TouristCart />} />
      </Routes>
    </Router>
  );
}

export default App;
