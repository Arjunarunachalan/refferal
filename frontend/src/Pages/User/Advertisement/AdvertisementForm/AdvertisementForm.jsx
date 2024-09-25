import React, { useContext, useEffect, useState } from 'react';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import Select from 'react-select';
import Style from "./Style.module.css";
import { UserContext } from '../../../../Contexts/UserContext';
import instance from '../../../../instance/AxiosInstance';
import authInstance from '../../../../instance/AuthInstance';
import { CategoryContext } from '../../../../Contexts/CategoryContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingSpin from "react-loading-spin";
import { useTranslation } from 'react-i18next';

const AdvertisementForm = () => {
  const { t } = useTranslation();
  const Navigate = useNavigate();

  const [ProductData, SetProductData] = useState({
    title: "",
    description: "",
    redirectionUrl:"",
    locality: "",
    district: "",
    state: "",
    region: "",
    advSize:"",
    category:"",
    subCategory:""
  });

  const [File, SetFile] = useState([]);
  const [Error, SetError] = useState({
    imagefile: ""
  });

  const [IsLocalityDisabled, SetIsLocalityDisabled] = useState(true);
  const [States, SetStates] = useState([]);
  const [StateId, SetStateId] = useState("");
  const [District, SetDistrict] = useState([]);
  const [DistrictId, SetDistrictId] = useState("");
  const [Locality, SetLocality] = useState([]);
  const [CatSelecter, SetCatSelecter] = useState([]);
  const [SubCatSelecter, SetSubCatSelecter] = useState([]);
  const [loading, setLoading] = useState(false);

  const LoggedInUser = useContext(UserContext);
  const { User } = LoggedInUser;

  const categories = useContext(CategoryContext);
  const { Categories } = categories;

  useEffect(() => {
    let Cats = [];
    Categories.map((eachCategories) => {
      Cats.push({ value: eachCategories._id, label: eachCategories.categoryName });
    });
    SetCatSelecter([...CatSelecter, ...Cats]);
  }, []);

  const catSelector = (e) => {
    SetProductData({ ...ProductData, category: e.value });
    instance.get(`/api/category/get_singlecategory?categoryId=${e.value}`).then((response) => {
      let SubCats = [];
      response.data.subcategory.map((eachSubCategories) => {
        SubCats.push({ value: eachSubCategories._id, label: eachSubCategories.subcategory });
      });
      SetSubCatSelecter([SubCatSelecter, ...SubCats]);
    });
  };

  useEffect(() => {
    try {
      instance.get(`/api/user/filter/search_state`).then((response) => {
        SetStates(response.data.states);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const StateOptions = States.map((state) => ({
    value: state.state_id,
    label: state.state_name
  }));

  useEffect(() => {
    try {
      instance.get(`/api/user/filter/search_state?districtCode=${StateId}`).then((response) => {
        SetDistrict(response.data.districts);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }, [StateId]);

  const DistrictOptions = District ? District.map((data) => ({
    value: data.district_id,
    label: data.district_name
  })) : [];

  useEffect(() => {
    try {
      instance.get(`/api/user/filter/search_locality?district=${DistrictId}`).then((response) => {
        SetLocality(response.data);
      }).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }, [DistrictId]);

  const LocalityOptions = Locality ? Locality.map((data) => ({
    value: data.village_locality_name,
    label: data.village_locality_name
  })) : [];

  const options = [
    { value: "2", label: t("2x_size") },
    { value: "3", label: t("3x_size") },
    { value: "4", label: t("4x_size") }
  ];

  const uploadFile = (e) => {
    const files = e.target.files;
    if (File.length < 1) {
      SetFile([...File, ...files]);
      SetError({ ...Error, imgfile: "" });
    } else {
      SetError({ ...Error, imgfile: t("image_error") });
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = new FormData();
    File.forEach((file) => {
      data.append("files", file);
    });
    data.append("title", ProductData.title);
    data.append("subcategory", ProductData.subCategory);
    data.append("category", ProductData.category);
    data.append("userId", User?._id);
    data.append("locality", ProductData.locality);
    data.append("district", ProductData.district);
    data.append("state", ProductData.state);
    data.append("region", ProductData.region);
    data.append("featured", User?.premiumuser);
    data.append("redirectionUrl", ProductData.redirectionUrl);
    data.append("advSize", ProductData.advSize);

    setLoading(true);
    authInstance.post('/api/user/advertisement/add_new_adv', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response) => {
      setLoading(false);
      toast.success("Product Added Successfully");
      Navigate('/');
      SetProductData({
        title: "",
        description: "",
        redirectionUrl: "",
        locality: "",
        district: "",
        state: "",
        region: "",
        advSize: "",
        category: "",
        subCategory: ""
      });
    }).catch((err) => {
      setLoading(false);
      toast.error("Something Went Wrong");
    });
  };

  return (
    <div className={Style.Main_Container}>
      <div className={Style.Container_Wrapper}>
        <form action="#" onSubmit={handleSubmit}>
          <div className={Style.row}>
            <label>{t("title")}<span className="star">*</span></label>
            <div className={Style.items}>
              <input
                type="text"
                name="title"
                value={ProductData.title}
                onChange={(e) => {
                  SetProductData({ ...ProductData, title: e.target.value });
                }}
                required
              />
              <p>{t("key_features")}</p>
            </div>
          </div>

          <div className={Style.row}>
            <label>{t("redirection_url")}<span className="star">*</span></label>
            <div className={Style.items}>
              <input
                type="text"
                name="title"
                value={ProductData.redirectionUrl}
                onChange={(e) => {
                  SetProductData({ ...ProductData, redirectionUrl: e.target.value });
                }}
                required
              />
              <p>{t("key_features")}</p>
            </div>
          </div>

          <div className={Style.row}>
            <label>{t("advertisement_size")}</label>
            <div>
              <Select
                options={options}
                name="Advertisement Size"
                onChange={(e) => {
                  SetProductData({ ...ProductData, advSize: e.value });
                }}
                required
              />
            </div>
          </div>

          <div className={Style.row}>
            <label>{t("category")}</label>
            <div>
              <Select
                options={CatSelecter}
                name="Category"
                onChange={catSelector}
                required
              />
            </div>
          </div>

          {ProductData.category === "" ? null : (
            <div className={Style.row}>
              <label>{t("subcategory")}</label>
              <div>
                <Select
                  options={SubCatSelecter}
                  name="SubCategory"
                  onChange={(e) => {
                    SetProductData({ ...ProductData, subCategory: e.value });
                  }}
                  required
                />
              </div>
            </div>
          )}

          <div className={Style.row}>
            <label>{t("images")}<span className="star">*</span></label>
            <div className={Style.image_wrapper}>
              <label htmlFor="file-input">
                <MdOutlineAddAPhoto />
              </label>
              <input
                type="file"
                onChange={(e) => uploadFile(e)}
                id="file-input"
                required
              />
              {File.map((eachImage, index) => (
                <div key={index} className={Style.image_sec}>
                  <img
                    src={eachImage ? URL.createObjectURL(eachImage) : null}
                    alt={`image ${index}`}
                  />
                  <div className={Style.clearbtn}>
                    <button>
                      <RxCross2 onClick={() => { SetFile([]); }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <span style={{ color: "red", fontSize: "14px" }}>
                {Error?.imgfile}
              </span>
            </div>
            <div>
              <p>{t("upload_image")}</p>
            </div>
          </div>

          <div className={Style.row}>
            <label>{t("country")}<span className="star">*</span></label>
            <Select
              options={[{ value: "india", label: t("india") }]}
              onChange={(e) => {
                SetProductData({ ...ProductData, region: e.value });
              }}
            />
            <span>{Error.country}</span>
          </div>

          <div className={Style.location_wrap}>
            <div className={Style.row}>
              <label>{t("state")}<span className="star">*</span></label>
              <Select
                options={StateOptions}
                isSearchable={true}
                onChange={(e) => {
                  SetProductData({ ...ProductData, state: e.label });
                  SetStateId(e.value);
                }}
              />
              <span>{Error.state}</span>
            </div>

            {District && District.length > 0 && (
              <div className={Style.row}>
                <label>{t("district")}<span className="star">*</span></label>
                <Select
                  options={DistrictOptions}
                  onChange={(e) => {
                    SetProductData({ ...ProductData, district: e.label });
                    SetDistrictId(e.label);
                    SetIsLocalityDisabled(false);
                  }}
                />
                <span>{Error.district}</span>
              </div>
            )}
          </div>

          <div className={Style.location_wrap}>
            {Locality && Locality.length > 0 && (
              <div className={Style.row}>
                <label>{t("locality")}<span className="star">*</span></label>
                <Select
                  options={LocalityOptions}
                  isDisabled={IsLocalityDisabled}
                  onChange={(e) => {
                    SetProductData({ ...ProductData, locality: e.value });
                  }}
                />
                <span>{Error.locality}</span>
              </div>
            )}
          </div>
          <div className={Style.submit_section}>
            <button>
              {loading ? (
                <LoadingSpin size="20px" direction="alternate" width="4px" />
              ) : (
                t("add_advertisement")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertisementForm;
