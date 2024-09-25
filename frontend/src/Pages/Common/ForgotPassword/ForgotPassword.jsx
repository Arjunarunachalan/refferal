import React, { useState } from "react";
import Otp from "../../../Components/Otp/Otp";
import ResetPassword from "../../../Components/ResetPassword/ResetPassword";
import instance from "../../../instance/AxiosInstance";
import Style from "./Index.module.css";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpin from "react-loading-spin";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const {t} = useTranslation()

  //loading State

  const [loading, setLoading] = useState(false)

  //error State

  const [error, setError] = useState({ message: "" })

  //component toggling states

  const [toggle, setToggle] = useState(true); //states toggles between Phonenumber and email

  const [auth, setAuth] = useState(false); //state toggles between otp component and forgotpasswaord component

  const [reset, setReset] = useState(false) //state toggles between resetPass and forgotpasswaord component

  //state for data saving

  const [data, setData] = useState("")

  const [formData, setFormdata] = useState({ email: "", phonenumber: "" })


  //api calls

  const submitHandler = (e) => {

    e.preventDefault()
    if (formData.email === "" && formData.phonenumber === "") {
      setError({ ...error, message: "This field cannot be empty" })
    } else {
      console.log(formData);
      setLoading(true)
      toggle ?
        instance.post("api/otpsent_email", formData).then((response) => {
          setData(response.data.userInfo.email)
          setLoading(false)
          setAuth(true)
        }).catch((error) => {
          setLoading(false)
          toast.error(error.response.data.message)
        }) :
        instance.post("api/otpsent_mobile", formData).then((response) => {
          setData(response.data.userInfo.phoneNumber)
          setLoading(false)
          setAuth(true)
        }).catch((error) => {
          setLoading(false)
          toast.error(error.response.data.message)
        })
    }
  }



  return (
    <div className={Style.container}>
      {reset ? <ResetPassword userData={data} /> : auth ? (
        <Otp userData={data} toggle={toggle} reset={setReset} />
      ) : (
        <div className={Style.form_container}>
          <div className={Style.left}>
            <h1>{t("letsFindYourAccount")}</h1>
            <p>{t("enterYourRegisteredEmail")}</p>
            <form onSubmit={submitHandler}>
              {toggle ? (
                <div>
                  {/* <label htmlFor="forgotEmail">Email</label> */}
                  <input type="Email" placeholder="Email" onChange={(e) => setFormdata({ ...formData, email: e.target.value })} id="forgotEmail" />
                  <p>{error.message}</p>
                </div>
              ) : (
                <div>
                  {/* <label htmlFor="forgotPhone">Phone Number</label> */}
                  <input type="tel" placeholder="Phonenumber" id="forgotPhone" value={formData.phonenumber} onChange={(e) => setFormdata({ ...formData, phonenumber: e.target.value })}/>
                  <p>{error.message}</p>
                </div>
              )}
              <button>{loading ? (
                <LoadingSpin size="20px" direction="alternate" width="4px" />
              ) : (
                t("continue")
              )}</button>
              {
                toggle ? <p>{t("emailNotRegistered")}  <span onClick={() => setToggle(false)}>{t("usePhoneNumberInstead")} </span></p> :
                  <p>{t("phoneNumberNotRegistered")} <span onClick={() => setToggle(true)}> {t("useEmailInstead")}</span></p>
              }

            </form>
          </div>
          <div className={Style.right}>
          <img src="/Images/forgot.svg" alt="" />
          </div>
        </div>

      )}
    </div>
  );
};

export default ForgotPassword;
