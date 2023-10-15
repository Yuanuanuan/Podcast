import { createContext, useState, useEffect } from "react";
import axios from "axios";

// import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const BASE_URL = 'https://spotify-backend.alphacamp.io';
  
  const [token, setToken] = useState('');
  const [userInfo, setUserInfo] = useState([])
  const [spotifyUserInfo, setSpotifyUserInfo] = useState(localStorage.getItem('spotifyUserInfo')? JSON.parse(localStorage.getItem('spotifyUserInfo')) : null);
  const [authToken, setAuthToken] = useState('');
  const [category, setCategory] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [nowEditId, setNowEditId] = useState(null);
  const [nowClickId, setNowClickId] = useState(sessionStorage.getItem('nowClickId'));
  const [inputValue, setInputValue] = useState('');

  const [selectEmoji, setSelectEmoji] = useState('');
  const [selectimgEmoji, setSelectEmojiimg] = useState(false);

  const [showId, setShowId] = useState('');

  const [nowPlayerId, setNowPlayerId] = useState(null);

  const handleEomjiSelect = (emoji) => {
    setSelectEmoji(emoji);
  }

  const handleSeletedEmoji = (e) => {
    setSelectEmojiimg(!selectimgEmoji);
  }

  const EditName = async({ id, name, authToken }) => {

    try{
      const res = await axios.put(`${BASE_URL}/api/categories/${id}`, {
        name: name,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      
      if (res.data.success) {
        await getCategory();
        setSelectEmoji('');
      }

    } catch (err) {
      console.error(err);
      setSelectEmoji('');
    }
  }
  
  // 拿取分類資料
  const getCategory = async() => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      setCategory(data.categories)
      window.localStorage.setItem('category', JSON.stringify(data.categories))

      if (sessionStorage.getItem('firstVisit') === 'true') {
        const item = data.categories.filter((item) => item.name === '🏘️ 我的Podcast')

        setNowClickId(item[0].id);
        sessionStorage.setItem('nowClickId', item[0].id);
        sessionStorage.setItem('firstVisit', false);
      }

    } catch (err) {
      console.error(err)
    }
  }

  // Use AuthToken To Get The Cast's User Info
  const getUserInfo = async() => {
    console.log('getUserInfo Start')
    const { data } = await axios.get(`${BASE_URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    setUserInfo(data)
    localStorage.setItem('userInfo', JSON.stringify(data))
    console.log('getUserInfo End')
    console.log(data)
    return data;
  }


  // 拿取該ID的資料
  const getNowItem = (id) => {

    if (id === 'favorite') {
      return 'This is a favorite podcast';
    }

    const value =(category
    .filter(item => item.id === id));

    return value[0];
  }

  const addShowsToCategory = async(id) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/categories/${id}/shows`, 
        {
          showId: showId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
        }
      )

      console.log(data);
      getCategory();
      return data;

    } catch (err) {
      console.error(err);
    }
  }

  // const Toast = Swal.mixin({
  //   toast: true,
  //   position: 'bottom-end',
  //   showConfirmButton: false,
  //   timer: 2000,
  //   width: '343px',
  //   showClass: {
  //     popup: 'animate__animated animate__fadeInUp'
  //   },
  //   hideClass: {
  //     popup: 'animate__animated animate__fadeOutDown'
  //   }
  // });

  const saveEpisode = async(id) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/episodes`, {
        episodeId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      // Toast.fire({
      //   icon: 'success',
      //   title: '成功加入收藏 😊'
      // })

      return data;

    } catch (err) {
      console.error(err);

      // Toast.fire({
      //   icon: 'error',
      //   title: '加入收藏失敗 😢'
      // })
    }
  } 

  const deleteEpisode = async(id) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/api/episodes/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      // Toast.fire({
      //   icon: 'success',
      //   title: '成功移除收藏 😊'
      // })

      return data;

    } catch (err) {
      console.error(err);
    }
  }

  const handleLove = async(e, id) => {
    if (!id) return;
    if (e.target.classList.contains('active')) {
      e.target.classList.remove('active');
      await deleteEpisode(id);
    } else {
      e.target.classList.add('active')
      await saveEpisode(id);
    }
    getUserInfo();
  }

  useEffect(() => {
    const storAuthToken = localStorage.getItem('authToken');
    const storToken = localStorage.getItem('token');
    const jsonUserInfo = localStorage.getItem('userInfo');
    const storUserInfo = JSON.parse(jsonUserInfo);
    const jsonCategory = localStorage.getItem('category');
    const storCategory = JSON.parse(jsonCategory);
    const storNowPlayerId = sessionStorage.getItem('nowPlayerId');

    if (storAuthToken) {
      setAuthToken(storAuthToken);
    }
    if (storCategory) {
      setCategory(storCategory);
    }
    if (storToken) {
      setToken(storToken);
    }
    if (storUserInfo) {
      setUserInfo(storUserInfo);
    }
    if (storNowPlayerId) {
      setNowPlayerId(storNowPlayerId);
    }

  }, [])

  return <AuthContext.Provider value={{
    // state
    token, setToken,
    userInfo, setUserInfo,
    spotifyUserInfo, setSpotifyUserInfo,
    authToken, setAuthToken,
    category, setCategory,
    isEdit, setIsEdit,
    isCreate, setIsCreate,
    isDelete, setIsDelete, 
    nowEditId, setNowEditId,
    selectEmoji, setSelectEmoji,
    selectimgEmoji,
    inputValue, setInputValue,
    nowClickId, setNowClickId,
    isAdd, setIsAdd,
    showId, setShowId,
    BASE_URL,
    nowPlayerId, setNowPlayerId,

    // function
    EditName,
    getCategory,
    getUserInfo,
    getNowItem,
    addShowsToCategory,
    handleSeletedEmoji, 
    handleEomjiSelect,
    handleLove,
    deleteEpisode,
  }}>
    {children}
  </AuthContext.Provider>
}