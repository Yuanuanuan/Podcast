import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import closeIcon from "../../icons/close.svg";
import searchIcon from "../../icons/search-icon.svg";
import axios from "axios";
import CardItem from "../Main/CardItem";
import Loading from "../Loading";

const AddNewPodcast = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canAddPodcast, setCanAddPodcast] = useState(false);
  const {
    isAdd,
    setIsAdd,
    token,
    setShowId,
    category,
    userInfo,
    nowClickId,
    nowEditId,
    addShowsToCategory,
  } = useContext(AuthContext);

  const handleClose = () => {
    setSearchResult([]);
    setIsAdd(false);
    console.log(userInfo);
    console.log(category);
  };

  const handleChange = async (e) => {
    if (e.target.value.length === 0) {
      setSearchResult([]);
      setSearching(false);
      setIsLoading(false);
      setCanAddPodcast(false);
      return;
    } else {
      setSearching(true);
      setIsLoading(true);
    }

    setCanAddPodcast(false);

    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: e.target.value,
          type: "show",
          limit: 50,
        },
      });

      setSearchResult(data.shows.items);
      setIsLoading(false);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (e) => {
    const CardItems = document.querySelectorAll(".card-item");

    if (e.target.classList.contains("card-item")) {
      CardItems.forEach((item) => item.classList.remove("active"));
      e.target.classList.add("active");
    }

    setCanAddPodcast(true);
    setShowId(e.target.dataset.id);
  };

  const handleSave = async () => {
    setSearchResult([]);
    setIsAdd(false);
    if (sessionStorage.getItem("addShowsType") === "item") {
      addShowsToCategory(nowClickId);
    }
    if (sessionStorage.getItem("addShowsType") === "tools") {
      addShowsToCategory(nowEditId);
    }
  };

  return (
    <>
      {isAdd ? (
        <div className="add-podcast-wrapper">
          <div className="add-podcast-banner">
            <div className="add-podcast-title">
              <h1 className="title-text">新增Podcast</h1>
              <img
                src={closeIcon}
                alt="close-icon"
                className="title-icon"
                onClick={handleClose}
              />
            </div>
            <div className="add-podcast-content">
              <div className="search-bar">
                <div className="search-icon">
                  <img src={searchIcon} alt="search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="開始搜尋..."
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="search-result-wrapper">
                {searching ? (
                  <>
                    {isLoading && <Loading />}
                    {!isLoading && searching ? <h2>搜尋結果</h2> : null}
                    <div className="search-card-list">
                      {searchResult &&
                        searchResult.map((item, index) => (
                          <CardItem
                            key={index}
                            item={item}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            onClick={(e) => handleClick(e)}
                          />
                        ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div className="add-podcast-btn">
              <button className="cancel" onClick={handleClose}>
                取消
              </button>
              {canAddPodcast ? (
                <button className="save" onClick={handleSave}>
                  確認新增
                </button>
              ) : (
                <button className="save disable" onClick={handleSave}>
                  確認新增
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddNewPodcast;
