import React, { useContext } from 'react';
import Style from "./index.module.css";
import { FaCopy } from 'react-icons/fa'; // Import the copy icon
import { UserContext } from '../../Contexts/UserContext';


const Refferal = () => {
  const UserData = useContext(UserContext);
  const {User} = UserData;
  console.log(User,"userdata from reffer");
  console.log(User.ReferalCode,"fee");
  
  
  return (  
    <div className={Style.refferalContainer}>
      <div>
        <h1>Invite Friends to DealnBuy</h1>
        <ul className={Style.descriptionList}>
          <li>Create an account: You must have a registered account on our platform.</li>
          <li>Add products: Add at least 5 products to your account.</li>
          <li>Refer new users: Invite 5 new users to join our platform using your unique referral link.</li>
          <li>New user actions: Each new user you refer must:
            <ul>
              <li>Create an account.</li>
              <li>Add at least 2 products to their account.</li>
            </ul>
          </li>
          <li>System verification: Our system will validate their eligibility for the referral reward.</li>
          <li>Reward transfer: If conditions are met, 50 rupees will be transferred to your Bank account.</li>
        </ul>

        <p className={Style.additionalNotes}>
  Additional notes:
</p>
<ul className={Style.additionalNotesList}>
  <li>The referral program is open to all users.</li>
  {/* <li>Each user can only receive a reward once.</li> */}
  <li>We reserve the right to modify or terminate this referral program at any time.</li>
</ul>


        <div className={Style.refferalCodeSection}>
          <div className={Style.refferalHeader}>Your Referral Code</div>
          <div className={Style.codeSection}>
            {
              User.ReferalCode? 
              <div className={Style.code}>{User.ReferalCode}</div>
              :
              <div className={Style.code}>000000</div>
            }
            
            <button className={Style.copyButton}>
              <FaCopy className={Style.copyIcon} /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Refferal;
