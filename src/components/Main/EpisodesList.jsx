import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

import playIcon from "../../icons/play-icon.svg";
import saveIcon from "../../icons/save-icon.svg";
import savedIcon from "../../icons/filledsave.svg";

const EpisodesList = ({ item }) => {
  const { userInfo, handleLove, setNowPlayerId } = useContext(AuthContext);

  const gethours = () => {
    let seconds = Math.floor(item.duration_ms / 1000);
    let hours = Math.floor(seconds / 3600);
    let remainimgSecond = seconds % 3600;
    let minutes = Math.floor(remainimgSecond / 60);
    let second = Math.floor(remainimgSecond % 60);
    return { hours, minutes, second };
  };

  let time;

  if (item) {
    time = gethours();
  }

  const playEpisode = (e) => {
    setNowPlayerId(e.target.parentElement.parentElement.parentElement.id);
    sessionStorage.setItem(
      "nowPlayerId",
      e.target.parentElement.parentElement.parentElement.id
    );
  };

  return (
    <>
      {item && item.audio_preview_url ? (
        <div className="episode-item" id={item.id}>
          {userInfo.favoriteEpisodeIds &&
          userInfo.favoriteEpisodeIds.some(
            (episode) => episode.id === item.id
          ) ? (
            <img
              src={savedIcon}
              alt="saved-icon"
              className="save-icon active"
              onClick={(e) => handleLove(e, e.target.parentElement.id)}
            />
          ) : (
            <img
              src={saveIcon}
              alt="save-icon"
              className="save-icon"
              onClick={(e) => handleLove(e, e.target.parentElement.id)}
            />
          )}
          <div className="episode-item-image">
            <img src={item.images[1].url} alt="" />
          </div>
          <div className="episode-item-describe">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="describe-playbar">
              <img src={playIcon} alt="play-icon" onClick={playEpisode} />
              <div>{item.release_date}・</div>
              <div>
                {time.hours > 0 ? time.hours + " 小時 " : null}
                {time.minutes > 0 ? time.minutes + " 分 " : null}
                {time.second > 0 ? time.second + " 秒 " : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default EpisodesList;
