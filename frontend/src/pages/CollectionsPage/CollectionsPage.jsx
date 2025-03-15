import React, { useState, useEffect } from 'react';
import Collections from '../../components/Collections/Collections';
import { assets } from '../../assets/assets';
import "./CollectionsPage.css";

const CollectionsPage = () => {
  // ✅ Step 1: Initialize state as null
  const [collectionData, setCollectionData] = useState(null);

  // ✅ Step 2: Define mock data (used initially)
  const mockData = {
    bannerImage: assets.christmas_img,
    title: "Potato Collections",
    subtitle: "Order Your Favourite Food Here",
    description: `Explore our diverse menu, crafted to delight every palate. 
    Featuring a delectable array of dishes, our offerings are thoughtfully prepared 
    with the finest ingredients to ensure a memorable dining experience.`,
    tags: "9 "
  };

  useEffect(() => {
    // ✅ Step 3: Fetch dynamic data from backend
    const fetchData = async () => {
      try {
        const response = await fetch('https://your-api.com/get-banner'); // Replace with actual API
        const data = await response.json();

        if (data) {
          setCollectionData(data); // Update state with API data
        } else {
          setCollectionData(mockData); // Fallback to mock data
        }
      } catch (error) {
        console.error('Error fetching banner data:', error);
        setCollectionData(mockData); // Fallback to mock data in case of error
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='collections-banner-container'>
        {/* ✅ Step 4: Use optional chaining (?.) to avoid errors */}
        <img 
          src={collectionData?.bannerImage || mockData.bannerImage} 
          alt="Collections Banner" 
          className="collections-banner" 
        />
        <div className="collection-contents">
          <h4>{collectionData?.title || mockData.title}</h4> 
          <h2>{collectionData?.subtitle || mockData.subtitle}</h2> 
          <p>{collectionData?.description || mockData.description}</p> 
          <span className="collection-tags">{collectionData?.tags || mockData.tags}places</span> 
        </div>
      </div>
      <div className="collection-page">
        <Collections />      
      </div>
    </>
  );
};

export default CollectionsPage;
