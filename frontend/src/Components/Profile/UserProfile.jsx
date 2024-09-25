import React from 'react';
import Style from './Style.module.css';
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const UserProfiles = ({ UserData, UserAddress }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={Style.Right_Container}>
      <div className={Style.header}>
        <div className={Style.headerDiv}>
          <h2>{t('user_profiles.personal_information')}</h2>
        </div>
        <div className={Style.headerBtnDiv}>
          <button onClick={() => navigate(`/update-profile`)}>
            <span className={Style.icon}><FaEdit /></span> {t('user_profiles.edit')}
          </button>
        </div>
      </div>

      <div className={Style.details}>
        <h1 className={Style.itemTitle}>{UserData?.fullname} {UserData?.surname}</h1>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.pseudonym')}</span>
          <span className={Style.itemValue}>{UserData?.pseudoName}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.date_of_birth')}</span>
          <span className={Style.itemValue}>{UserData?.dob}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.house_name')}</span>
          <span className={Style.itemValue}>{UserAddress?.houseName}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.street_name')}</span>
          <span className={Style.itemValue}>{UserAddress?.streetName}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.locality')}</span>
          <span className={Style.itemValue}>{UserAddress?.locality}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.district')}</span>
          <span className={Style.itemValue}>{UserAddress?.district}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.state')}</span>
          <span className={Style.itemValue}>{UserAddress?.state}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.region')}</span>
          <span className={Style.itemValue}>{UserAddress?.region}</span>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.email')}</span>
          <div className={Style.itemValue}>
            <span>{UserData?.email}</span>
            {UserData.emailVerified && (
              <span className={` ${Style.verifyIcon}`}><MdVerified /></span>
            )}
          </div>
        </div>

        <div className={Style.detailItem}>
          <span className={Style.itemKey}>{t('user_profiles.phone')}</span>
          <div className={Style.itemValue}>
            <span>{UserData?.phoneNumber}</span>
            {UserData.phoneVerified && (
              <span className={` ${Style.verifyIcon}`}><MdVerified /></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfiles;
