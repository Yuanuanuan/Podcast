import closeIcon from "../../icons/close.svg";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const EditModal = () => {
  const {
    authToken,
    isEdit,
    setIsEdit,
    nowEditId,
    EditName,
    selectEmoji,
    selectimgEmoji,
    setSelectEmoji,
    handleSeletedEmoji,
    handleEomjiSelect,
    inputValue,
    setInputValue,
    getNowItem,
  } = useContext(AuthContext);

  const value = getNowItem(nowEditId);

  const [isDisable, setIsDisable] = useState(true);

  const handleChange = async (e) => {
    await setInputValue(e.target.value);
  };

  useEffect(() => {
    if (inputValue.length === 0) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [inputValue]);

  const handleSave = async () => {
    let totalName;
    if (!inputValue) {
      setInputValue(value.name.split("").slice(2).join(""));
    }

    if (!selectEmoji) {
      totalName = value.name.split("").slice(0, 2).join("") + inputValue;
    } else {
      totalName = selectEmoji + inputValue;
    }

    EditName({ id: nowEditId, name: totalName, authToken: authToken });
    setIsEdit(false);
  };

  const handleClose = () => {
    setSelectEmoji("");
    setIsEdit(false);
  };

  return (
    <>
      {isEdit && (
        <div className="edit-modal-wrapper">
          <div className="edit-modal-banner">
            <div className="edit-modal-title">
              <div className="title-text">編輯名稱</div>
              <img
                src={closeIcon}
                alt="close-icon"
                className="title-icon"
                onClick={handleClose}
              />
            </div>
            <div className="edit-modal-content">
              <div className="emoji">
                <div onClick={handleSeletedEmoji} className="emoji-box">
                  <div>
                    {selectEmoji
                      ? selectEmoji
                      : value.name.split("").slice(0, 2)}
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
                  defaultValue={value.name.split("").slice(2).join("")}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="button">
                <button className="cancel" onClick={handleClose}>
                  取消
                </button>
                {isDisable ? (
                  <button className="save" onClick={handleSave}>
                    儲存
                  </button>
                ) : (
                  <button className="save disable">儲存</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModal;
