import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Style from './index.module.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  
  const Languages = [
    { code: 'en', lang: 'English' },
    // { code: 'fr', lang: 'French' },
    { code: 'hi', lang: 'Hindi' },
    { code: 'ta', lang: 'Tamil' },
    { code: 'kn', lang: 'Kannada' },
    { code: 'te', lang: 'Telugu' },
    { code: 'ml', lang: 'Malayalam' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
  };

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <div className='container'>
      <select name="" id="" value={selectedLanguage} onChange={handleLanguageChange}>
        {Languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
