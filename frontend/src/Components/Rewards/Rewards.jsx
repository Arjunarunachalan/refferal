import React, { useContext, useEffect } from "react";
import Style from "./index.module.css";
import { UserContext } from "../../Contexts/UserContext";
import authInstance from "../../instance/AuthInstance";

const Rewards = () => {
  const LoggedInUser = useContext(UserContext);
  const { User } = LoggedInUser;
  
  const fetchData = async () => {
    try {
      if (User?._id) {  // Ensure User._id is available
        const response = await authInstance.get(`/api/user/Reffer/get_refferals?userId=${User._id}`);
        console.log(response.data, "res data");
      } else {
        console.log("User ID not found");
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };
  
useEffect(() => {
  fetchData(); // Call the function here, don't invoke it directly in useEffect
}, []);

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
