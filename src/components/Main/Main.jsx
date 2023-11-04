import MainCardItem from "./MainCardItem";
import Article from "./Article";
import NothingOnMain from "./NothingOnMain";
import Loading from "../Loading";

import arrowDown from "../../icons/arrow-down.svg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import LoveCardItem from "./LoveCardItem";

const Main = () => {
  const time = new Date().getHours();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const { spotifyUserInfo, getNowItem, nowClickId, userInfo } =
    useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const value = await getNowItem(nowClickId);
      if (value === "This is a favorite podcast") {
        const data = userInfo.favoriteEpisodeIds;
        setItem(data);
        setLoading(false);
        return;
      }

      setItem(value);
      setLoading(false);
    };

    fetchData();
  }, [getNowItem, nowClickId, userInfo.favoriteEpisodeIds]);

  return (
    <div className="main">
      <div className="main-wrapper">
        <div className="main-wrapper-title">
          {time >= 5 && time < 12
            ? "早安"
            : time >= 12 && time < 18
            ? "午安"
            : "晚安"}
        </div>
        {loading ? (
          <Loading />
        ) : nowClickId === "favorite" ? (
          item && item.length > 0 ? (
            <div className="love-card-list">
              {item && <LoveCardItem item={item} />}
            </div>
          ) : (
            <NothingOnMain
              title="您尚未收藏任何Podcast"
              className="display-none"
            />
          )
        ) : item &&
          Array.isArray(item.savedShows) &&
          item.savedShows.length > 0 ? (
          <div className="card-list">
            {item.savedShows.map((showId, index) => (
              <MainCardItem key={index} showId={showId} />
            ))}
          </div>
        ) : (
          <NothingOnMain title="您尚未加入任何Podcast，可以點擊按鈕新增!" />
        )}
      </div>
      <div className="article-wrapper">
        <div className="article-wrapper-title">
          {spotifyUserInfo && (
            <>
              <img
                src={spotifyUserInfo.images[0].url}
                alt="userImage"
                className="article-user-image"
              />
              <div className="article-user-name">
                {spotifyUserInfo.display_name}
              </div>
              <img src={arrowDown} alt="arrow" className="article-arrow-icon" />
            </>
          )}
        </div>
        <Article />
      </div>
    </div>
  );
};

export default Main;
