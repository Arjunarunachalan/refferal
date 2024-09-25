import React, { useEffect, useState } from "react";
import Style from "./index.module.css";
import { FaFilter } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import instance from "../../instance/AxiosInstance";
import Select from "react-select";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";

const ProductFilter = ({
  Subctegoryfilter,
  nestSelected,
  setSelectedNest,
  load,
  FilterOptions,
  Subcategories,
  onChangeSubcategory,
  onMin,
  onMax,
  onState,
  onDistrict,
  otherSelectedFilter,
  nestedCategories,
  setNestedCategories,
  selectedSubcategory,
  onSubcategoryChange,
  fetchSubcatfilter,
  filterBySubcategory,
  setFilterBySubcategory,
}) => {
  const [CategoryToggle, SetCategoryToggle] = useState(true);
  const [NestedCategoryToggle, SetNestedCategoryToggle] = useState(true);
  const [LocationToggle, SetLocationToggle] = useState(true);
  const [States, SetStates] = useState([]);
  const [District, SetDistrict] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [filterCollection, setFilterCollection] = useState({});
  const [tooltipText, setTooltipText] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [filterByState, setFilterByState] = useState(null);
  const [filterByDistrict, setFilterByDistrict] = useState(null);
  const [filterByMinPrice, setFilterByMinPrice] = useState(null);
  const [filterByMaxPrice, setFilterByMaxPrice] = useState(null);
  const [selectedNestedCategory, setSelectedNestedCategory] = useState(null);
  const [filterByNestedCategory, setFilterByNestedCategory] = useState(null);
  const [combinedFilters, setCombinedFilters] = useState([]);
  const [CheckboxOptions, SetCheckboxOptions] = useState([]);


  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Combine FilterOptions and Subcategoryfilter
    setCombinedFilters((prev) => [...FilterOptions, ...Subctegoryfilter]);
  }, [FilterOptions, Subctegoryfilter]);


  const getLabel = (label) => {
    // Check if the label is an object
    if (typeof label === "object" && label !== null) {
      return label[i18n.language] || label.en || "";
    }
    return label || "";
  };

  const subcategoryOptions = Subcategories
    ? Subcategories.map((data) => ({
        value: data._id,
        label: data.subcategory,
      }))
    : [];

  // Fetching single subcategory for adding nested cat input
  useEffect(() => {
    if (filterBySubcategory) {
      instance
        .get(
          `/api/category/get_singlesubcategory?subCategoryId=${filterBySubcategory}`
        )
        .then((response) => {
          const nestedCategory = response.data?.nestedCategories || [];
          setNestedCategories(nestedCategory);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [filterBySubcategory]);

  // Function to handle nested category change
  const handleNestedCategoryChange = (e) => {
    setSelectedNest(e.target.value);
    // setSelectedNestedCategory(e.value);
    // setFilterByNestedCategory(e.value);
    setFilterCollection({
      ...filterCollection,
      ["NestedCategory"]: e.label,
    });
  };

  const nestedCategoryOptions = nestedCategories.map((data) => ({
    value: data._id,
    label: data.nestedCat,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border:
        state.isFocused || state.isSelected
          ? "1px solid #ccc"
          : "1px solid #ccc",
      borderRadius: "4px",
      boxShadow: state.isFocused ? "0 0 0 1px #ccc" : null,
      "&:hover": {
        border: "1px solid #ccc", // Remove border on hover
      },
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px solid #ccc", // Example border for options
      backgroundColor: state.isSelected ? "#2684FF" : provided.backgroundColor,
      color: state.isSelected ? "white" : provided.color,
    }),
  };

  // Location Fetching
  useEffect(() => {
    try {
      instance
        .get(`/api/user/filter/search_state`)
        .then((response) => {
          SetStates(response.data.states);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const StateOptions = States.map((state) => ({
    value: state.state_id,
    label: state.state_name,
  }));

  useEffect(() => {
    try {
      instance
        .get(
          `/api/user/filter/search_state?districtCode=${filterByState?.value}`
        )
        .then((response) => {
          SetDistrict(response.data.districts);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }, [filterByState]);

  const DistrictOptions = District
    ? District.map((data) => ({
        value: data.district_id,
        label: data.district_name,
      }))
    : [];

  // Handle Price Filter
  const HandlePriceFilter = (e) => {
    e.preventDefault();

    const minPrice = filterByMinPrice !== "" ? filterByMinPrice : "";
    const maxPrice = filterByMaxPrice !== "" ? filterByMaxPrice : "";

    onMin(minPrice);
    onMax(maxPrice);
    setFilterCollection({ ...filterCollection, minPrice, maxPrice });
  };

  const HandleInputSearch = (e) => {
    e.preventDefault();
    otherSelectedFilter(selectedOption);
    setFilterCollection({ ...filterCollection, ...selectedOption });
  };

  const HandleRangeSearch = (e, label, rangeMax) => {
    const updatedLabel = typeof label === "object" ? label.en : label;
    e.preventDefault();

    // Check if minValue and maxValue are null, set them to 0 by default
    const min = minValue !== "" ? minValue : 0;
    const max = maxValue !== "" ? maxValue : parseInt(rangeMax);

    const rangeValue = `${min} - ${max}`;

    if (filterCollection[label] !== undefined) {
      // If data exists, set it to null
      setFilterCollection((prevFilterCollection) => ({
        ...prevFilterCollection,
        [updatedLabel]: null,
      }));
    }

    const filterCollectionData = {
      [updatedLabel]: rangeValue,
    };

    const rangeData = {
      [updatedLabel]: {
        min: min,
        max: max,
      },
    };

    otherSelectedFilter(rangeData);
    setFilterCollection((prevFilterCollection) => ({
      ...prevFilterCollection,
      ...filterCollectionData,
    }));
    setSelectedOption((prevSelectedOption) => ({
      ...prevSelectedOption,
      ...filterCollectionData,
    }));
  };

  const HandleClearAll = (e) => {
    e.preventDefault();
    setSelectedOption({});
    setFilterBySubcategory(null);
    setFilterByMinPrice("");
    setFilterByMaxPrice("");
    setFilterByState(null);
    setFilterByDistrict(null);
    setFilterCollection({});
    setMinValue("");
    setMaxValue("");
    setNestedCategories([]);
    setCombinedFilters([]);
    load();
    setFilterBySubcategory([]);
  };

  const handlecategoryToggle = () => {
    SetCategoryToggle(!CategoryToggle);
    SetNestedCategoryToggle(!NestedCategoryToggle);
  };

  const handleSubcategoryChange = (value, Data) => {
    setFilterBySubcategory(value);
    fetchSubcatfilter(value);
    onChangeSubcategory(value);
    setFilterCollection({
      ...filterCollection,
      Category:
        typeof Data.label === "object" ? Data.label[i18n.language] : Data.label,
    });
  };

  const handleRadioChange = (filterLabel, optionValue) => {
    setSelectedOption({
      ...selectedOption,
      [filterLabel]: optionValue, // Store using the English filter label
    });

    otherSelectedFilter({
      [filterLabel]: optionValue, // Update the payload using the English filter label
    });

    setFilterCollection({
      ...filterCollection,
      [filterLabel]: optionValue, // Ensure the English filter label is used in the state
    });
  };

  return (
    <div className={Style.Container}>
      <div className={Style.top}>
        <div className={Style.filterDiv}>
          <div className={Style.headingDiv}>
            <FaFilter className={Style.icon} />
            <h3>{t("filter")}</h3>
          </div>
          <div className={Style.clearDiv} onClick={(e) => HandleClearAll(e)}>
            <span>{t("clear_all")}</span>
          </div>
        </div>

        {Object.entries(filterCollection).length !== 0 && (
          <div className={Style.selectedFilterDiv}>
            {Object.entries(filterCollection).map(([key, value]) => {
              return (
                <div className={Style.wrap} key={key}>
                  <h5> {value} </h5>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={Style.bottom}>
        <div className={Style.accordion}>
          <div className={Style.accordion_item}>
            <div className={Style.titleDiv} onClick={handlecategoryToggle}>
              <h3 style={{ fontWeight: "inherit", color: "black" }}>
                {t("subcategory")}
              </h3>
              <span>
                {CategoryToggle ? <AiOutlineMinus /> : <AiOutlinePlus />}{" "}
              </span>
            </div>
            <div
              className={CategoryToggle === true ? Style.show : Style.content}
            >
              <div className={Style.items}>
                {subcategoryOptions.map((Data, index) => {
                  return (
                    <div className={Style.radioField_wrapper} key={index}>
                      <input
                        type="radio"
                        name="Category"
                        id={Data.label}
                        value={Data.value}
                        checked={filterBySubcategory === Data.value}
                        onChange={(e) =>
                          handleSubcategoryChange(e.target.value, Data)
                        }
                      />
                      <label htmlFor={Data.label}>{getLabel(Data.label)}</label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={Style.items}>
              {filterBySubcategory && nestedCategories.length > 0 && (
                <div
                  className={Style.nestedCategoryContainer}
                  style={{
                    backgroundColor: "white",
                    paddingInline: "10px",
                    gap: "10px",
                  }}
                >
                  <h4 style={{ fontWeight: "inherit", color: "black" }}>
                    {t("nested_categories")}
                  </h4>
                  {nestedCategories.map((nestedData, nestedIndex) => (
                    <div
                      className={Style.radioField_wrapper}
                      key={nestedIndex}
                      style={{
                        padding: "5px",
                        display: "flex",
                        justifyContent: "start",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="radio"
                        name="NestedCategory"
                        id={nestedData._id}
                        value={nestedData._id}
                        checked={nestSelected === nestedData._id}
                        onChange={handleNestedCategoryChange}
                      />
                      <label htmlFor={nestedData._id}>
                        {typeof nestedData.nestedCat === "object"
                          ? nestedData.nestedCat[i18n.language] // Dynamically access translation based on current language
                          : nestedData.nestedCat}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {combinedFilters.map((FilterData, index) => {
            if (FilterData.type === "text") {
              return (
                <div className={Style.accordion_item} key={index}>
                  <div className={Style.titleDiv}>
                    <h3>{getLabel(FilterData.label)}</h3>
                  </div>
                  <div className={Style.inputContent}>
                    <div className={Style.inputFields}>
                      <div className={Style.field_wrapper}>
                        <input
                          type={FilterData.type}
                          name={FilterData.label}
                          placeholder={FilterData.label.toLowerCase()}
                          value={selectedOption[FilterData.label] || ""}
                          onChange={(e) => {
                            setSelectedOption({
                              ...selectedOption,
                              [FilterData.label]: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className={Style.field_searchBtn}>
                        <button
                          onClick={(e) => {
                            HandleInputSearch(e);
                          }}
                        >
                          {" "}
                          <FiSearch />{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          {combinedFilters.map((FilterData, index) => {

            if (FilterData.type === "checkbox") {
              const filterLabel =
                typeof FilterData.label == "object"
                  ? FilterData.label?.en
                  : FilterData.label || ""; // Safely access 'en', fallback to an empty string if undefined
              const UpdatedLabel = getLabel(FilterData.label); // Get translated label for display

              return (
                <div className={Style.accordion_item} key={index}>
                  <div className={Style.titleDiv}>
                    <h3>{UpdatedLabel}</h3>
                  </div>
                  <div className={Style.inputContent}>
                    <div className={Style.radioFields}>
                    {FilterData.options.map((Data, index) => {
  // Log the data to debug issues

  // Check if the label is an object or a direct value
  const value = typeof Data === "object" 
    ? Data.label.en || "" // Use the 'en' value if it's an object
    : Data || "";   // Use the direct value if it's not an object

  // Get the option label for display (translated if the label is an object)
  const optionLabel = typeof Data === "object"
    ? getLabel(Data.label)
    : Data; // Directly use the label if it's not an object


  return (
    <div className={Style.radioField_wrapper} key={index}>
      <input
        type="checkbox"
        id={value}
        name={value}
        value={value}
        checked={CheckboxOptions.some(
          (item) =>
            item.value === value &&
            item.label === filterLabel
        )}
        onChange={(e) => {
          const isSelected = e.target.checked;

          SetCheckboxOptions((prevItems) => {
            const updatedOptions = isSelected
              ? [
                  ...prevItems,
                  { value, label: filterLabel },
                ]
              : prevItems.filter(
                  (item) =>
                    item.value !== value ||
                    item.label !== filterLabel
                );

            // Separate the values for each filter
            const filterOptions = updatedOptions
              .filter((item) => item.label === filterLabel)
              .map((item) => item.value);

            // Update state with the English filter label as the key
            const newFilterCollection = {
              ...filterCollection,
              [filterLabel]: filterOptions, // Use the English filter label as the key
            };

            setFilterCollection(newFilterCollection);
            setSelectedOption({
              ...selectedOption,
              [filterLabel]: filterOptions, // Update with the selected values using the English filter label as the key
            });

            otherSelectedFilter(newFilterCollection); // Pass the updated collection directly

            return updatedOptions;
          });
        }}
      />
      <label htmlFor={value}>{optionLabel}</label> {/* Display the translated label */}
    </div>
  );
})}

                    </div>
                  </div>
                </div>
              );
            }
          })}

          {combinedFilters.map((filterData, index) => {
            if (filterData && filterData.type === "radio") {
              const label = filterData.label.en; // Use the English label for the filter

              return (
                <div className={Style.accordion_item} key={index}>
                  <div className={Style.titleDiv}>
                    <h3>{label}</h3>
                  </div>
                  <div className={Style.inputContent}>
                    <div className={Style.radioFields}>
                      {filterData.options.map((singleOption, index) => {
                        const optionLabel = typeof singleOption === "object" ?singleOption.label.en : singleOption.label// Use the English label for the option

                        return (
                          <div className={Style.radioField_wrapper} key={index}>
                            <input
                              type="radio"
                              id={label + "_" + index} // Unique id for each radio button
                              name={label}
                              value={optionLabel}
                              checked={selectedOption[label] === optionLabel}
                              onChange={
                                () => handleRadioChange(label, optionLabel) // Pass the English labels
                              }
                            />
                            <label htmlFor={label + "_" + index}>
                              {optionLabel} {/* Display the English label */}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
          })}

          {combinedFilters.map((FilterData, index) => {
            if (FilterData.type === "range") {
              return (
                <div className={Style.accordion_item} key={index}>
                  <div className={Style.titleDiv}>
                    <h3>{getLabel(FilterData.label)}</h3>
                  </div>
                  <div className={Style.inputContent}>
                    <div className={Style.radioFields}>
                      <div className={Style.radioFields}>
                        {Object.entries(FilterData.options).map(
                          ([DataLabel, DataOption], index) => {
                            const updatedLabel =
                              typeof FilterData.label == "object"
                                ? FilterData.label.en
                                : FilterData.label;

                            // Check if DataOption is an object, and if so, get the translation for the current language
                            const translatedOption =
                              typeof DataOption === "object" &&
                              DataOption !== null
                                ? DataOption[i18n.language] || DataOption["en"] // Fallback to 'en' if current language is not available
                                : DataOption;

                            return (
                              <div
                                className={Style.radioField_wrapper}
                                key={index}
                              >
                                <input
                                  type="radio"
                                  id={DataLabel}
                                  name={FilterData.label}
                                  value={DataLabel}
                                  checked={
                                    selectedOption[FilterData.label] ===
                                    DataLabel
                                  }
                                  onChange={(e) => {
                                    setSelectedOption({
                                      ...selectedOption,
                                      [updatedLabel]: e.target.value,
                                    });
                                    otherSelectedFilter({
                                      [updatedLabel]: DataOption,
                                    });
                                    setFilterCollection({
                                      ...filterCollection,
                                      [updatedLabel]: e.target.value,
                                    });
                                  }}
                                />
                                <label htmlFor={DataLabel}>
                                  {getLabel(DataLabel)}
                                </label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className={Style.slider_wrapper}>
                      <p>{t("choose_range_from_between")}</p>
                      <div className={Style.slider_label}>
                        <span>
                          {minValue !== ""
                            ? minValue
                            : FilterData.defaultMinValue}
                        </span>
                        <span>
                          {maxValue !== ""
                            ? maxValue
                            : FilterData.defaultMaxValue}
                        </span>
                      </div>
                      <Tooltip title={tooltipText}>
                        <div className={Style.slider}>
                          <div className={Style.progress_wrap}>
                            <div className={Style.progress}> </div>
                          </div>
                          <div className={Style.rangeInput}>
                            <input
                              type="range"
                              className={Style.range_min}
                              min={FilterData.defaultMinValue}
                              max={FilterData.defaultMaxValue}
                              step={FilterData.stepValue}
                              value={
                                minValue !== ""
                                  ? minValue
                                  : parseInt(FilterData.defaultMinValue)
                              }
                              onChange={(e) =>
                                setMinValue(e.target.value.toString())
                              }
                              onMouseMove={(e) =>
                                setTooltipText(`Min Value: ${e.target.value}`)
                              }
                              onMouseOut={() => setTooltipText("")}
                            />
                            <input
                              type="range"
                              className={Style.range_max}
                              min={FilterData.defaultMinValue}
                              max={FilterData.defaultMaxValue}
                              step={FilterData.stepValue}
                              value={
                                maxValue !== ""
                                  ? maxValue
                                  : parseInt(FilterData.defaultMaxValue)
                              }
                              onChange={(e) =>
                                setMaxValue(e.target.value.toString())
                              }
                              onMouseMove={(e) =>
                                setTooltipText(`Max Value: ${e.target.value}`)
                              }
                              onMouseOut={() => setTooltipText("")}
                            />
                          </div>
                        </div>
                      </Tooltip>
                      <div className={Style.range_searchBtn}>
                        <button
                          onClick={(e) => {
                            HandleRangeSearch(
                              e,
                              FilterData.label,
                              FilterData.defaultMaxValue
                            );
                          }}
                        >
                          {t("apply")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          <div className={Style.accordion_item}>
            <div
              className={Style.titleDiv}
              onClick={() => SetLocationToggle(!LocationToggle)}
            >
              <h3>{t("location")}</h3>
              <span>
                {LocationToggle ? <AiOutlineMinus /> : <AiOutlinePlus />}{" "}
              </span>
            </div>
            <div
              className={LocationToggle === true ? Style.show : Style.content}
            >
              <div className={Style.onSelectField}>
                <div className={Style.items_wrapper}>
                  <div className={Style.item_Title}>
                    <h3>{t("state")}</h3>
                  </div>
                  <Select
                    options={StateOptions}
                    value={
                      filterByState
                        ? {
                            value: filterByState?.value,
                            label: filterByState?.label,
                          }
                        : null
                    }
                    onChange={(e) => {
                      setFilterByState(e);
                      onState(e.label);
                      setFilterCollection({
                        ...filterCollection,
                        ["State"]: e.label,
                      });
                    }}
                    styles={customStyles}
                  />
                </div>
                <div className={Style.items_wrapper}>
                  <div className={Style.item_Title}>
                    <h3>{t("district")}</h3>
                  </div>
                  <Select
                    options={DistrictOptions}
                    value={
                      filterByDistrict
                        ? {
                            value: filterByDistrict?.value,
                            label: filterByDistrict?.label,
                          }
                        : null
                    }
                    onChange={(e) => {
                      setFilterByDistrict(e);
                      onDistrict(e.label);
                      setFilterCollection({
                        ...filterCollection,
                        ["District"]: e.label,
                      });
                    }}
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={Style.accordion_item}>
            <div className={Style.titleDiv}>
              <h3>{t("price_range")}</h3>
            </div>
            <div className={Style.inputContent}>
              <div className={Style.inputFields}>
                <div className={Style.field_wrapper}>
                  <input
                    type="number"
                    placeholder="min"
                    value={filterByMinPrice}
                    onChange={(e) => setFilterByMinPrice(e.target.value)}
                  />
                </div>
                <div className={Style.seperation}>-</div>
                <div className={Style.field_wrapper}>
                  <input
                    type="number"
                    placeholder="max"
                    value={filterByMaxPrice}
                    onChange={(e) => setFilterByMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className={Style.searchBtn}>
                <button
                  onClick={(e) => {
                    HandlePriceFilter(e);
                  }}
                >
                  {t("search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
