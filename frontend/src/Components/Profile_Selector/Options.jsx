import React, { useContext } from 'react';
import Style from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../Contexts/UserContext';
import { useTranslation } from 'react-i18next';

const Options = ({ data, Image, WishlistCount }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const loggedInUser = useContext(UserContext);
  const { User, SetUser } = loggedInUser;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('logged');
    localStorage.removeItem('token');
    SetUser("");

    // Redirect to the login page
    navigate('/');
    if (window.location.pathname === '/') {
      window.location.reload();
    }
  };

  return (
    <div enter="bounceIn" className={Style.option_wrapper}>
      <div className={Style.box}>
        <div className={Style.boxWrapper}>
          <div className={Style.User_wrapper}>
            <div className={Style.profile}>
              <img
                src={Image ? Image : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                alt="nav profile picture"
              />
            </div>
            <div>
              <h6>{t("welcomeBack")}</h6>
              <h4>{data?.fullname}</h4>
            </div>
          </div>

          <Link to='/myads' className={Style.navigation}>
            <div className={Style.eachopt}>
              <h4>{t("myAds")}</h4>
            </div>
          </Link>

          <Link to='/add_advertisement' className={Style.navigation}>
            <div className={Style.eachopt}>
              <h4>{t("addAdvertisement")}</h4>
            </div>
          </Link>

          <Link to='/subscribe' className={Style.navigation}>
            <div className={Style.eachopt}>
              <h4>{t("subscriptionPlans")}</h4>
            </div>
          </Link>

          <Link to='/wishlist' className={Style.navigation}>
            <div className={Style.eachopt}>
              <h4>{t("myWishlist")}</h4>
              {WishlistCount > 0 && (
                <span className={Style.count}>{WishlistCount}</span>
              )}
            </div>
          </Link>

          <Link to='/profile' className={Style.navigation}>
            <div className={Style.eachopt}>
              <h4>{t("myAccount")}</h4>
            </div>
          </Link>
          <Link to='/refferals' className={Style.navigation}>
            <div className={Style.eachopt}>
              <h4>{t("RefferaFriend")}</h4>
            </div>
          </Link>

          <div className={Style.logout} onClick={handleLogout}>
            <h4>{t("logout")}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
