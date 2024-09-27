import React, { useContext, useEffect } from "react";
import Style from "./index.module.css";
import { UserContext } from "../../Contexts/UserContext";
import authInstance from "../../instance/AuthInstance";

const Rewards = () => {
  const LoggedInUser = useContext(UserContext);
  const { User } = LoggedInUser;

  // Check if User data is available
  const fetchData = async () => {
    if (!User || !User._id) {
      console.log('User data not available yet.');
      return;
    }
    
    try {
      // Corrected template literal usage
      const response = await authInstance.get(`/api/user/Reffer/get_refferals?userId=${User._id}`);
      console.log("response data :::::",response.data);
    } catch (err) {
      console.error('Error fetching data:', err.response ? err.response.data : err.message);
    }
  };

  useEffect(() => {
    if (User && User._id) {
      fetchData(); 
    }
  }, [User]);  // Adding User as dependency to ensure it's available

  return (
    <div className={Style.outer_container}>
      <div className={Style.conatiner}>
        <div className={Style.reward_container}>
          <div>Name</div>
          <div>1 Product added</div>
          <div>Rewarded</div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
