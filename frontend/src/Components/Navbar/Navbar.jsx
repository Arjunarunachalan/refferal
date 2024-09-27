import React, { useContext, useEffect, useState } from "react";
import Style from "./index.module.css";
import {
  BsBell,
  BsBellFill,
  BsCartPlus,
  BsChat,
  BsSearch,
} from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";
import "animate.css";
import { CategoryContext } from "../../Contexts/CategoryContext";
import Options from "../Profile_Selector/Options";
import { Link, useNavigate } from "react-router-dom";
import {
  MdAccountCircle,
  MdOutlineFavoriteBorder,
  MdPostAdd,
} from "react-icons/md";
import { BiPurchaseTag, BiLogOut } from "react-icons/bi";
import { UserContext } from "../../Contexts/UserContext";
import { SocketContext } from "../../Contexts/socketContext";
import instance from "../../instance/AxiosInstance";
import Selector from "../Search_Selector/Selector";
import authInstance from "../../instance/AuthInstance";
import Select from "react-select";
import { Blank_Profile } from "../../Assets/Constants";
import BoxOptions from "../Tooltip/BoxOptions";
import registerClicks from "../../utilities/getCategoryClicks";
import TopArrow from "../../Assets/Icons/TopArrow";
import DownArrow from "../../Assets/Icons/DownArrow";
import { ClassNames } from "@emotion/react";
import LanguageSelector from "../Language_selector/LanguageSelector";
import { useTranslation } from "react-i18next";

