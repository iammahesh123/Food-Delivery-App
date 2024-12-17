import React from 'react'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import './MenuPage.css'; // Ensure the styles are imported

const MenuPage = () => {
  return (
    <div className="menu-page">
        <ExploreMenu/>
        <FoodDisplay />  
    </div>
  )
}

export default MenuPage
