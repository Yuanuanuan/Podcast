const CardItem = ({ item, onClick }) => {
  return (
    <>
      {item.name && (
        <div className="card-item" onClick={onClick} data-id={item.id}>
          <div className="card-img">
            <img src={item.images[1].url} alt="" />
          </div>
          <div className="card-info">
            <h2>{item.name}</h2>
            <h3>{item.publisher}</h3>
            <button>更多</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardItem;
