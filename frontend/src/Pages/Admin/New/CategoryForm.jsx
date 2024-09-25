import React, { useState } from 'react'
import Style from './Style.module.css'
import Header from '../../../Components/AdminComponents/Header/Header';
import Sidebar from '../../../Components/AdminComponents/Sidebar/Sidebar'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import adminInstance from '../../../instance/AdminInstance';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';



const New = ({ title }) => {
  const Languages = [
    { code: 'en', lang: 'English' },
    { code: 'fr', lang: 'French' },
    { code: 'hi', lang: 'Hindi' },
    { code: 'ta', lang: 'Tamil' },
    { code: 'kn', lang: 'Kannada' },
    { code: 'te', lang: 'Telugu' },
    { code: 'ml', lang: 'Malayalam' }
  ];


  const navigate = useNavigate()

  const [category, Setcategory] = useState({
      en: "",
      fr: "",
      hi: "",
      ta: "",
      kn: "",
      te: "",
      ml: ""
  });

  const [File, SetFile] = useState({
    File: "",
    FileUrl: "",
    Caption: ""
  });

  const uploadFile = (e) => {

    SetFile({
      ...File, FileUrl: URL.createObjectURL(e.target.files[0]),
      File: e.target.files[0]
    });

  }


  const handleTranslationChange = (langCode, value) => {
    Setcategory(prevState => ({
      ...prevState,
      [langCode]: value
    }));
  };

const HandleSubmit = (e)=>{
  e.preventDefault();
let data = new FormData()
data.append("file",File.File);
data.append("category",JSON.stringify(category));

adminInstance.post("/api/super_admin/category/add_category",data,{
  headers:{'Content-Type':'multipart/form-data'},
}).then((Response)=>{
  toast.success("Successfully Created");
  navigate('/admin/category');
   // Reset the form
   Setcategory({
      en: "",
      fr: "",
      hi: "",
      ta: "",
      kn: "",
      te: "",
      ml: ""
  });
  SetFile({
    File: "",
    FileUrl: "",
    Caption: ""
  });
}).catch((err)=>{
  toast.error("Something went Wrong")
})

}
 

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
                  value={lang[lang.code]}
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

export default New;