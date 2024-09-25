import React, { useState, useEffect, useRef } from "react";
import Style from "./Style.module.css";
import Header from "../../../Components/AdminComponents/Header/Header";
import Sidebar from "../../../Components/AdminComponents/Sidebar/Sidebar";
import { BsPlusCircle } from "react-icons/bs";
import { Delete } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import adminInstance from "../../../instance/AdminInstance";

const New = ({ title }) => {
  const Languages = [
    { code: "en", lang: "English" },
    { code: "fr", lang: "French" },
    { code: "hi", lang: "Hindi" },
    { code: "ta", lang: "Tamil" },
    { code: "kn", lang: "Kannada" },
    { code: "te", lang: "Telugu" },
    { code: "ml", lang: "Malayalam" },
  ];

  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);
  const selectRef3 = useRef(null);
  const navigate = useNavigate();

  const [Visible, SetVisible] = useState(false);
  const [SubcategoryName, SetSubcategoryName] = useState("");
  const [categoryName, SetCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

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

  //get Category functions
  useEffect(() => {
    adminInstance
      .get("/api/category/get_categories")
      .then((response) => {
        const categoryName = response.data.map((singlecat) => singlecat);
        setCategories(categoryName);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(categories, "cate");

  const optionHandler = (e) => {
    if (CurrentInput.type === "select") {
      SetOptions([...Options, { value: OptionData, label: OptionData }]);
      SetOptionData("");
    } else if (CurrentInput.type === "radio") {
      SetOptions([...Options, OptionData]);
      SetOptionData("");
    }
  };

  //handle subcategoryname
  const handlesubcategorychange = (langcode, value) => {
    SetSubcategoryName((prevname) => ({
      ...prevname,
      [langcode]: value,
    }));
  };

  //Handle add all data to formdata
  const handleAddProperty = () => {
    CurrentInput.options.push(...Options);
    SetFormInputs((prevFormInputs) => [...prevFormInputs, CurrentInput]);
    SetOptions("");
    SetCurrentInput({
      label: "",
      type: "",
      options: [],
      name: "",
      important: false,
    });

    selectRef2.current.value = "";
    selectRef3.current.value = "";
  };

  //Handle submiting the data to database
  const handleSubmit = (e) => {
    e.preventDefault();
    adminInstance
      .post("/api/super_admin/category/add_subcategory", {
        categoryId: categoryName,
        subCategory: SubcategoryName,
        formInputs: FormInputs,
      })
      .then((response) => {
        SetSubcategoryName("");
        SetFormInputs([]);
        selectRef1.current.value = "";
        toast.success("Sucessfully Created");
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
              {Languages.map((lang) => (
                <div className={Style.formInput} key={lang.code}>
                  <label>
                    {lang.lang} Subcategory Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`sub category name in ${lang.lang}`}
                    required
                    value={lang[lang.code]}
                    onChange={(e) =>
                      handlesubcategorychange(lang.code, e.target.value)
                    }
                  />
                </div>
              ))}

              <div className={Style.formInput}>
                <label>
                  Category Name <span>*</span>{" "}
                </label>
                <select
                  name="categoryname"
                  Selected="Select..."
                  defaultValue="select..."
                  ref={selectRef1}
                  onChange={(e) => {
                    SetCategoryName(e.target.value);
                  }}
                  required
                >
                  <option value="" selected disabled hidden>
                    Choose here
                  </option>
                  ,
                  {categories.map((categories, index) => {
                    return (
                      <option value={categories._id} key={categories._id}>
                        {categories.categoryName.en}
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
                <Tooltip title="Check before Saving the data">
                  <button>Save</button>
                </Tooltip>
                <button onClick={(e) => HandleCancel(e)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>

        {Options.length !== 0 ? (
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
          {FormInputs.map((formInput) => {
            const FormOptions = formInput.options;
            return (
              <div className={Style.details}>
                <div className={Style.left_wrap}>
                  <div className={Style.detailItem}>
                    <span className={Style.itemKey}>Label:</span>
                    <span className={Style.itemValue}>{formInput.label}</span>
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
                    onClick={() => handleRemove()}
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

export default New;
