import React, { useState, useEffect, useRef } from "react";
import Style from "./Style.module.css";
import Header from "../../../Components/AdminComponents/Header/Header";
import Sidebar from "../../../Components/AdminComponents/Sidebar/Sidebar";
import { BsPlusCircle } from "react-icons/bs";
import { Delete } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import adminInstance from "../../../instance/AdminInstance";
import { useTranslation } from "react-i18next";

const EditSubcategory = ({ title }) => {
  const { t, i18n } = useTranslation();
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);
  const selectRef3 = useRef(null);

  const [Visible, SetVisible] = useState(false);
  const [SubcategoryName, SetSubcategoryName] = useState("");
  const [CategoryId, SetCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [CategoryName, SetCategoryName] = useState("");
  const [FormInputs, SetFormInputs] = useState([]);
  const [CurrentInput, SetCurrentInput] = useState({
    label: "",
    type: "",
    options: [],
    name: "",
    important: false,
  });

  const [OptionData, SetOptionData] = useState("");
  const [Options, SetOptions] = useState([]);
  const [SubCategoryData, SetSubCategoryData] = useState({
    en: "",
    fr: "",
    hi: "",
    ta: "",
    kn: "",
    te: "",
    ml: "",
  });

  const Languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "French" },
    { code: "hi", lang: "Hindi" },
    { code: "ta", lang: "Tamil" },
    { code: "kn", lang: "Kannada" },
    { code: "te", lang: "Telugu" },
    { code: "ml", lang: "Malayalam" },
  ];

  //Load SubCategory data functions
  useEffect(() => {
    try {
      adminInstance
        .get(
          `/api/super_admin/category/get_singlesubcategory?subCategoryId=${subcategoryId}`
        )
        .then((response) => {
          console.log(response.data, "single sub cat");

          SetSubCategoryData(response.data.subcategory);
          SetCategoryId(response.data.category);
          SetFormInputs([...response.data.formInputs]);

          if (typeof response.data.subcategory === "object") {
            SetSubCategoryData(response.data.subcategory);
          } else {
            SetSubCategoryData({
              en: response.data.subcategory,
              fr: "",
              hi: "",
              ta: "",
              kn: "",
              te: "",
              ml: "",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [subcategoryId]);

  //get category Name
  useEffect(() => {
    try {
      adminInstance
        .get(`/api/category/get_SingleCategory?categoryId=${CategoryId}`)
        .then((response) => {
          SetCategoryName(response.data.categoryName);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [CategoryId]);

  //get Category functions
  useEffect(() => {
    adminInstance
      .get("/api/category/get_categories")
      .then((response) => {
        setCategories([...response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //add option data to array
  const optionHandler = (e) => {
    if (CurrentInput.type === "select") {
      SetOptions([...Options, { value: OptionData, label: OptionData }]);
      SetOptionData("");
    } else if (CurrentInput.type === "radio") {
      SetOptions([...Options, OptionData]);
      SetOptionData("");
    }
  };

  //Handle add all data to formdata
  const handleAddProperty = () => {
    // Ensure the label is an object where each key is a language code
    const updatedLabel = Languages.reduce((acc, lang) => {
        acc[lang.code] = CurrentInput.label[lang.code] || "";
        return acc;
    }, {});

    // Update the CurrentInput with the object-based label
    const updatedInput = {
        ...CurrentInput,
        label: updatedLabel,  // Use the object for the label
    };

    // Add the updated input to the form inputs
    SetFormInputs((prevFormInputs) => [...prevFormInputs, updatedInput]);

    // Reset the options and current input state
    SetOptions([]);
    SetCurrentInput({
        label: {},
        type: "",
        options: [],
        name: "",
        important: false,
    });

    // Reset the select elements
    selectRef2.current.value = "";
    selectRef3.current.value = "";
};


  //Handle submiting the data to database
  const handleSubmit = (e) => {
    e.preventDefault();

    adminInstance
      .put("/api/super_admin/category/update_subcategory", {
        subcategoryId: subcategoryId,
        newInfo: SubCategoryData,
        categoryId: CategoryId,
        formInputs: FormInputs,
      })
      .then((response) => {
        SetSubcategoryName("");
        SetFormInputs([]);
        selectRef1.current.value = "";
        toast.success("Sucessfully Updated");
        navigate("/admin/subcategory");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong");
      });
  };

  // handle remove from table data
  const handleRemove = (index) => {
    const updatedProperties = [...FormInputs];
    updatedProperties.splice(index, 1);
    SetFormInputs(updatedProperties);
  };

  const handleOptionsRemove = (index) => {
    const updatedOptions = [...Options];
    updatedOptions.splice(index, 1);
    SetOptions(updatedOptions);
  };

  const HandleCancel = (e) => {
    e.preventDefault();
    SetFormInputs([]);
    navigate("/admin/subcategory");
  };
  const handleTranslationChange = (langCode, value) => {
    SetSubCategoryData(prevState => ({
      ...prevState,
      [langCode]: value
    }));
  };

  return (
    <div className={Style.new}>
      <Sidebar />
      <div className={Style.newContainer}>
        <Header />

        <div className={Style.top}>
          <h1>{title}</h1>
        </div>

        <div className={Style.center}>
          <div className={Style.right}>
            <form onSubmit={(e) => handleSubmit(e)}>
              {
                Languages.map((lang=>(
              <div className={Style.formInput}  key={lang.code}>
                <label>
                  {`Subcategory Name in ${lang.lang}`} <span>*</span>
                </label>
                <input
               
                  type="text"
                  placeholder={`name in ${lang.lang}`}
                  id="subcategoryname"
                  value={SubCategoryData[lang.code] || ""}
                  onChange={(e) => handleTranslationChange(lang.code, e.target.value)}
                />
              </div>
                )))
              }
              

              <div className={Style.formInput}>
                <label>
                  Category Name <span>*</span>{" "}
                </label>
                <select
                  name="categoryname"
                  defaultValue=""
                  ref={selectRef1}
                  onChange={(e) => SetCategoryId(e.target.value)}
                >
                  <option value="" disabled>
                    {t("selectCategory")}
                  </option>
                  {categories.map((category) => {
                    // Determine the display name of the category
                    const displayName =
                      typeof category.categoryName === "object"
                        ? category.categoryName[i18n.language] ||
                          category.categoryName.en
                        : category.categoryName || t("unknownCategory");

                    return (
                      <option key={category._id} value={category._id}>
                        {displayName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className={Style.formproperty}>
                <span
                  className={Style.toggleBtn}
                  onClick={() => SetVisible(!Visible)}
                >
                  <BsPlusCircle /> Add Property
                </span>
                {Visible ? (
                  <div className={Style.formWrapper}>
                     <div className={Style.formInput}>
                      <label>
                        Property Name <span>*</span>{" "}
                      </label>
                   
                      <input
                    type="text"
                    placeholder="name"
                    id='proertyname'
                    value={CurrentInput.label}
                    onChange={(e) => { SetCurrentInput({ ...CurrentInput, label: e.target.value }) }}
                  />
                     
                    </div>


                    <div className={Style.formInput}>
                      <label>
                        Property Type <span>*</span>{" "}
                      </label>
                      <select
                        name="propertytype"
                        Selected={CurrentInput.label}
                        ref={selectRef2}
                        defaultValue="select..."
                        onChange={(e) => {
                          SetCurrentInput({
                            ...CurrentInput,
                            type: e.target.value,
                          });
                        }}
                      >
                        <option value="" selected>
                          Choose here
                        </option>
                        <option value="text">Text</option>
                        <option value="select">Select</option>
                        <option value="radio">Radio</option>
                      </select>
                    </div>

                    <div className={Style.formSelect}>
                      <label>
                        Important <span>*</span>{" "}
                      </label>
                      <select
                        name="categoryname"
                        Selected="Select..."
                        defaultValue="select..."
                        ref={selectRef3}
                        onChange={(e) => {
                          SetCurrentInput({
                            ...CurrentInput,
                            important: e.target.value,
                          });
                        }}
                      >
                        <option value="" selected>
                          Choose here
                        </option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>

                    <div>
                      <span
                        className={Style.propertyBtn}
                        onClick={handleAddProperty}
                      >
                        Create
                      </span>
                    </div>

                    {CurrentInput.type === "select" ||
                    CurrentInput.type === "radio" ? (
                      <div className={Style.newform}>
                        <div className={Style.formInput}>
                          <label>
                            Options <span>*</span>{" "}
                          </label>
                          <input
                            type="text"
                            placeholder="Text here"
                            id="proertyname"
                            value={OptionData}
                            onChange={(e) => {
                              SetOptionData(e.target.value);
                            }}
                          />
                        </div>
                        <div className={Style.formbtn}>
                          <span
                            className={Style.propertyBtn}
                            onClick={optionHandler}
                          >
                            Add
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className={Style.formBtn}>
                <Tooltip title="Check the data before Saving the data">
                  <button>Save</button>
                </Tooltip>
                <button onClick={(e) => HandleCancel(e)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>

        {Options !== "" ? (
          <div className={Style.bottomTable}>
            <h1 className={Style.title}>Options</h1>
            {Options.map((data, index) => {
              return (
                <div className={Style.details} key={index}>
                  <div className={Style.left}>
                    <div className={Style.detailItem}>
                      <span className={Style.itemValue}>
                        {CurrentInput.type === "select" ? data.value : data}
                      </span>
                    </div>
                  </div>
                  <div className={Style.right}>
                    <button onClick={() => handleOptionsRemove(index)}>
                      <Delete />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className={Style.bottomTable}>
          <h1 className={Style.title}>Information</h1>
          {FormInputs.map((formInput, index) => {
            const updatedlabel =typeof  formInput.label === "object"
            ?  formInput.label.en 
            : formInput.label
            const FormOptions = formInput.options;
            return (
              <div className={Style.details}>
                <div className={Style.left_wrap}>
                  <div className={Style.detailItem}>
                    <span className={Style.itemKey}>Label:</span>
                    <span className={Style.itemValue}>{updatedlabel}</span>
                  </div>
                  <div className={Style.detailItem}>
                    <span className={Style.itemKey}>Type:</span>
                    <span className={Style.itemValue}>{formInput.type}</span>
                  </div>
                  <div className={Style.detailItem}>
                    <span className={Style.itemKey}>Important:</span>
                    <span className={Style.itemValue}>
                      {" "}
                      {formInput.important}{" "}
                    </span>
                  </div>
                  {FormOptions !== "" ? (
                    <div className={Style.option_wrap}>
                      <h3 className={Style.option_title}>Options:</h3>

                      <div className={Style.Items}>
                        {FormOptions.map((data, index) => {
                          return (
                            <div className={Style.Item} key={index}>
                              <span className={Style.itemValue}>
                                {formInput.type === "select"
                                  ? data.value
                                  : data}
                                ,{" "}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className={Style.right}>
                  <button
                    className={Style.rembtn}
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditSubcategory;
