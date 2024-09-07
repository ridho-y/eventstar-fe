import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "pages/auth/LoginPage";
import RegisterPage from "pages/auth/RegisterPage";
import Page404 from "system/Page404";
import ProfilePage from "pages/profile/ProfilePage";
import ResetRequestPage from "pages/auth/reset/ResetRequestPage";
import ResetCompletePage from "pages/auth/reset/ResetCompletePage";
import ResetEditPage from "pages/auth/reset/ResetEditPage";
import NavBar from "components/NavBar";
import ToastError from "ToastError";
import EventListing from "pages/event/eventListing/EventListing";
import EventCreateEdit from "pages/event/createEdit/EventCreateEdit";
import HomePage from "pages/home/HomePage";
import HostDashboard from "pages/host/HostDashboard";
import HostPublicProfile from "pages/host/HostPublicProfile";
import Booking from "pages/booking/Booking";
import LoadingPage from "system/LoadingPage";
import { toast } from "react-toastify";
import apiRequest, { cancelAllRequests } from "utils/api";
import EventChat from "pages/eventChat/EventChat";
import EventAnalytics from "pages/event/eventAnalytics/EventAnalytics";
import EventSurvey from "pages/event/eventSurvey/EventSurvey";
import SearchPage from "pages/search/SearchPage";
import SubmitSurvey from "pages/event/eventSurvey/SubmitSurvey";

export const Context = createContext(null);

const Router: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [memberId, setMemberId] = useState(13);
  const [token, setToken] = useState(null);
  const [name, setName] = useState('');
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [trendingTitle, setTrendingTitle] = useState("Top");
  const [trendingTag, setTrendingTag] = useState("top");
  const [homeCoord, setHomeCoord] = useState<string>("");

  const getters = {
    isLoggedIn,
    isHost,
    token,
    isSearchPage,
    memberId,
    name,
    trendingTitle,
    trendingTag,
    homeCoord,
  };
  const setters = {
    setIsLoggedIn,
    setIsHost,
    setToken,
    setIsSearchPage,
    setMemberId,
    setName,
    setTrendingTitle,
    setTrendingTag,
    setHomeCoord,
  };
  const [loading, setLoading] = useState(true);

  // BUG FIX: ResizeObserver loop limit exceeded on Chrome and Script error for Safari!
  // Issue lies within event summary and description on create event don't know why
  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (
        e.message === "ResizeObserver loop limit exceeded" ||
        e.message === "Script error." ||
        e.message === "ResizeObserver loop completed with undelivered notifications."
      ) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    });
  }, []);

  useEffect(() => {
    const getMemberIdIsHost = async () => {
      cancelAllRequests();
      setLoading(true);
      const res = await apiRequest('GET', '/profile');
      if (res.ok) {
        setters.setIsLoggedIn(true);
        setters.setMemberId(res.memberId);
        setters.setIsHost(res.isHost);
        setters.setName(res.firstName);
      } else if (res.status === 401) {
        setters.setIsLoggedIn(false);
        setters.setMemberId(null);
        setters.setIsHost(null);
        setters.setName("");
        localStorage.removeItem("token");
        setters.setToken('');
        toast.error('Session expired');
      }
      setLoading(false);
    };
    if (localStorage.getItem("token") !== null) {
      setters.setToken(localStorage.getItem('token'));
      getMemberIdIsHost();
    }
    setLoading(false)
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen justify-center items-center">
        <LoadingPage />
      </div>
    );
  } else {
    return (
      <BrowserRouter>
        <Context.Provider value={{ getters, setters }}>
          <div className="flex justify-center flex-col">
            {/* ... */}
            <ToastError />
            <NavBar isSearchPage={false}  />
            <div className="content w-full relative h-full">
              <Routes>
                {/* Authentication Routes */}
                <Route path="/sign-in" element={<LoginPage />} />
                <Route path="/sign-up" element={<RegisterPage />} />

                {/* Reset Password Routes */}
                <Route
                  path="/reset/password/request"
                  element={<ResetRequestPage />}
                />
                <Route
                  path="/reset/password/complete/:email"
                  element={<ResetCompletePage />}
                />
                <Route
                  path='/reset/password/edit/:email'
                  element={<ResetEditPage />}
                />

                {/* Profile Routes */}
                <Route
                  path="/profile/information"
                  element={<ProfilePage location={"information"} />}
                />
                <Route
                  path="/profile/bookings"
                  element={<ProfilePage location={"bookings"} />}
                />
                <Route
                  path="/profile/billing"
                  element={<ProfilePage location={"billing"} />}
                />
                <Route
                  path="/profile/billing/new"
                  element={<ProfilePage location={"billing"} />}
                />
                <Route
                  path="/profile/payment"
                  element={<ProfilePage location={"billing"} />}
                />
                <Route
                  path="/profile/payment/new"
                  element={<ProfilePage location={"billing"} />}
                />
                <Route
                  path="/profile/following"
                  element={<ProfilePage location={"following"} />}
                />
                <Route
                  path="/profile/favourites"
                  element={<ProfilePage location={"favourites"} />}
                />
                <Route
                  path="/profile/security"
                  element={<ProfilePage location={"security"} />}
                />
                <Route
                  path="/profile/account-settings"
                  element={<ProfilePage location={"account-settings"} />}
                />
                <Route
                  path="/profile/host-profile"
                  element={<ProfilePage location={"host-profile"} />}
                />

                {/* Host Routes */}
                <Route path="/host-dashboard" element={<HostDashboard location={""} />} />
                <Route path="/host-dashboard/analytics" element={<HostDashboard location={"analytics"} />} />
                <Route path="/host-dashboard/events" element={<HostDashboard location={"events"} />} />
                <Route path="/host-dashboard/referrals" element={<HostDashboard location={"referrals"} />} />
                <Route path="/host-dashboard/referrals/create" element={<HostDashboard location={"referrals"} />} />
                <Route path="/host-dashboard/payment" element={<HostDashboard location={"billing"} />} />
                <Route path="/host/:hostId" element={<HostPublicProfile />} />

                {/* Search Route */}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/search/:searchQuery" element={<SearchPage />} />

                {/* Home Route */}
                <Route path="/" element={<HomePage />} />

                {/* Event Routes */}
                <Route
                  path="/event/:eventListingId"
                  element={<EventListing />}
                />
                <Route path="/event/create" element={<EventCreateEdit />} />
                <Route
                  path="/event/edit/:eventListingId"
                  element={<EventCreateEdit />}
                />
                <Route
                  path="/event/analytics/:eventListingId"
                  element={<EventAnalytics />}
                />
                <Route
                  path ="/event/survey/create/:eventListingId"
                  element={<EventSurvey />}
                />
                <Route
                  path ="/survey/:eventListingId"
                  element={<SubmitSurvey />}
                />

                {/* Booking Route */}
                <Route
                  path="/event/book/:eventListingId"
                  element={<Booking />}
                />

                {/* Booking Route */}
                <Route
                  path="/event/book/:eventListingId"
                  element={<Booking />}
                />

                {/* Event Chat Route */}
                <Route
                  path="/event/chat"
                  element={<EventChat />}
                />
                <Route
                  path="/event/chat/:eventListingId"
                  element={<EventChat />}
                />

                {/* 404 Route */}
                <Route path="*" element={<Page404 />} />
              </Routes>
            </div>
          </div>
        </Context.Provider>
      </BrowserRouter>
    );
  }
};

export default Router;
