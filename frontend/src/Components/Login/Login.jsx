import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../instance/AxiosInstance";
import Style from "./style.module.css";
import { UserContext } from '../../Contexts/UserContext';
import { AdminContext } from "../../Contexts/AdminContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LoadingSpin from "react-loading-spin";
import { useTranslation } from 'react-i18next';

const Login = ({ setLogin }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const navigate = useNavigate();

  const loggedInUser = useContext(UserContext);
  const { SetUser } = loggedInUser;

  const loggedInAdmin = useContext(AdminContext);
  const { SetAdmin } = loggedInAdmin || {};

  const [ShowPassword, SetShowPassword] = useState(false);
  const [otp, setOtp] = useState(false);
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [Timer, SetTimer] = useState(60);
  const [IsTimerRunning, SetIsTimerRunning] = useState(false);

  const togglePasswordVisibility = () => {
    SetShowPassword(!ShowPassword);
  };

  useEffect(() => {
    let interval;

    if (IsTimerRunning && Timer > 0) {
      interval = setInterval(() => {
        SetTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (Timer === 0) {
      SetIsTimerRunning(false);
      SetTimer(60); // Reset timer
    }

    return () => {
      clearInterval(interval);
    };
  }, [IsTimerRunning, Timer]);

  const [userData, setUserData] = useState({
    data: "",
    password: ""
  });

  const [error, setError] = useState({
    otp: "",
  });

  const [otpDetails, setOtpDetails] = useState({
    email: "",
    phonenumber: "",
    otp: "",
  });

  const loginHandler = (e) => {
    e.preventDefault();
    instance.post('/api/login', userData).then((response) => {
      if (response.data.user.role === "superadmin" || response.data.user.role === "admin") {
        localStorage.setItem("AdminLogged", true);
        localStorage.setItem("AdminToken", response.data.token);
        SetAdmin(response.data.user);
        navigate("/admin");
      } else {
        localStorage.setItem("logged", true);
        localStorage.setItem("token", response.data.token);
        SetUser(response.data.user);
        navigate('/');
      }
    }).catch((error) => {
      if (error.response?.data?.emailStatus === false && error.response?.data?.phoneStatus === false) {
        setOtp(true);
        setOtpDetails({
          ...otpDetails,
          email: error.response?.data?.email,
          phonenumber: error.response?.data?.phoneNumber,
        });
      } else if (error.response?.data?.emailStatus === true && error.response?.data?.phoneStatus === false) {
        setIsEmailOtpVerified(true);
        setOtpDetails({
          ...otpDetails,
          phonenumber: error.response?.data?.phoneNumber,
        });
        setOtp(true);
      } else {
        toast.error(t("credentialsInvalid"));
        navigate('/registration_login');
      }
    });
  };

  const otpHandler = (e) => {
    setOtpDetails({
      ...otpDetails,
      otp: e.target.value,
    });
  };

  const HandleOtpVerify = (e) => {
    e.preventDefault();
    setError({ ...error, otp: "" });
    if (e.target.value === "") {
      setError({ ...error, otp: t("enterOtplog") });
    } else {
      setLoading(true);
      isEmailOtpVerified ?
        instance.post("api/verifyphone", otpDetails).then((response) => {
          setLoading(false);
          setLogin(false);
          setOtp(false);
          toast.success(t("registrationSuccessful"));
        }).catch((error) => {
          setLoading(false);
          setOtp(false);
        })
        : instance.post("api/verifyemail2n1", otpDetails).then((response) => {
          setLoading(false);
          setIsEmailOtpVerified(true);
          setOtpDetails({ otp: "" });
          setOtp(true);
          toast.success(t("emailVerified"));
        }).catch((error) => {
          setLoading(false);
          setOtp(false);
        });
    }
  };

  const HandleResendClick = () => {
    if (!IsTimerRunning) {
      SetTimer(60);
      SetIsTimerRunning(true);
      try {
        isEmailOtpVerified ?
          instance.post("api/otpsent_mobile", { phonenumber: userData?.phonenumber }).then((response) => {
            toast.success(t("otpResentPhone"));
          }).catch((err) => {
            console.log(err);
          })
          : instance.post("api/otpsent_email", { email: userData?.email }).then((response) => {
            toast.success(t("otpResentEmail"));
          }).catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={Style.container}>
      <div className={Style.form_wrapper}>
        <div className={Style.form_container}>
          {otp ?
            <div className={Style.otp_section}>
              <h1>{t("letsAuthenticatelogin")}</h1>
              <p>{t("otpSentTolog")} <span>{isEmailOtpVerified ? t("phonenumber") : t("email")}</span></p>
              <form onSubmit={(e) => { HandleOtpVerify(e); }}>
                <div className={Style.input_div}>
                  <div>
                    <label htmlFor="OTP">{t("enterOtpLabel")}</label>
                    <input
                      type="tel"
                      placeholder={t("otpPlaceholderlog")}
                      id="OTP"
                      value={otpDetails.otp}
                      onChange={(e) => { otpHandler(e); }}
                    />
                  </div>
                </div>
                <button>
                  {loading ? (<LoadingSpin size="20px" direction="alternate" width="4px" />) :
                    isEmailOtpVerified ? (t("completeRegistrationlog")) : (t("continuelog"))
                  }
                </button>
              </form>
              <button className={Style.resendBtn} onClick={(e) => { HandleResendClick(e) }} disabled={IsTimerRunning}>
                {IsTimerRunning ? `${t("resendOtpIn")} ${Timer}s` : t("resendOneTimePasswordlog")}
              </button>
              <p className={Style.error_para}>{error.otp}</p>
            </div>
            :
            <div className={Style.left_section}>
              <div className={Style.login_Details}>
                <Link className={Style.navigation} to='/'> <h1>DealNBuy</h1> </Link>
                <p>{t("provideDetailslog")}</p>
              </div>
              <form onSubmit={(e) => { loginHandler(e) }}>
                <div className={Style.input_div}>
                  <label htmlFor="email/phone Number">{t("emailOrPhone")}</label>
                  <input type="text" placeholder={t("emailOrPhone")} required id="email/phone Number" value={userData.data} onChange={(e) => { setUserData({ ...userData, data: e.target.value }) }} />
                </div>
                <div className={Style.input_div}>
                  <label htmlFor="password">{t("passwordlog")}</label>
                  <input
                    type={ShowPassword ? "text" : "password"}
                    placeholder={t("passwordlog")}
                    required
                    id="password"
                    value={userData.password}
                    onChange={(e) => { setUserData({ ...userData, password: e.target.value }) }}
                  />
                  <span
                    className={Style.eye_icon}
                    onClick={togglePasswordVisibility}
                  >
                    {ShowPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                  </span>
                </div>
                <button>
                  {t("loginlog")}
                </button>
              </form>
              <div className={Style.additional_options}>
                <p><Link className={Style.navigation} to='/forgetpassword'>{t("forgotPassword")}</Link></p>
                <p>{t("dontHaveAccount")} <Link className={Style.navigation} onClick={() => { setLogin(true) }}>{t("signup")}</Link></p>
              </div>
            </div>
          }
          <div className={Style.right_section}>
            <div className={Style.img_wrapper}>
              <img src="/Images/undraw.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
