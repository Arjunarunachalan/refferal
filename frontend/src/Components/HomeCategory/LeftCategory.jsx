import React, { useState, useEffect, useContext } from "react";
import Style from "./Style.module.css";
import { useNavigate } from "react-router-dom";
import instance from "../../instance/AxiosInstance";
import { UserContext } from "../../Contexts/UserContext";
import registerClicks from "../../utilities/getCategoryClicks";
import { useTranslation } from "react-i18next";

const LeftCategory = () => {
  const { t, i18n } = useTranslation();
  const { User } = useContext(UserContext);
  const userId = User?._id;

  const navigate = useNavigate();
  const [Categories, SetCategories] = useState([]);

  // Load categories from API
  const loadCategories = () => {
    instance
      .get("/api/category/get_categories")
      .then((response) => {
        const sortedCategories = response.data.sort((a, b) => {
          const getName = (category) => {
            if (typeof category.categoryName === "object") {
              return category.categoryName[i18n.language]?.toLowerCase() || "";
            } else if (typeof category.categoryName === "string") {
              return category.categoryName.toLowerCase();
            }
            return ""; // default to empty string if categoryName is neither an object nor a string
          };
          return getName(a).localeCompare(getName(b));
        });

        SetCategories(sortedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Handle category click
  const handleCategoryClick = (catId) => {
    if (userId) {
      registerClicks(catId, userId);
    }
    navigate(`/category/${catId}`);
  };

  return (
    <div>
      <div className={Style.LeftContainer}>
        <div className={Style.title}>
          <span>{t("browseCategories")}</span>
        </div>
        {Categories.length > 0 ? (
          Categories.map((category) => {
            // Determine the display name of the category
            const displayName =
              typeof category.categoryName === "object"
                ? category.categoryName[i18n.language] || category.categoryName.en
                : category.categoryName || t("unknownCategory");

            return (
              <div
                className={Style.box}
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
              >
                {/* Uncomment and replace with actual icon URL if needed */}
                {/* <img src={category.icon?.url} alt={displayName} /> */}
                <span>{displayName}</span>
              </div>
            );
          })
        ) : (
          <div className={Style.noCategories}>
            {t("noCategoriesAvailable")}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftCategory;
