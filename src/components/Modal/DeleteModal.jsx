import closeIcon from "../../icons/close.svg";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://spotify-backend.alphacamp.io";

const DeleteModal = () => {
  const {
    authToken,
    isDelete,
    setIsDelete,
    nowEditId,
    setNowEditId,
    category,
    getCategory,
  } = useContext(AuthContext);

  const value = category
    .filter((item) => item.id === nowEditId)
    .map((item) => item.name);

  const handleClose = () => {
    setIsDelete(false);
  };

  const handleSave = async (e) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/categories/${nowEditId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setNowEditId(null);
      setIsDelete(false);
      await getCategory();
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isDelete && (
        <div className="delete-modal-wrapper">
          <div className="delete-modal-banner">
            <div className="delete-modal-title">
              <div className="title-text">刪除分類</div>
              <img
                src={closeIcon}
                alt="close-icon"
                className="title-icon"
                onClick={handleClose}
              />
            </div>
            <div className="delete-modal-content">
              <div className="content-title">
                你確定要繼續刪除<span> {value} </span>分類嗎?
              </div>
              <div className="button">
                <button className="cancel" onClick={handleClose}>
                  取消
                </button>
                <button className="save" onClick={handleSave}>
                  刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
