import React, { useContext, useState } from "react";
import Style from "./index.module.css";
import { UserContext } from "../../Contexts/UserContext";
import authInstance from "../../instance/AuthInstance";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRefferal = () => {
  const LoggedInUser = useContext(UserContext);
  const { User, SetUser } = LoggedInUser;
  console.log(User, "usr");

  const [referralCode, setReferralCode] = useState("");

  const handleChange = (e) => {
    setReferralCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sendPostRequest = async () => {
      const payload = {
        userId: User?._id || "defaultUserId",
        referCode: referralCode,
      };

      try {
        const response = await authInstance.post(
          "/api/user/Reffer/create_referals",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        SetUser((prevsts) => ({
          ...prevsts,
          ReferStatus: true,
        }));

        toast.success("Refferal Code Succesfully Added!");

        console.log("Referral successfully added:", response.data);
      } catch (error) {
        console.log("Error adding referral:", error);
        toast.error("Something Went to Wrong.");
      }
    };

    sendPostRequest();
  };

  return (
    <div className={Style.container}>
      <div className={Style.formContainer}>
        {User.ReferStatus ? (
          <div className={Style.successMessage}>
            {/* Display a message when referral status is true */}
            <h3>Referral Code has been successfully added!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={Style.inputGroup}>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={referralCode}
                onChange={handleChange}
                className={Style.input}
                placeholder="Enter the Referral Code"
              />
              <button type="submit" className={Style.submitButton}>
                Add Referral
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
  
};

export default AddRefferal;
