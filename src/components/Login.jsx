import Carousel from "./Carousel";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

import logo from "../images/logo.svg";
import slide1Img from "../images/slide1Img.svg";
import slide2Img from "../images/slide2Img.svg";
import slide3Img from "../images/slide3Img.svg";
import slide1ImgShadow from "../images/slide1ImgShadow.svg";
import slide2ImgShadow from "../images/slide2ImgShadow.svg";
import slide3ImgShadow from "../images/slide3ImgShadow.svg";

const dummyItem = [
  { name: "🚌 通勤清單" },
  { name: "📚 學習清單" },
  { name: "💤 睡前清單" },
  { name: "🏘️ 我的Podcast" },
];

const Login = () => {
  const [slide, setSlide] = useState(1);
  const {
    setToken,
    authToken,
    setAuthToken,
    getUserInfo,
    setSpotifyUserInfo,
    getCategory,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const CLIENT_ID = process.env.REACT_APP_ClientId;
  // const REDIRECT_URI = "https://spotify-podcast.netlify.app";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const BASE_URL = "https://spotify-backend.alphacamp.io";

  // 用Spotify的Token來獲取AlphaCamp的Token
  const getAuthToken = async (token) => {
    try {
      const res = await axios.post(
        `https://spotify-backend.alphacamp.io/api/users`,
        {
          spotifyToken: `${token}`,
        }
      );
      const data = res.data;
      setAuthToken(data.token);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // 創建初始的資料夾
  const postDummyItem = async (item) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/categories`,
        {
          name: item.name,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  // 初始化使用者資料夾
  const postAllDummyItems = async () => {
    if (sessionStorage.getItem("firstVisit") === true) {
      try {
        for (const item of dummyItem) {
          await postDummyItem(item);
        }
      } catch (err) {
        console.error(err);
      } finally {
        getCategory();
      }
    }
  };

  // 獲取 Spotify 的使用者資訊
  const getSpotifyUserInfo = async (token) => {
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.localStorage.setItem("spotifyUserInfo", JSON.stringify(data));
      setSpotifyUserInfo(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 獲取Spotify token
  // 將Spotify token設在localstorage
  // 用Spotify token獲取Alpha token
  // 獲取spotify使用者資訊
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      getAuthToken(token);
      sessionStorage.setItem("firstVisit", true);
      getSpotifyUserInfo(token);
    }

    setToken(token);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 將Alpha token設在localStorage
  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem("authToken", authToken);
      // 初始化資料夾
      // 獲取Alpha使用者資訊
      // 獲取使用者的分類
      postAllDummyItems();
      getUserInfo();
      getCategory();
      // 導向主頁
      return navigate("/home");
    }
    // 如果沒有獲取到Alpha token就重新導向Login頁面
    return navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  return (
    <>
      <div className="login-wrapper">
        <img src={logo} alt="logo" className="logo" />
        <h2>Connecting Stories That Matter</h2>
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          className="connect-spotify"
        >
          使用SPOTIFY帳號登入
        </a>
        <h3>
          沒有帳號嗎?
          <a
            href="https://www.spotify.com/tw/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F"
            target="_blank"
            rel="noreferrer"
          >
            註冊帳號
          </a>
        </h3>
        <h4>Copyright 2023</h4>
      </div>
      {slide === 1 ? (
        <Carousel
          img={slide1Img}
          imgShadow={slide1ImgShadow}
          title={"鼓舞人心的故事"}
          describe={"從非凡的人生故事和成功經歷中獲得靈感"}
          slide={slide}
          setSlide={setSlide}
          className="carousel-wrapper1"
        />
      ) : slide === 2 ? (
        <Carousel
          img={slide2Img}
          imgShadow={slide2ImgShadow}
          title={"輕鬆分類與管理"}
          describe={"一目了然的分類，讓收藏的 Podcast 保持整潔"}
          slide={slide}
          setSlide={setSlide}
          className="carousel-wrapper2"
        />
      ) : slide === 3 ? (
        <Carousel
          img={slide3Img}
          imgShadow={slide3ImgShadow}
          title={"Spotify 快速同步"}
          describe={"透過 Spotify 登入，即刻同步您的收藏，隨時隨地收聽"}
          slide={slide}
          setSlide={setSlide}
          className="carousel-wrapper3"
        />
      ) : null}
    </>
  );
};

export default Login;
