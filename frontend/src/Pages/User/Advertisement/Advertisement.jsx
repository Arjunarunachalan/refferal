import React from 'react'
import Style from "./index.module.css";
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import AdvertisementForm from './AdvertisementForm/AdvertisementForm';
import { useTranslation } from 'react-i18next';


const Advertisement = () => {
const {t}  =useTranslation()
    const Navigate = useNavigate()
  return (
    <div className={Style.page_wrapper}>
    <   div className={Style.header_wrapper}>
        <div className={Style.backarrow} onClick={() => Navigate('/')} >
            <BiArrowBack />
        </div>
    </div>
        <div className={Style.under_heading}>
           <div>
           <h1>{t("add_your_advertisement")}</h1> 
            <h5>{t("post_your_advertisement")}</h5>
        
           </div>
        </div>
        <div className={Style.form_space}>
            <AdvertisementForm/>
        </div>
</div>
  )
}

export default Advertisement