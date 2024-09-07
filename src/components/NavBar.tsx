import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isMobileWidth } from "utils/media";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { type MenuProps } from "antd";
import DropDown from "./DropDown";
import { userItems, hostItems, userNameLink, hostNameLink } from "utils/menu";
import { Context } from "Router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LinearProgress } from "@mui/material";

export const signOutApi = async () => {
  localStorage.removeItem("token");
  toast.success("Successfully signed out");
};

type defaultProps = {
  isSearchPage: boolean;
};

const NavBar: React.FC<defaultProps> = ({ isSearchPage }) => {
  const { getters, setters } = useContext(Context);

  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState("");
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const userMenus: MenuProps["items"] = [];
  for (let i = 0; i < userItems.length; i++) {
    userMenus.push({
      label: (
        <p
          className="text-h5 md:text-h5-md"
          onClick={() => navigate(`/profile/${userNameLink[userItems[i]]}`)}
        >
          {userItems[i]}
        </p>
      ),
      key: `${i}`,
    });
  }
  userMenus.push({ type: "divider" });
  userMenus.push({
    label: (
      <p
        className="text-h5 md:text-h5-md text-red-600"
        onClick={() => {
          signOutApi();
          navigate("/");
          setters.setIsLoggedIn(false);
        }}
      >
        Sign Out
      </p>
    ),
    key: `${userMenus.length - 1}`,
  });
  const hostMenus: MenuProps["items"] = [];
  for (let i = 0; i < hostItems.length; i++) {
    hostMenus.push({
      label: (
        <p
          className="text-h5 md:text-h5-md"
          onClick={() => navigate(`/profile/${hostNameLink[hostItems[i]]}`)}
        >
          {hostItems[i]}
        </p>
      ),
      key: `${i}`,
    });
  }
  hostMenus.push({ type: "divider" });
  hostMenus.push({
    label: (
      <p
        className="text-h5 md:text-h5-md text-red-600"
        onClick={() => {
          signOutApi();
          navigate("/");
          setters.setIsLoggedIn(false);
        }}
      >
        Sign Out
      </p>
    ),
    key: `${hostMenus.length - 1}`,
  });

  const { pathname } = useLocation();
  const [hideExtraNav, setHideExtraNav] = useState(false);
  useEffect(() => {
    if (pathname.includes("sign-up") || pathname.includes("sign-in")) {
      setHideExtraNav(true);
    } else {
      setHideExtraNav(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileWidth()) setDeviceType("mobile");
      else setDeviceType("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const signIn = (
    <p
      className="line-animation text-h4 md:text-h4-md flex hover:cursor-pointer"
      style={{ "--col": "#168AAD" } as React.CSSProperties}
      onClick={() => navigate("/sign-in")}
    >
      Sign In
    </p>
  );
  const signUp = (
    <p
      className="line-animation text-h4 md:text-h4-md flex hover:cursor-pointer"
      style={{ "--col": "#168AAD" } as React.CSSProperties}
      onClick={() => navigate("/sign-up")}
    >
      Sign Up
    </p>
  );
  const searchBar = (
    <input
      className="w-full h-[60%] bg-gray-200 appearance-none rounded outline-none p-1 px-5 text-h5 md:text-h5-md focus:border-solid focus:border-secondary-dark focus:border-[0.1px]"
      placeholder="Search events"
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && search !== '') {
          navigate(`/search/${search}`);
        }
      }}
    ></input>
  );
  const searchBarSlideIn = (
    <div className="flex row-auto w-full ml-10 slide-in">
      {searchBar}
      <CloseIcon
        fontSize="small"
        onClick={() => setOpenSearch(false)}
        className="ml-3 hover:cursor-pointer text-secondary-dark"
      />
    </div>
  );
  const searchExpandable = (
    <SearchIcon
      className="mr-4 hover:cursor-pointer text-secondary-dark"
      onClick={() => setOpenSearch(true)}
    />
  );
  const accountIcon = <AccountCircleIcon className="text-secondary-dark" />;
  if (loading) {
    return (
      <nav className="h-[64px] flex justify-center items-center w-full flex-row row-span-1 md:gap-[70px] gap-[20px] px-[5%] relative">
        <LinearProgress className="w-full" />
      </nav>
    );
  } else {
    return (
      <>
        <nav className="h-[64px] flex justify-center items-center w-full flex-row row-span-1 md:gap-[70px] gap-[20px] px-[5%] relative">
          {deviceType === "mobile" && (
            <>
              <div
                className="flex grow h-full items-center justify-start hover:cursor-pointer gap-1"
                onClick={() => navigate("/")}
              >
                <img
                  className="w-5 h-5"
                  src={require("../assets/icon.png")}
                ></img>
                <p
                  className="text-title md:text-title-md flex hover:cursor-pointer text-primary-dark"
                  onClick={() => navigate("/")}
                >
                  EventStar
                </p>
              </div>
              {!hideExtraNav && (
                <>
                  {!openSearch ? (
                    <>
                      {getters.isLoggedIn ? (
                        <>
                          <div className="flex row-auto gap-3 cursor-pointer justify-center items-center">
                            <DropDown
                              items={getters.isHost ? hostMenus : userMenus}
                              content={
                                <>
                                  {getters.isLoggedIn && getters.isHost ? (
                                    <>
                                      <div
                                        onClick={() =>
                                          navigate("/host-dashboard")
                                        }
                                        className="hover:scale-105 transition flex flex-row justify-center px-5 text-secondary-dark bg-white border-secondary-dark rounded border-[1px] hover:cursor-pointer"
                                      >
                                        <p className="text-h4 md:text-h4-md">
                                          Host Dashboard
                                        </p>
                                      </div>
                                      {accountIcon}
                                    </>
                                  ) : (
                                    <>
                                      {accountIcon}
                                      {searchExpandable}
                                    </>
                                  )}
                                </>
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {signIn}
                          {signUp}
                          {searchExpandable}
                        </>
                      )}
                    </>
                  ) : (
                    searchBarSlideIn
                  )}
                </>
              )}
            </>
          )}
          {deviceType === "desktop" && !isSearchPage && (
            <>
              {getters.isLoggedIn && getters.isHost &&
                <div
                  onClick={() => navigate("/host-dashboard")}
                  className="z-10 fixed top-0 transition flex flex-row justify-center px-10 py-1 bg-white border-secondary rounded-b border-[1px] hover:cursor-pointer"
                >
                  <p className="text-h4 md:text-h4-md text-secondary-dark">
                    Access Host Dashboard
                  </p>
                </div>
              }
              <span
                className="flex flex-row items-center gap-1 hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img
                  className="w-8 h-8"
                  src={require("../assets/icon.png")}
                ></img>
                <p className="text-title md:text-title-md flex text-primary-dark">
                  EventStar
                </p>
              </span>
              {!hideExtraNav && (
                <>
                  <div className="flex grow h-full items-center justify-center">
                    {getters.isLoggedIn && getters.isHost ? (
                      <>
                      </>
                    ) : (
                      <>
                        <SearchIcon className="mr-4 text-secondary-dark" />
                        {searchBar}
                      </>
                    )}
                  </div>
                  {getters.isLoggedIn ? (
                    <>
                      <div className="flex row-auto gap-3 cursor-pointer justify-center items-center">
                        <DropDown
                          items={getters.isHost ? hostMenus : userMenus}
                          content={
                            <>
                              {accountIcon}
                              <p className="text-h4 md:text-h4-md">
                                Hello {getters.name}
                              </p>
                            </>
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {signIn}
                      {signUp}
                    </>
                  )}
                </>
              )}
            </>
          )}
          {deviceType === "desktop" && isSearchPage && (
            <>
              <div className="flex flex-row justify-between items-center w-full">
                <span
                  className="flex flex-row items-center gap-1 hover:cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <img
                    className="w-8 h-8"
                    src={require("../assets/icon.png")}
                  ></img>
                  <p className="text-title md:text-title-md flex text-primary-dark">
                    EventStar
                  </p>
                </span>
                {!hideExtraNav && (
                  <>
                    {getters.isLoggedIn ? (
                      <>
                        <div className="flex row-auto gap-3 cursor-pointer justify-center items-center">
                          <DropDown
                            items={getters.isHost ? hostMenus : userMenus}
                            content={
                              <>
                                {accountIcon}
                                <p className="text-h4 md:text-h4-md">
                                  My Account
                                </p>
                              </>
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex row-auto gap-3 cursor-pointer justify-center items-center">
                        {signIn}
                        {signUp}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </nav>
      </>
    );
  }
};

export default NavBar;
