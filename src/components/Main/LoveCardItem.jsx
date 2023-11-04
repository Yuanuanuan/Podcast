import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import EpisodesList from "./EpisodesList";

const LoveCardItem = ({ item }) => {
  const { token } = useContext(AuthContext);
  const [episodesData, setEpisodesData] = useState([]);

  useEffect(() => {
    const dataArray = [];
    const getEpisodes = async (id) => {
      try {
        const { data } = await axios.get(
          `https://api.spotify.com/v1/episodes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dataArray.push(data);
        return data;
      } catch (err) {
        console.error(err);
      }
    };

    if (Array.isArray(item)) {
      const episodePromises = item.map((episode) => getEpisodes(episode.id));

      Promise.all(episodePromises)
        .then((episodeDataArray) => {
          // 過濾可能因錯誤而為空的資料
          const filteredEpisodeDataArray = episodeDataArray.filter(
            (data) => data !== null
          );

          // 更新狀態以包含所有集數資料
          setEpisodesData(filteredEpisodeDataArray);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [item, token]);

  return (
    <div className="love-card-item">
      {episodesData &&
        episodesData.map((episodedata, index) => (
          <EpisodesList key={index} item={episodedata} />
        ))}
    </div>
  );
};

export default LoveCardItem;
