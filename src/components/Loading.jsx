import loadingIcon from "../icons/loading-icon.svg";

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <img src={loadingIcon} alt="" className="loading-icon" />
    </div>
  );
};

export default Loading;
