import React, { useContext } from 'react';
import Style from './Style.module.css';
import { Blank_Profile } from '../../Assets/Constants';
import { UserContext } from '../../Contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SideProfile = ({ UserData, UserImage, CustomNav, CustomNavLink }) => {
  const { t } = useTranslation();
  const LoggedInUser = useContext(UserContext);
  const { User, SetUser } = LoggedInUser;
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('logged');
    localStorage.removeItem('token');
    SetUser("");
    navigate('/');
  };

  return (
    <div className={Style.Left_Container}>
      <div className={Style.profile_section}>
        <img
          src={UserImage ? UserImage : Blank_Profile}
          alt="profilepicture"
        />
        <div className={Style.items}>
          <h3>{UserData?.fullname} {UserData?.surname}</h3>
          <h4>{UserData?.email}</h4>
          <h4>{UserData?.phoneNumber}</h4>
        </div>
      </div>

      <div className={Style.info_section}>
        <h3>{t('side_profile.account_setting')}</h3>
        <ul>
          {CustomNav && (
            <Link className={Style.navigation} to={CustomNavLink}>
              <li>{CustomNav}</li>
            </Link>
          )}
          <Link className={Style.navigation} to='/wishlist'>
            <li>{t('side_profile.wishlist')}</li>
          </Link>
          <Link className={Style.navigation} to='/myads'>
            <li>{t('side_profile.my_ads')}</li>
          </Link>
          <Link className={Style.navigation} to='/chat'>
            <li>{t('side_profile.chat')}</li>
          </Link>
          <Link className={Style.navigation} to='/profile/privacy-settings'>
            <li className={`${window.location.pathname === '/profile/privacy-settings' ? Style.active : null}`}>
              {t('side_profile.privacy_settings')}
            </li>
          </Link>
          <Link className={`${Style.navigation} ${Style.edit_profile}`} to='/update-profile'>
            <li>{t('side_profile.edit_profile')}</li>
          </Link>
        </ul>
      </div>

      <div className={Style.log_section}>
        <ul>
          <li onClick={handleLogout}>{t('side_profile.logout')}</li>
        </ul>
      </div>
    </div>
  );
};

export default SideProfile;
