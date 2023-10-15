


import NavItem from "./NavItem";
import NewItemBtn from "./NewItemBtn";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const NavList = () => {
  const { category,setNowClickId } = useContext(AuthContext);
  const categorySort = category.sort((a, b) => a.id - b.id);

  // Add the active class to the current button
  const handleClickItem = (e) => {
    const navItems = document.querySelectorAll('.nav-item')

    if (e.target.classList.contains('nav-item')) {
      navItems.forEach(item => item.classList.remove('active'))
      e.target.classList.toggle('active')
    }
    
    setNowClickId(e.target.id);
    sessionStorage.setItem('nowClickId', e.target.id);
  }

  useEffect(() => {
    const navItems = document.querySelectorAll('.nav-item')

    navItems.forEach((item) => {
      if (item.id === sessionStorage.getItem('nowClickId')) {
        item.classList.add('active')
      }
    })
    
  },[])

  return (
    <>
      <div className="nav-list">
        {categorySort.length > 0 && category.map((data) => {
          return <NavItem 
          key={data.id}
          id={data.id} 
          title={data.name}
          className='active'
          handleClickItem={handleClickItem}
          />
        })}
          <div className="nav-item" id='favorite' onClick={(e) => handleClickItem(e)} >
            <h3>❤️ 已收藏</h3>
          </div>
      </div>
      <NewItemBtn />
    </>
  )
}

export default NavList;