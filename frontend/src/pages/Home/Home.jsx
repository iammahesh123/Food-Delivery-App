import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import Collections from '../../components/Collections/Collections'
import ProvideServices from '../../components/ProvideServices/ProvideServices'

const Home = () => {
  const [category, setCategory] = useState("All")
  return (
    <div>
      <Header />
      <ProvideServices />
      <Collections />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  )
}

export default Home
