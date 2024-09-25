import React from 'react'
import Style from "./index.module.css"
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Newsletter = () => {
    const {t} = useTranslation()

    const Navigate = useNavigate()

    return (
        <div className={Style.newsletter}>
            <div className={Style.container}>
                <div className={Style.row}>
                    <div className={Style.left}>
                        <p>{t("ContactMessage")}</p>
                    </div>
                    <div className={Style.right}>
                        <button onClick={() => { Navigate('/contact') }}>{t("ContactUs")}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Newsletter