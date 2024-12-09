import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Explore our menu and indulge in a variety of delicious dishes crafted to delight every palate. 
        Simply select your favorites and let us know about any special requests or dietary preferences
        - we’re here to ensure your meal is perfect. Enjoy every bite!</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index) =>
            { return (
                <div onClick={() => setCategory(prev => prev === item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-items">
                    <img className={category === item.menu_name?"active":""} src={ item.menu_image} alt=''/>
                    <p>{item.menu_name}</p>
                </div>
            )
            })}
        </div>
        <hr />
      
    </div>
  )
}

export default ExploreMenu
