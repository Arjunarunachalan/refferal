import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Style from "./index.module.css";
import { FaTimes } from "react-icons/fa";
import reffrealImage from "../../../Assets/Images/refferal.png";

const ReferralModal = ({ handleRefer, setIsModalOpen }) => {
  const handleCloseModal = () => {
    localStorage.removeItem("isighnin"); // Remove the item from localStorage
    setIsModalOpen(false); // Close the modal
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  return (
    <div className={Style.modalOverlay}>
      <div className={Style.modalContainer}>
        <div className={Style.modalContent}>
        <div className={Style.closeIconWrapper}>
          <button
            className={Style.closeButton}
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
          <div>
            <img src={reffrealImage} alt="reff" className={Style.refferimage} />
          </div>
          <div className={Style.modalContent}>
            <p>
              Welcome to Dealnbuy ! .If you were referred by a friend, make sure
              to enter their referral code. Once you post 5 products, your
              friend will earn ₹50 as a thank-you for introducing you to our
              community. Start exploring and happy selling!
            </p>
            <Link to="/refferals">
              <button className={Style.referralButton} onClick={handleRefer}>
                Add Referral Code
              </button>
            </Link>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default ReferralModal;
