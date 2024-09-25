import React, { useContext, useEffect, useState } from "react";
import Style from "./index.module.css";
import { BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import instance from "../../../instance/AxiosInstance";
import { toast } from "react-toastify";
import { UserContext } from "../../../Contexts/UserContext";
import { useTranslation } from "react-i18next";

const MediumPage = () => {
  const { t, i18n } = useTranslation(); // Destructure i18n for language handling
  const Navigate = useNavigate();
  const USER = useContext(UserContext);
  const { User } = USER;

  const [categories, setCategories] = useState([]);
  const [Subcategories, setSubCategories] = useState([]);
  const [subCategoryToggle, setSubCategoryToggle] = useState(false);

  // Functions
  const mountingfunction = async () => {
    instance.get(`/api/user/profile/get_profile/${User._id}`).then((response) => {
      if (response.data.Adcount <= 0) {
        Navigate(`/purchaseads`);
      } else {
        instance
          .get("/api/category/get_categories")
          .then((response) => {
            setCategories([...response.data]);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }).catch((err) => {
      console.log(err.data);
    });
  };

  // SubCat selector
  const subCategorySelector = (categoryId) => {
    instance.get(`/api/category/get_singlecategory?categoryId=${categoryId}`).then((response) => {
      setSubCategories([...response.data.subcategory]);
      setSubCategoryToggle(true);
    }).catch((err) => {
      toast.error(err.response.data.message);
    });
  };

  // Mounting functions
  useEffect(() => {
    if (User && User._id) {
      mountingfunction();
    }
  }, [User]);

  return (
    <div className={Style.M_container}>
      <div className={Style.Container}>
        {subCategoryToggle ? (
          <div className={Style.left_container}>
            <div className={Style.box_title}>
              <h3>{t("choose_subcategory")}</h3> {/* Translation */}
            </div>
            {Subcategories.map((value, index) => (
              <div key={index} className={Style.box} onClick={() => { Navigate(`/registerad/${value._id}`); }}>
                <label>
                  {typeof value.subcategory === 'object'
                    ? value.subcategory[i18n.language] || value.subcategory['en']
                    : value.subcategory}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className={Style.left_container}>
            <div className={Style.box_title}>
              <h3>{t("choose_category")}</h3> {/* Translation */}
            </div>
            {categories.map((value, index) => (
              <div key={index} className={Style.box} onClick={() => subCategorySelector(value._id)}>
                <label>
                  {typeof value.categoryName === 'object'
                    ? value.categoryName[i18n.language] || value.categoryName['en']
                    : value.categoryName}
                </label>
                <span>
                  {" "} <BsChevronRight />{" "}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediumPage;
