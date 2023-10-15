import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const NavItem = ({ id, title, className, handleClickItem }) => {
  const [toggleTools, setToggleTools] = useState(false);
  const { 
    setIsEdit,
    setNowEditId,
    setIsDelete,
    setInputValue,
    getNowItem,
    setIsAdd,
    nowClickId,
  } = useContext(AuthContext);

  // Change the active class to the current button
  const handleToggle = (e) => {
    e.stopPropagation();
    setToggleTools(!toggleTools);
  }

  // 打開編輯畫面
  const handleIsEdit = (elem) => {
    setNowEditId(elem.dataset.id)
    const value = getNowItem(elem.dataset.id)
    setInputValue(value.name.split('').slice(2).join(''))
    setIsEdit(true);
  }
  // 打開刪除畫面
  const handleIsDelete = (elem) => {
    setNowEditId(elem.dataset.id)
    setIsDelete(true);
  }
  // 打開新增Podcast畫面
  const handleIsAdd = (elem) => {
    setNowEditId(elem.dataset.id)
    // 儲存從工具列打開
    sessionStorage.setItem('addShowsType', 'tools');
    setIsAdd(true);
  }


  return (
    <div className={id === nowClickId ?`${className} nav-item` : 'nav-item'} onClick={(e) => handleClickItem(e)} id={id}>
      <h3>
        {title}
      </h3>
      <div className="nav-item-icon" onClick={(e) => handleToggle(e)} >
        <svg width="20" height="21" viewBox="0 0 20 21" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_37_4935)">
            <path d="M9.99998 7.16671C10.9166 7.16671 11.6666 6.41671 11.6666 5.50004C11.6666 4.58337 10.9166 3.83337 9.99998 3.83337C9.08331 3.83337 8.33331 4.58337 8.33331 5.50004C8.33331 6.41671 9.08331 7.16671 9.99998 7.16671ZM9.99998 8.83337C9.08331 8.83337 8.33331 9.58337 8.33331 10.5C8.33331 11.4167 9.08331 12.1667 9.99998 12.1667C10.9166 12.1667 11.6666 11.4167 11.6666 10.5C11.6666 9.58337 10.9166 8.83337 9.99998 8.83337ZM9.99998 13.8334C9.08331 13.8334 8.33331 14.5834 8.33331 15.5C8.33331 16.4167 9.08331 17.1667 9.99998 17.1667C10.9166 17.1667 11.6666 16.4167 11.6666 15.5C11.6666 14.5834 10.9166 13.8334 9.99998 13.8334Z" fill="#718096" fillOpacity="0.5"/>
</g>
<defs>
<clipPath id="clip0_37_4935">
<rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
</clipPath>
</defs>
        </svg>
        {toggleTools && 
        (<div className="nav-item-tools" data-id={id} >
          <div onClick={(e) => handleIsEdit(e.target.parentElement)} >編輯名稱</div>
          <div onClick={(e) => handleIsDelete(e.target.parentElement)} >刪除分類</div>
          <div onClick={(e) => handleIsAdd(e.target.parentElement)}>新增Podcast</div>
        </div>)}
      </div>
    </div> 
  )
}

export default NavItem;