import React, { useContext, useState } from "react";
import Style from "./index.module.css";
import { UserContext } from "../../Contexts/UserContext";
import authInstance from "../../instance/AuthInstance";

const AddRefferal = () => {
  const LoggedInUser = useContext(UserContext);
  const { User } = LoggedInUser;
  console.log(User._id,"user contect data");
  
  const [referralCode, setReferralCode] = useState("");

 
console.log(referralCode,"reffer");

  const handleChange = (e) => {
    setReferralCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sendPostRequest = async () => {
      const payload = {
        userId: User?._id || 'defaultUserId',  // Assuming you want to use logged-in user's ID
        referCode: referralCode,  // Use the referral code entered by the user
      };

      try {
        const response = await authInstance.post("/api/user/Reffer/create_referals", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Referral successfully added:", response.data);
      } catch (error) {
        console.log("Error adding referral:", error);
      }
    };

    // Call the function to send the request
    sendPostRequest();
    
    // Log the submitted referral code (can be removed later)
    console.log("Submitted Referral Code:", referralCode);
  };

  return (
    <div className={Style.container}>
      <div className={Style.formContainer}>
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
      </div>
    </div>
  );
};

export default AddRefferal;
