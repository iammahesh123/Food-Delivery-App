import React, { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import RestaurantsItems from './RestaurantsItems'

const RestaurantsDisplay = ({ category }) => {
    const { restaurants_data } = useContext(StoreContext)
    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-list">
                {restaurants_data && restaurants_data.length > 0 ? (
                    restaurants_data.map((item, index) => {
                        if (!category || category === "All" || category === item.category) {
                            return (
                                <RestaurantsItems
                                    key={index}
                                    id={item._id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    image={item.image}
                                    address={item.address}
                                />
                            );
                        }
                        return null;    
                    })
                ) : (
                    <p>No dishes available at the moment.</p>
                )}
            </div>

        </div>
    )
}

export default RestaurantsDisplay
