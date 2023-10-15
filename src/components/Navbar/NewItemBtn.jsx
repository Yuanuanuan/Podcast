
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PlusIcon from '../../icons/plus-icon.svg';

const NewItemBtn = () => {
  const { setIsCreate, deleteEpisode } = useContext(AuthContext);

  const handleIsCreate = () => {
    deleteEpisode('');
    setIsCreate(true);
  }

  return (
    <div className='new-item-btn' onClick={handleIsCreate}>
      <img src={PlusIcon} alt="plus-icon" />
      <span>新增分類</span>
    </div>
  )
}

export default NewItemBtn;