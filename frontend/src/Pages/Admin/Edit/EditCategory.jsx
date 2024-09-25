import React, { useState, useEffect } from 'react';
import Style from './Style.module.css';
import Header from '../../../Components/AdminComponents/Header/Header';
import Sidebar from '../../../Components/AdminComponents/Sidebar/Sidebar';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import adminInstance from '../../../instance/AdminInstance';
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = ({ title }) => {
  const Languages = [
    { code: 'en', lang: 'English' },
    { code: 'fr', lang: 'French' },
    { code: 'hi', lang: 'Hindi' },
    { code: 'ta', lang: 'Tamil' },
    { code: 'kn', lang: 'Kannada' },
    { code: 'te', lang: 'Telugu' },
    { code: 'ml', lang: 'Malayalam' }
  ];

  const { categoryId } = useParams();
  const navigate = useNavigate();

  //updateable cat
  const [categoryData,setcategoryData] = useState(  {en:"",
    fr:"",
    hi:"",
    ta:"",
    kn:"",
    te:"",
    ml:""
   })

  const [CategoryDet, SetCategoryDet] = useState();

  const [File, SetFile] = useState({
    File: "",
    FileUrl: "",
    Caption: ""
  });

  useEffect(() => {
    // Fetch category details when component mounts
    adminInstance.get(`/api/super_admin/category/get_singlecategory?categoryId=${categoryId}`)
      .then((res) => {
        console.log(res.data,"res data"); 
        SetCategoryDet(res.data);
        console.log(  typeof(res.data.categoryName) , "DATATYPE");
        if(typeof(res.data.categoryName) === "object"){
          console.log("its an object ",); 
          setcategoryData (res.data.categoryName)
        }else{
          console.log("not an object");
          
         setcategoryData ( {
          en:res.data.categoryName,
          fr:"",
          hi:"",
          ta:"",
          kn:"",
          te:"",
          ml:""
         })
        }
        // Assuming the response data includes a file URL that you might want to set
        if (res.data.FileUrl) {
          SetFile(prevState => ({
            ...prevState,
            FileUrl: res.data.FileUrl
          }));
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch category details");
      });
  }, [categoryId]);
  

  const uploadFile = (e) => {
    SetFile({
      ...File,
      FileUrl: URL.createObjectURL(e.target.files[0]),
      File: e.target.files[0]
    });
  };

  const handleTranslationChange = (langCode, value) => {
    setcategoryData(prevState => ({
      ...prevState,
      [langCode]: value
    }));
  };

  const HandleSubmit = (e) => {
    e.preventDefault();

    if (categoryData) {
      let data = new FormData();
      data.append("file", File.File);
      data.append("CategoryDet", JSON.stringify(categoryData));
      data.append("categoryId", categoryId);

      adminInstance.put("/api/super_admin/category/update_category", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((Response) => {
        toast.success("Successfully Updated");
        navigate('/admin/category');
      }).catch((err) => {
        console.log('Error updating category:', err);
        toast.error("Something Went Wrong");
      });
    } else {
      toast.error("Category details cannot be empty");
    }
  };


  return (
    <div className={Style.new}>
      <Sidebar />
      <div className={Style.newContainer}>
        <Header />
        <div className={Style.top}>
          <h1>{title}</h1>
        </div>
        <div className={Style.bottom}>
          <div className={Style.left}>
            <img
              src={
                File.FileUrl
                  ? File.FileUrl
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className={Style.right}>
            <form onSubmit={HandleSubmit}>
              <div className={Style.formInput}>
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={uploadFile}
                  style={{ display: "none" }}
                />
              </div>

              {Languages.map(lang => (
                <div key={lang.code} className={Style.formInput}>
                  <label>{lang.lang} Name</label>
                  <input
                    type="text"
                    placeholder={`Category name in ${lang.lang}`}
                    value={categoryData[lang.code] || ""}
                    onChange={(e) => handleTranslationChange(lang.code, e.target.value)}
                  />
                </div>
              ))}

              <div className={Style.formBtn}>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/admin/category')}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
