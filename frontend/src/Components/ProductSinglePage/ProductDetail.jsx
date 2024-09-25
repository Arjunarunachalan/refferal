import React, { useContext, useEffect, useState } from "react";
import Style from "./Style.module.css";
import {
  IoLocationOutline,
  IoCallOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { BsChat, BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { MdRemoveShoppingCart } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { UserContext } from "../../Contexts/UserContext";
import authInstance from "../../instance/AuthInstance";
import Star from "../ReviewStars/Star";
import { toast } from "react-toastify";
import { PiCurrencyInrBold } from "react-icons/pi";
import { Blank_Profile } from "../../Assets/Constants";
import instance from "../../instance/AxiosInstance";
import { useTranslation } from "react-i18next";

const SampleNextArrow = (props) => {
  
  const { t,i18n } = useTranslation();
  const { onClick } = props;
  return (
    <div className={Style.control_btn} onClick={onClick}>
      <button className={Style.next}>
        <i>
          {" "}
          <BsChevronRight />{" "}
        </i>
      </button>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { t } = useTranslation();
  const { onClick } = props;
  return (
    <div className={Style.control_btn} onClick={onClick}>
      <button className={Style.prev}>
        <i>
          {" "}
          <BsChevronLeft />{" "}
        </i>
      </button>
    </div>
  );
};

const ProductDetail = ({
  ProductDet,
  ProductImages,
  OtherDet,
  ClientData,
  ClientImage,
  Reviews,
}) => {
  
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const { productId } = useParams();

  const LoggedInUser = useContext(UserContext);
  const { User } = LoggedInUser;

  const [WishlistData, SetWishlistData] = useState([]);
  const [IsClicked, SetIsClicked] = useState(false);
  const [ProductUserId, SetProductUserId] = useState("");
  const [SoldButtonToggle, SetSoldButtonToggle] = useState(false);

  useEffect(() => {

    
    if (ProductDet && ProductDet.userId && ProductDet.userId._id) {
      SetProductUserId(ProductDet.userId._id);
    }
  }, [ProductDet]);

  const loadWishlistData = () => {
    authInstance
      .get(`/api/user/wishlist/get_wishlist/${User?._id}`)
      .then((Response) => {
        SetWishlistData(Response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    try {
      authInstance
        .post("/api/user/wishlist/add_wishlist", {
          userId: User?._id,
          productId: ProductDet?._id,
        })
        .then((Response) => {
          SetIsClicked(true);
        })
        .catch((err) => {
          Navigate("/registration_login");
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const findItemId = () => {
    WishlistData.forEach((Data) => {
      const item = Data?.wishlist;
      const foundItem = item.find((item) => item?._id === productId);
      if (foundItem) {
        SetIsClicked(true);
      } else {
        SetIsClicked(false);
      }
    });
  };

  const handleFavoriteDelete = (e) => {
    e.preventDefault();
    try {
      authInstance
        .delete(`/api/user/wishlist/remove_wishlist/${User?._id}/${productId}`)
        .then((Response) => {
          SetIsClicked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const ConversationHandler = () => {
    try {
      if (User?._id !== ClientData?._id) {
        authInstance
          .post("/api/user/chat/createconversation", {
            senderId: User?._id,
            recieverId: ClientData?._id,
            productId: ProductDet?._id,
          })
          .then((response) => {
            Navigate(`/chat/${response.data?.savedConversation?._id}`);
          })
          .catch((err) => {
            Navigate("/registration_login");
            console.log(err);
          });
      } else {
        toast.error(t("chattingWithSelfError"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWishlistData();
  }, []);

  useEffect(() => {
    findItemId();
  }, [WishlistData, productId]);

  const settings = {
    infinite: true,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    autoplay: false,
    autoplaySpeed: 2500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const soldfunc = (e) => {
    e.preventDefault();
    try {
      authInstance.delete(
        `/api/user/product/product_sold?productId=${productId}&userId=${User?._id}`
      );
      toast.success(t("productMarkedAsUnavailable"));
      SetSoldButtonToggle(true);
    } catch (error) {
      console.log(error);
      toast.error(t("somethingWentWrong"));
    }
  };

  return (
    <div className={Style.Container}>
      <div className={Style.row}>
        <div className={Style.Left_container}>
          <div className={Style.image_wrapper}>
            <Slider {...settings}>
              {ProductImages.map((images, index) => {
                return (
                  <div className={Style.box} key={index}>
                    <div className={Style.img_Container}>
                      <img src={images?.url} alt="" />
                      <span
                        onClick={(e) =>
                          IsClicked
                            ? handleFavoriteDelete(e)
                            : handleFavoriteClick(e)
                        }
                        style={{ color: IsClicked ? "red" : "darkgray" }}
                      >
                        <AiFillHeart />
                      </span>
                      <p className={Style.img_index}>
                        {index + 1} / {ProductImages.length}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>

        <div className={Style.Right_container}>
          <div className={Style.Details}>
            <div>
              <h3>{ProductDet?.title}</h3>
              <h1>
                <PiCurrencyInrBold /> {ProductDet?.price}
              </h1>
            </div>
            <div className={Style.Rating}>
              <div>
                <Star stars={ClientData?.totalrating} />
              </div>
              <p>({Reviews?.length} {t("reviews")})</p>
            </div>
            <h5>
              <IoLocationOutline className={Style.icon} />
              <span>
                {ProductDet?.locality} / {ProductDet?.state}
              </span>
            </h5>
            <div className={Style.Button_wrapper}>
              <div className={Style.chat}>
                <button onClick={ConversationHandler}>
                  <BsChat />
                  <span>{t("chat")}</span>
                </button>
              </div>
              <div className={Style.call}>
                <button>
                  <IoCallOutline />
                  <span>{t("call")}</span>
                </button>
              </div>
              <div>
                {SoldButtonToggle ? (
                  <div className={Style.solded}>
                    <button>
                      <MdRemoveShoppingCart />
                      <span>{t("solded")}</span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={Style.delete}
                    onClick={soldfunc}
                    style={{
                      display: ProductUserId === User._id ? "block" : "none",
                    }}
                  >
                    <button>
                      <IoCheckmarkOutline />
                      <span>{t("sold")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={Style.row}>
        <div className={Style.Left_container}>
          <h3>{t("adDetails")}</h3>
          <div className={Style.Ad_detail}>
          <ul>
              {Object.entries(OtherDet).map(([key, value]) => {
                return (
                  <li key={key}>
                    <label>{t(key)} : </label>
                    <span>{value}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <h3>{t("description")}</h3>
          <div className={Style.des}>
            {ProductDet &&
              ProductDet.description &&
              ProductDet.description.split("\n").map((line, index) => {
                return <p key={index}>{line}</p>;
              })}
          </div>
        </div>

        <div className={Style.Right_containerBottom}>
          <div className={Style.seller}>
            <div
              className={Style.seller_wrapper}
              onClick={() => Navigate(`/clientprofile/${ClientData._id}`)}
            >
              <div>
                <img
                  src={ClientImage ? ClientImage : Blank_Profile}
                  className={Style.itemImg}
                  alt=""
                />
                <h3>
                  {ClientData?.showName
                    ? `${ClientData?.fullname}`
                    : ClientData.pseudoName}
                </h3>
              </div>
              <div>
                <span>
                  {" "}
                  <BsChevronRight />{" "}
                </span>
              </div>
            </div>

            <div className={Style.Id_wrap}>
              <label>{t("adId")} : </label>
              <span>{productId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
