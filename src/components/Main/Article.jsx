import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import save from "../../icons/save-icon.svg";
import saved from "../../icons/filledsave.svg";

const Article = () => {
  const { token, nowPlayerId, userInfo, handleLove } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/episodes/${nowPlayerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(data);
        return data;
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [nowPlayerId, token]);

  return (
    <div className="article-wrapper-player">
      <div className="article-wrapper-banner">
        <div className="player-title">
          <div className="player-title-text">正在播放</div>
          {userInfo.favoriteEpisodeIds &&
          userInfo.favoriteEpisodeIds.some(
            (episode) => episode.id === nowPlayerId
          ) ? (
            <img
              src={saved}
              alt="saved-icon"
              className="save-icon active"
              onClick={(e) => handleLove(e, nowPlayerId)}
            />
          ) : (
            <img
              src={save}
              alt="save-icon"
              className="save-icon"
              onClick={(e) => handleLove(e, nowPlayerId)}
            />
          )}
        </div>
        <div className="player-content">
          <h1>{data.name}</h1>
          <h2>{data.description}</h2>
          <div id="iframe">
            {nowPlayerId && (
              <iframe
                title="spotify-iframe"
                src={`https://open.spotify.com/embed/episode/${nowPlayerId}?utm_source=generator&hideinfo=1`}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                loading="lazy"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