const Navbar = ({ location, setLocation, reload, togglefunc, toggleState }) => {
  const { t, i18n } = useTranslation();
  const LoggedInUser = useContext(UserContext);
  const { User, SetUser } = LoggedInUser; //LoggedInUser Id

  const navigate = useNavigate();

  const categories = useContext(CategoryContext);
  const socket = useContext(SocketContext);

  const { Categories, SetCategories } = categories;
  const [Toggle, setToggle] = useState(false);
  const [ToggleSelector, SetToggleSelector] = useState(false);
  const [ToggleOpt, setOpt] = useState(false);
  const [NewMessages, SetNewMessages] = useState(false);
  const [UserData, SetUserData] = useState({});
  const [UserImage, SetUserImage] = useState("");
  const [SearchQuery, SetSearchQuery] = useState("");
  const [SearchResult, SetSearchResult] = useState([]);

  const [WishlistCount, SetWishlistCount] = useState(0);
  const [NotificationCount, SetNotificationCount] = useState(0);
  const [ConversationCount, SetConversationCount] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const currenturl = window.location.pathname;
  // Set back to false after 5 seconds
  useEffect(() => {
    if (window.location.pathname === "/") {
      setIsHovered(true);
      const timer = setTimeout(() => {
        setIsHovered(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsHovered(false);
    }
  }, []);

  // -- Fetching data for search items
  const HandleSearch = () => {
    try {
      instance
        .get(
          `/api/user/filter/search_products?SearchQuery=${SearchQuery}&&limit=${5}`
        )
        .then((response) => {
          SetSearchResult(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    HandleSearch();
  }, [SearchQuery]);

  // -- Function for dropdown for search bar
  const HandleSelector = (e) => {
    e.preventDefault();

    if (e.target.value !== "") {
      SetToggleSelector(true);
    } else {
      SetToggleSelector(false);
    }
  };

  // -- Setting New Messages in Alert
  useEffect(() => {
    if (socket) {
      socket.on("notificationAlert", (data) => {
        SetNewMessages(data.Alert);
      });
    }
  }, [socket]);

  // -- Fetching profile data of the user
  useEffect(() => {
    try {
      instance
        .get(`/api/user/profile/get_profile/${User._id}`)
        .then((Response) => {
          SetUserData({ ...Response.data });
          SetUserImage(Response.data.profilePicture?.url);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, [User._id]);

  // -- Function to logout from site
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("logged");
    localStorage.removeItem("token");
    SetUser("");
    // Redirect to the login page
    navigate("/");
    if (window.location.pathname === "/") {
      window.location.reload();
    }
  };

  // -- Function to get Wishlist count
  useEffect(() => {
    try {
      authInstance
        .get(`/api/user/wishlist/get_wishlist/${User?._id}`)
        .then((response) => {
          SetWishlistCount(response.data[0]?.wishlist?.length);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, [User?._id]);

  // -- Function to get Notification count
  useEffect(() => {
    try {
      if (User?._id) {
        authInstance
          .get(`/api/user/notification/notification_count?userId=${User?._id}`)
          .then((response) => {
            SetNotificationCount(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [User?._id, reload]);

  // -- Function to get Chat Conversation count
  useEffect(() => {
    try {
      authInstance
        .get(`/api/user/chat/conversation_count?userId=${User?._id}`)
        .then((response) => {
          SetConversationCount(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, [User?._id, reload]);

  //  const sortedCategories = response.data.sort((a, b) => {
  //         const nameA = a.categoryName.toLowerCase();
  //         const nameB = b.categoryName.toLowerCase();
  //         if (nameA < nameB) return -1;
  //         if (nameA > nameB) return 1;
  //          if (nameA > nameB) return 1;
  //       });

  // -- Assigning react-select options
  const sortedCategories = Categories.sort((a, b) => {
    const getName = (category) => {
      if (typeof category.categoryName === "object") {
        return category.categoryName[i18n.language]?.toLowerCase() || "";
      } else if (typeof category.categoryName === "string") {
        return category.categoryName.toLowerCase();
      }
      return "";
    };
    return getName(a).localeCompare(getName(b));
  });

  const SelectOptions = sortedCategories
    .map((category) => {
      const label =
        typeof category.categoryName === "object"
          ? category.categoryName[i18n.language] || category.categoryName.en
          : category.categoryName;

      // Ensure label is a string
      if (typeof label !== "string") {
        console.error(
          `Invalid label type for category ${category._id}:`,
          label
        );
        return null; // Skip this option if label is invalid
      }

      return {
        value: category._id,
        label: label,
      };
    })
    .filter((option) => option !== null);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "140px",
      height: "90%",
      fontSize: "12px",
      borderRight: "1px solid #111",
      border: state.isFocused ? "none" : state.isSelected ? "none" : "none",
      borderRadius: "4px",
      boxShadow: state.isFocused ? "none" : null,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",

      "&:hover": {
        border: "none",
        boxShadow: "none", // Remove border on hover
      },
      "@media only screen and (max-width: 1199px)": {
        width: "100px", // Adjust width for smaller screens
        fontSize: "10px", // Adjust font size for smaller screens
      },
      "@media only screen and (max-width: 799px)": {
        width: "140px", // Adjust width for smaller screens
        fontSize: "12px", // Adjust font size for smaller screens
      },
      // Mobile styles
      "@media only screen and (max-width: 429px)": {
        width: "100px", // Adjust width for smaller screens
        fontSize: "10px", // Adjust font size for smaller screens
      },
    }),
    option: (provided, state) => ({
      ...provided,
      // borderBottom: '1px solid #ccc', // Example border for options
      backgroundColor: state.isSelected ? "#ccc" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
      fontSize: "12px",
      // Mobile styles
      "@media only screen and (max-width: 580px)": {
        fontSize: "10px", // Adjust font size for smaller screens
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      borderLeft: "none", // Remove border from the dropdown indicator
    }),
    indicatorSeparator: () => ({
      display: "none", // Hide the separator
    }),
  };

  // -- Handle search on pressing enter key
  const HandleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (SearchResult.length === 1) {
        navigate(`/product/${SearchResult[0]._id}`);
        SetToggleSelector(false);
      } else {
        navigate(`/search/${SearchQuery}`);
        SetToggleSelector(false);
      }
    }
  };

  //popular categories

  const onChangeFunc = (catID, userId) => {
    registerClicks(catID, userId);
    navigate(`/category/${catID}`);
  };

  return (
    <div className={Style.header_container}>
      <div className={Style.Container}>
        <div className={Style.Branding}>
          <div className={Style.Branding_wrapper}>
            <button
              onClick={() => {
                setToggle(true);
              }}
              className={`${Style.Toggle}`}
            >
              <GiHamburgerMenu />
            </button>

            <Link
              to="/"
              className={Style.navigation}
              onClick={() => {
                if (window.location.pathname === "/") {
                  window.location.reload();
                } else {
                  navigate("/");
                }
              }}
            >
              <h1>{t("dealNBuy")}</h1>
            </Link>
          </div>
          <div className={Style.mobiletrnslator}>
            <LanguageSelector />
          </div>

          <div
            className={Style.PostAdBtn_Div}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to="/postadd" className={Style.navigation}>
              <button>{t("postFreeAd")}</button>
              {isHovered && <BoxOptions />}
            </Link>
          </div>
        </div>

        <div className={Style.Search}>
          <div className={Style.Search_container}>
            <div className="dropdown_container">
              {currenturl === "/" ? (
                <div
                  className={Style.dropdown}
                  onClick={() => {
                    togglefunc(!toggleState);
                  }}
                >
                  <p>{t("allCategories")}</p>
                  <div className={Style.iconWrapper}>
                    {toggleState ? (
                      <TopArrow className={Style.Uparrow} />
                    ) : (
                      <DownArrow className={Style.DownArrow} />
                    )}
                  </div>
                </div>
              ) : (
                <Select
                  placeholder={t("allCategories")}
                  options={SelectOptions}
                  onChange={(e) => onChangeFunc(e.value, User._id)}
                  styles={customStyles}
                />
              )}
            </div>

            <div className={Style.dropdown_mobile}>
              {currenturl === "/" && (
                <Select
                  placeholder={t("allCategories")}
                  options={SelectOptions}
                  onChange={(e) => onChangeFunc(e.value, User._id)}
                  styles={customStyles}
                />
              )}
            </div>

            <input
              type="search"
              placeholder={t("searchHere")}
              value={SearchQuery}
              onChange={(e) => {
                SetSearchQuery(e.target.value);
                HandleSelector(e);
              }}
              onKeyPress={(e) => HandleKeyPress(e)}
            />

            <button onClick={HandleSearch}>
              <BsSearch />
            </button>
          </div>

          {ToggleSelector && (
            <Selector result={SearchResult} query={SearchQuery} />
          )}
        </div>

        <div className={Style.translator}>
          <LanguageSelector />
        </div>

        <div className={Style.Options}>
          <div className={Style.OptionsWrapper}>
            <Link to="/chat" className={Style.navigation}>
              <BsChat className={Style.icon} />
            </Link>
            {ConversationCount > 0 && (
              <span className={Style.count}>{ConversationCount}</span>
            )}
          </div>
          <div className={Style.OptionsWrapper}>
            <Link to="/notification" className={Style.navigation}>
              {NewMessages ? (
                <BsBellFill className={Style.icon} />
              ) : (
                <BsBell className={Style.icon} />
              )}
            </Link>
            {NotificationCount > 0 && (
              <span className={Style.count}>{NotificationCount}</span>
            )}
          </div>

          {User._id ? (
            <div
              className={Style.profile}
              onClick={() => {
                setOpt(!ToggleOpt);
              }}
            >
              <img
                src={UserImage ? UserImage : Blank_Profile}
                alt="profile picture"
              />
              {ToggleOpt && (
                <Options
                  data={UserData}
                  Image={UserImage}
                  WishlistCount={WishlistCount}
                />
              )}
            </div>
          ) : (
            <div className={Style.RegButtonContainer}>
              <Link to="/registration_login" className={Style.navigation}>
                <button>{t("login")}</button>
              </Link>
            </div>
          )}

          <div
            className={Style.ButtonContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to="/postadd" className={Style.navigation}>
              <button>{t("postFreeAd")}</button>
            </Link>
            {isHovered && <BoxOptions />}
          </div>
        </div>
        {Toggle && (
          <div
            className={`${Style.Mobile_screen} ${
              Toggle ? Style.in : Style.out
            }`}
          >
            <div className={Style.logoContainer}>
              <div className={Style.logo_wrap}>
                <Link
                  to="/"
                  className={Style.navigation}
                  onClick={() => {
                    if (window.location.pathname === "/") {
                      window.location.reload();
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  <h1>{t("dealNBuy")}</h1>
                </Link>
              </div>

              <div>
                <button>
                  <IoCloseOutline onClick={() => setToggle(false)} />
                </button>
              </div>
            </div>

            <div className={Style.ProfileContainer}>
              {User._id ? (
                <div className={Style.profile_wrap}>
                  <div className={Style.profile}>
                    <img
                      src={UserImage ? UserImage : Blank_Profile}
                      alt="nav profile picture"
                    />
                  </div>
                  <div>
                    <h4>
                      {UserData?.fullname} {UserData?.surname}
                    </h4>
                    <Link to="/profile" className={Style.navigation}>
                      <h5>{t("viewAndEditProfile")}</h5>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className={Style.profile_wrap}>
                  <Link to="/registration_login" className={Style.navigation}>
                    <button>{t("login")}</button>
                  </Link>
                </div>
              )}
            </div>

            <div className={Style.menuContainer}>
              <div className={Style.menutitle}>
                <h4>{t("menu")}</h4>
              </div>

              <div className={Style.menu_wrap}>
                <ul>
                  

                  <Link to="/profile" className={Style.navigation}>
                    <li className={Style.list_items}>
                      <MdAccountCircle className={Style.icons} />
                      <span>{t("myAccount")}</span>
                    </li>
                  </Link>

                  <Link to="/postadd" className={Style.navigation}>
                    <li className={Style.list_items}>
                      <MdPostAdd className={Style.icons} />
                      <span>{t("postAd")}</span>
                    </li>
                  </Link>

                  <Link to="/myads" className={Style.navigation}>
                    <li className={Style.list_items}>
                      <BsCartPlus className={Style.icons} />
                      <span>{t("myAds")}</span>
                    </li>
                  </Link>

                  <Link to="/subscribe" className={Style.navigation}>
                    <li className={Style.list_items}>
                      <BiPurchaseTag className={Style.icons} />
                      <span>{t("purchaseAds")}</span>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>

            <div className={Style.menuContainer}>
              <div className={Style.menu_wrap}>
                <ul>
                  <Link to="/chat" className={Style.navigation}>
                    <li>
                      <div className={Style.Options}>
                        <div className={Style.OptionsWrapper}>
                          <BsChat className={Style.icons} />
                          <span>{t("chats")}</span>
                        </div>
                        {ConversationCount > 0 && (
                          <div className={Style.counter}>
                            {ConversationCount}
                          </div>
                        )}
                      </div>
                    </li>
                  </Link>

                  <Link to="/notification" className={Style.navigation}>
                    <li>
                      <div className={Style.Options}>
                        <div className={Style.OptionsWrapper}>
                          <BsBell className={Style.icons} />
                          <span>{t("alerts")}</span>
                        </div>
                        {NotificationCount > 0 && (
                          <div className={Style.counter}>
                            {NotificationCount}
                          </div>
                        )}
                      </div>
                    </li>
                  </Link>

                  <Link to="/wishlist" className={Style.navigation}>
                    <li>
                      <div className={Style.Options}>
                        <div className={Style.OptionsWrapper}>
                          <MdOutlineFavoriteBorder className={Style.icons} />
                          <span>{t("wishlist")}</span>
                        </div>
                        {WishlistCount > 0 && (
                          <div className={Style.counter}>{WishlistCount}</div>
                        )}
                      </div>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>

            <div
              className={Style.menuContainer}
              style={{ borderBottom: "none" }}
            >
              <div className={Style.menu_wrap}>
                <ul>
                  {User._id ? (
                    <li
                      className={Style.list_items}
                      onClick={(e) => {
                        handleLogout(e);
                      }}
                    >
                      <BiLogOut className={Style.icons} />
                      <span onClick={()=>{localStorage.removeItem('isighnin')}}>{t("logout")}</span>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;