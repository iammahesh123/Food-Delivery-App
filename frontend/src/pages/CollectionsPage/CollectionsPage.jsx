import React from 'react'
import Collections from '../../components/Collections/Collections'
import { assets, restraunts_list } from '../../assets/assets';
import "./CollectionsPage.css"


const CollectionsPage = () => {
  return (
    <>
      <div className='collections-banner-container'>
        <img src={assets.christmas_img} alt="Collections Banner" className="collections-banner" />
      </div>
      <div className="collection-page">
        <Collections/>      
      </div>
    </>
  )
}

export default CollectionsPage
