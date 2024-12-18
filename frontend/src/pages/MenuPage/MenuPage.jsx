import React from 'react'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

import MenuHeader from '../../components/MenuHeader/MenuHeader'

const MenuPage = () => {
  return (
    <div>
      <MenuHeader />
      <ExploreMenu />
      <FoodDisplay />
    </div>
  )
}

export default MenuPage
