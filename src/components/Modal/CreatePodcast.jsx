import closeIcon from "../../icons/close.svg";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const BASE_URL = "https://spotify-backend.alphacamp.io";

const CreateModal = () => {
  const {
    authToken,
    isCreate,
    setIsCreate,
    getCategory,
    selectEmoji,
    setSelectEmoji,
    handleSeletedEmoji,
    handleEomjiSelect,
    selectimgEmoji,
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
    console.log(authToken);
  };

  const handleClose = () => {
    setSelectEmoji("");
    setIsCreate(false);
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/categories`,
        {
          name: (selectEmoji ? selectEmoji : "🎧") + "" + inputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setIsCreate(false);

      await getCategory();
      setSelectEmoji("");

      return res.data;
    } catch (err) {
      setIsCreate(false);
      console.error(err);
    }
  };

  return (
    <>
      {isCreate && (
        <div className="create-modal-wrapper">
          <div className="create-modal-banner">
            <div className="create-modal-title">
              <div className="title-text">新增分類</div>
              <img
                src={closeIcon}
                alt="close-icon"
                className="title-icon"
                onClick={handleClose}
              />
            </div>
            <div className="create-modal-content">
              <div className="emoji">
                <div onClick={handleSeletedEmoji} className="emoji-box">
                  <div>
                    {selectEmoji ? selectEmoji : "🎧"}
                    <div>
                      {selectimgEmoji && (
                        <Picker
                          data={data}
                          onEmojiSelect={(e) => handleEomjiSelect(e.native)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  onChange={(e) => handleChange(e)}
                  placeholder="請輸入分類名稱（前方可變更 emoji）"
                />
              </div>
              <div className="button">
                <button className="cancel" onClick={handleClose}>
                  取消
                </button>
                <button className="save" onClick={handleSave}>
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateModal;
