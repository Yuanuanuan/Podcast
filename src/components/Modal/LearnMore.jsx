import EpisodesList from "../Main/EpisodesList";
import closeIcon from "../../icons/close.svg";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Loading from "../Loading";

const LearnMore = ({
  setLearnMore,
  showsData,
  showsEpisode,
  id,
  isLoading,
}) => {
  const { authToken, BASE_URL, nowClickId, getCategory } =
    useContext(AuthContext);

  const handleClose = () => {
    setLearnMore(false);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/categories/${nowClickId}/shows/${showsData.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setLearnMore(false);
      getCategory();

      return data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="learn-more-wrapper">
      <div className="learn-more-banner">
        <img
          src={closeIcon}
          alt="close-icon"
          className="close-icon"
          onClick={handleClose}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {showsData && (
              <div className="learn-more-title">
                <button className="delete-btn" onClick={handleDelete}>
                  刪除
                </button>
                <div className="title-image">
                  <img src={showsData.images[1].url} alt="cover-images" />
                </div>
                <div className="title-describe">
                  <h3>{showsData.name}</h3>
                  <h4>{showsData.name}</h4>
                  <p>{showsData.description}</p>
                </div>
              </div>
            )}
            <div className="learn-more-episode-item">
              <div className="episode-items">
                {showsEpisode &&
                  showsEpisode.items.map((item) => (
                    <EpisodesList key={item.id} item={item} />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LearnMore;
