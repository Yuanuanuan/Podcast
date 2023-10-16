/* eslint-disable jsx-a11y/anchor-is-valid */
import Carousel from './Carousel';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

import logo from '../images/logo.svg';
import slide1Img from '../images/slide1Img.svg';
import slide2Img from '../images/slide2Img.svg';
import slide3Img from '../images/slide3Img.svg';
import slide1ImgShadow from '../images/slide1ImgShadow.svg';
import slide2ImgShadow from '../images/slide2ImgShadow.svg';
import slide3ImgShadow from '../images/slide3ImgShadow.svg';

// const dummyItem = [
//   { name: '🚌 通勤清單' },
//   { name: '📚 學習清單'},
//   { name: '💤 睡前清單'},
//   { name: '🏘️ 我的Podcast'},
// ]

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
  // const REDIRECT_URI = 'https://spotify-podcast.netlify.app/';
  const REDIRECT_URI = 'http://localhost:3001';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  // href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}

  const BASE_URL = 'https://spotify-backend.alphacamp.io';


  const authorize = async () => {
    const clientId = process.env.clientId;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const profile = await fetchProfile(accessToken);
        console.log(profile);
        // populateUI(profile);
    }

    async function redirectToAuthCodeFlow(clientId) {
      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      localStorage.setItem("verifier", verifier);

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", "http://localhost:3001");
      params.append("scope", "user-read-private user-read-email");
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);

      window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    function generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    async function generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    async function getAccessToken(clientId, code) {
      const verifier = localStorage.getItem("verifier");

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", "http://localhost:3001");
      params.append("code_verifier", verifier);

      const result = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
      });

      const { access_token } = await result.json();
      console.log(access_token);
      return access_token;
    }

    async function fetchProfile(token) {
      const result = await fetch("https://api.spotify.com/v1/me", {
          method: "GET", headers: { Authorization: `Bearer ${token}` }
      });

      return await result.json();
    }
  }

  // Use Spotify Token To Get The AuthToken
  const getAuthToken = async(token) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/users`, {
        spotifyToken: token,
      })
      console.log(data);
      setAuthToken(data.token);
      return data;

    } catch (err) {
      console.log(err)
    }
  }

  // create a dummyItem categories

  // const postDummyItem = async(item) => {
  //   try {
  //     const res = await axios.post(`${BASE_URL}/api/categories`, {
  //       name: item.name,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`
  //       }
  //     })

  //     return res.data;

  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  
  // const postAllDummyItems = async () => {
  //   if (sessionStorage.getItem('firstVisit') === true) {
  //     try {
  //       for (const item of dummyItem) {
  //         await postDummyItem(item);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       getCategory();
  //     }
  //   }
  // }

  // Use Spotify Token To Get The Spotify's User Info
  const getSpotifyUserInfo = async(token) => {
    const { data } = await axios.get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    window.localStorage.setItem('spotifyUserInfo', JSON.stringify(data))
    console.log(data)
    setSpotifyUserInfo(data)
  }

  // Set the token to localStorage & Get AuthToken
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash
      .substring(1)
      .split("&")
      .find(elem => elem.startsWith("access_token"))
      .split("=")[1]

      window.location.hash = ''
      window.localStorage.setItem('token', token)
      getAuthToken(token);
      sessionStorage.setItem('firstVisit', true)
      getSpotifyUserInfo(token)
    }
    
    setToken(token);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set the AuthToken to localStorage
  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem('authToken', authToken)
      // Get Cast's User Info
      // postAllDummyItems();
      getUserInfo();
      getCategory();
      // Guide to HomePage
      return navigate('/home');
    }
    // If !AuthToken, Guide to LoginPage
    return navigate('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  return (
    <>
      <div className="login-wrapper">
        <img src={logo} alt="logo" className='logo'/>
        <h2>Connecting Stories That Matter</h2>
          <a className='connect-spotify' onClick={authorize}>
            使用SPOTIFY帳號登入</a>
        <h3>沒有帳號嗎?
          <a href='https://www.spotify.com/tw/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F' target='_blank' rel="noreferrer">
            註冊帳號
          </a>
        </h3>
        <h4>Copyright 2023</h4>
      </div>
      {slide === 1 ? 
      <Carousel 
      img={slide1Img} 
      imgShadow={slide1ImgShadow} 
      title={'鼓舞人心的故事'} 
      describe={'從非凡的人生故事和成功經歷中獲得靈感'} 
      slide={slide} 
      setSlide={setSlide}  className='carousel-wrapper1' />
       : 
       slide === 2 ? 
       <Carousel 
       img={slide2Img} 
       imgShadow={slide2ImgShadow} 
       title={'輕鬆分類與管理'} 
       describe={'一目了然的分類，讓收藏的 Podcast 保持整潔'} slide={slide} 
       setSlide={setSlide}  
       className='carousel-wrapper2' />
        : 
        slide === 3 ? 
        <Carousel 
        img={slide3Img} 
        imgShadow={slide3ImgShadow}
        title={'Spotify 快速同步'} 
        describe={'透過 Spotify 登入，即刻同步您的收藏，隨時隨地收聽'} 
        slide={slide} 
        setSlide={setSlide}  
        className='carousel-wrapper3' />
         : 
         null}
    </>
  )
}

export default Login;