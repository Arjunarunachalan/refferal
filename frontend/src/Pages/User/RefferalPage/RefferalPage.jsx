import React, { useState } from "react";
import styles from "./index.module.scss"; // Importing SCSS module
import Refferal from "../../../Components/Refferal/Refferal";
import Breadcrumb from "../../../Components/Breadcrumb/Breadcrumb";
import { useLocation } from "react-router-dom";
import Navbar from "../../../Components/Navbar/Navbar";
import Rewards from "../../../Components/Rewards/Rewards";
import AddRefferal from "../../../Components/AddRefferal/AddRefferal";

const RefferalPage = () => {
  const location = useLocation();
  const pathSegment = location.pathname.split("/").filter((segment) => segment);
  const [selected, setSelected] = useState("option1");

  const handleToggle = (option) => {
    setSelected(option);
  };

  return (
    <div className={styles.content}>
      {/* Navbar */}
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>

      {/* Breadcrumbs on a new line */}
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb pathSegments={pathSegment} />
      </div>

      {/* Navbar items as toggle buttons */}
      <div className={styles.toggleNavbarContainer}>
        <div
          className={`${styles.navbarItem} ${
            selected === "option1" ? styles.active : ""
          }`}
          onClick={() => handleToggle("option1")}
        >
          Refferal
        </div>
        <div
          className={`${styles.navbarItem} ${
            selected === "option2" ? styles.active : ""
          }`}
          onClick={() => handleToggle("option2")}
        >
          My Refferal
        </div>
        <div
          className={`${styles.navbarItem} ${
            selected === "option3" ? styles.active : ""
          }`}
          onClick={() => handleToggle("option3")}
        >
          Add Refferal
        </div>
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        {selected === "option1" ? (
          <div className={styles.componentOption1}>
            <Refferal />
          </div>
        ) : selected === "option2" ?(
          <div className={styles.componentOption2}>
            <div>
              <Rewards />
            </div>
          </div>
        ):(
          <div className={styles.componentOption2}>
            <div>
              <AddRefferal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefferalPage;
