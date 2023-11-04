import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import LearnMore from "../Modal/LearnMore";

const MainCardItem = ({ showId }) => {
  const { token } = useContext(AuthContext);
  const [searchData, setSearchData] = useState(null);
  const [learnMore, setLearnMore] = useState(false);
  const [showsData, setShowsData] = useState(null);
  const [showsEpisode, setShowsEpisode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/shows/${showId.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSearchData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [showId, token]);

  const getShowsData = async (id) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/shows/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getShowsEpisodes = async (id) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/shows/${id}/episodes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        }
      );

      setShowsEpisode(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async (e) => {
    setIsLoading(true);
    setLearnMore(true);
    await getShowsData(e.target.parentElement.parentElement.dataset.id);
    await getShowsEpisodes(e.target.parentElement.parentElement.dataset.id);
    setIsLoading(false);
  };

  return (
    <>
      {searchData && (
        <div className="card-item" data-id={searchData.id}>
          <div className="card-img">
            <img src={searchData.images[1].url} alt="" />
          </div>
          <div className="card-info">
            <h2>{searchData.name}</h2>
            <h3>{searchData.publisher}</h3>
            <button onClick={(e) => handleClick(e)}>更多</button>
            {learnMore ? (
              <LearnMore
                setLearnMore={setLearnMore}
                showsData={showsData}
                showsEpisode={showsEpisode}
                isLoading={isLoading}
              />
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MainCardItem;
