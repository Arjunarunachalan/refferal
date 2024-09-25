import React from 'react';
import Style from "./index.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Function to get the year
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <div className={Style.Container}>
            <div className={Style.grid}>
                <div className={Style.box}>
                    <Link to='/' className={Style.navigation}>
                        <h1>DealNBuy</h1>
                    </Link>
                </div>

                <div className={Style.box}>
                    <h2>{t("Company")}</h2>
                    <ul>
                        <Link to='/about-us' className={Style.navigation}><li>{t("AboutUs")}</li></Link>
                        <Link to='/legal-and-privacy/terms&condition' className={Style.navigation}><li>{t("TermsConditions")}</li></Link>
                        <Link to='/legal-and-privacy' className={Style.navigation}><li>{t("PrivacyPolicy")}</li></Link>
                        <Link to='/legal-and-privacy/cookies' className={Style.navigation}><li>{t("CookiesTechnologies")}</li></Link>
                        <Link to='/help-center' className={Style.navigation}><li>{t("HelpCenter")}</li></Link>
                    </ul>
                </div>
                <div className={Style.box}>
                    <h2>{t("Locations")}</h2>
                    <ul>
                        <li>{t("Kannur")}</li>
                    </ul>
                </div>
                <div className={Style.box}>
                    <h2 onClick={() => { navigate("/contact") }}>{t("ContactUs")}</h2>
                    <ul>
                        <li>Email: contact.in@dealnbuy.co.in</li>
                    </ul>
                </div>
            </div>
            <div className={Style.bottom}>
                <div className={Style.bottomleft}>
                    <p>
                        {t("Copyright")} © 2023 - {getCurrentYear()} DealNBuy. {t("AllRightsReserved")}
                        <Link to='/legal-and-privacy/terms&condition' className={Style.navigation}><span className={Style.left}><i>{t("TermsOfUse")}</i></span></Link>
                        <Link to='/legal-and-privacy' className={Style.navigation}><span><i>{t("PrivacyPolicy")}</i></span></Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
