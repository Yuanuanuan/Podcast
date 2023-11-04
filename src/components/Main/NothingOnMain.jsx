import fileIcon from "../../icons/file-icon.svg";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const NothingOnMain = ({ title, className }) => {
  const { setIsAdd } = useContext(AuthContext);
  const handleClick = () => {
    sessionStorage.setItem("addShowsType", "item");
    setIsAdd(true);
  };

  return (
    <div className="nothing-main">
      <img src={fileIcon} alt="file_image" className="nothing-main-img" />
      <h3 className="nothing-main-title">{title}</h3>
      <button className={`${className} nothing-main-btn`} onClick={handleClick}>
        新增Podcast
      </button>
    </div>
  );
};

export default NothingOnMain;
