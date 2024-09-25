import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../../Components/Navbar/Navbar'
import Footer from '../../../Components/Footer/Footer'
import Style from './Style.module.css'
import instance from '../../../instance/AxiosInstance'
import { UserContext } from '../../../Contexts/UserContext'
import SubscriptionCarousel from '../../../Components/Carousels/SubscriptionCarousel/SubscriptionCarousel'
import Breadcrumb from '../../../Components/Breadcrumb/Breadcrumb'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'



const PurchaseAd = () => {
const {t} = useTranslation()
    const loggedInUser = useContext(UserContext);
    const { User } = loggedInUser

    const [Subscriptions, SetSubscriptions] = useState([])
    const [UserData, SetUserData] = useState({})

    const location = useLocation();
    const pathSegment = location.pathname.split('/').filter((segment) => segment);


    useEffect(() => {
        instance.get('/api/user/subscription_plans/get_subscription').then((response) => {
            SetSubscriptions([...response.data])
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        try {
            instance.get(`/api/user/profile/get_profile/${User._id}`).then((Response) => {
                SetUserData({ ...Response.data })
            }).catch((err) => {
                console.log(err)
            });
        } catch (error) {
            console.log(error);
        }
    }, [User]);

    return (
        <>
            <Navbar />
            <div className={Style.mainContainer}>
                <Breadcrumb pathSegments={pathSegment} />
                <div className={Style.Container}>

                    <div className={Style.top}>
                        <div className={Style.top_row}>
                            <h1>{t("Wegota_plan")} <br />{t("thats_perfect")}</h1>
                        </div>
                        <div className={Style.bottom_row}>
                            <span className={Style.First} >{t("remaining_ad_count")} </span>
                            <span className={Style.Second}>{UserData ? UserData.AdCount : 0}</span>
                        </div>
                    </div>
                    <div className={Style.bottom} >
                        <div className={Style.row_bottom}>
                            <SubscriptionCarousel Subscriptions={Subscriptions} />
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>

    )
}

export default PurchaseAd