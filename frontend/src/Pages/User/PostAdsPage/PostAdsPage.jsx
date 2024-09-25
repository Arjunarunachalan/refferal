import React, { useContext, useEffect, useState } from "react";
import Style from "./index.module.css";
import { BiArrowBack } from "react-icons/bi";
import { BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import instance from "../../../instance/AxiosInstance";
import { toast } from "react-toastify";
import MobileTile from "./MediumPage";
import { UserContext } from "../../../Contexts/UserContext";
import Footer from "../../../Components/Footer/Footer";
import { useTranslation } from "react-i18next";

const PostAdsPage = () => {
  const { t, i18n } = useTranslation(); // Destructure i18n for language handling
  const Navigate = useNavigate();
  const USER = useContext(UserContext);
  const { User, SetUser } = USER;

  const [categories, setCategories] = useState([]);
  const [Subcategories, setSubCategories] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [Select, SetSelect] = useState(null);

  // Functions
  const mountingfunction = async () => {
    instance
      .get(`/api/user/profile/get_profile/${User?._id}`)
      .then((response) => {
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
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  // Mounting functions
  useEffect(() => {
    if (User && User._id) {
      mountingfunction();
    }
  }, [User]);

  // SubCat selector
  const subCategorySelector = (categoryId) => {
    instance
      .get(`/api/category/get_singlecategory?categoryId=${categoryId}`)
      .then((response) => {
        setSubCategories([...response.data.subcategory]);
        setToggle(true);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  // Sorting the array by categoryName in alphabetical order
  categories.sort((a, b) => {
    const nameA = typeof a.categoryName === 'object' ? a.categoryName[i18n.language] || a.categoryName['en'] : a.categoryName.toLowerCase();
    const nameB = typeof b.categoryName === 'object' ? b.categoryName[i18n.language] || b.categoryName['en'] : b.categoryName.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const clickhandler = (id) => {
    subCategorySelector(id);
    SetSelect(id);
  };

  return (
    <div className={Style.page_wrapper}>
      <div className={Style.header_wrapper}>
        <div className={Style.backarrow} onClick={() => Navigate("/")}>
          <BiArrowBack />
        </div>
      </div>

      <div className={Style.container_wrapper}>
        <div className={Style.container}>
          <div className={Style.left_container}>
            <div className={Style.box_title}>
              <h3>{t("choose_category")}</h3>
            </div>

            {categories.map((value, index) => (
              <div
                key={index}
                className={Select === value._id ? Style.hightlight : Style.normal}
                onClick={() => clickhandler(value._id)}
              >
                <label>
                  {typeof value.categoryName === 'object'
                    ? value.categoryName[i18n.language] || value.categoryName['en']
                    : value.categoryName}
                </label>
                <span>
                  <BsChevronRight />
                </span>
              </div>
            ))}
          </div>

          <div className={Style.right_container}>
            {toggle ? (
              <div>
                {Subcategories.map((value, index) => (
                  <div
                    key={index}
                    className={Style.box}
                    onClick={() => {
                      Navigate(`/registerad/${value._id}`);
                    }}
                  >
                    <label>
                      {typeof value.subcategory === 'object'
                        ? value.subcategory[i18n.language] || value.subcategory['en']
                        : value.subcategory}
                    </label>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <MobileTile />
      <Footer />
    </div>
  );
};

export default PostAdsPage;
