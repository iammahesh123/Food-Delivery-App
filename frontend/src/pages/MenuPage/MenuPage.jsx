import React from 'react'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import './MenuPage.css'

const MenuPage = () => {
  return (
    <div className='menu-page'>
      {/* <MenuHeader /> */}
      <ExploreMenu />
      <FoodDisplay />
    </div>
  )
}

export default MenuPage
