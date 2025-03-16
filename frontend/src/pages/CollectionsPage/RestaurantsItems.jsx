import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const RestaurantsItems = ({ id, name, rating, description, image,address }) => {

    const {cartItems,addToCart,removeFromCart,restaurants_data} = useContext(StoreContext);

    return (
        <div className='food-item'>
            <div className="food-item-container">
                <img className='food-item-image' src={image} alt="" />
                {/* {
                    !cartItems[id] ? <img className='add' onClick={()=> addToCart(id)} src = {assets.add_icon_white} alt="" />
                    : <div className="food-item-counter">
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[id]}</p>
                        <img onClick={()=>addToCart(id)}  src={assets.add_icon_green } alt="" />
                    </div>
                } */}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-description">
                    {description}
                </p>
                {/* <p className="food-item-price">
                    ${price}
                </p> */}
                <p>{address}</p>
            </div>

        </div>
    )
}

export default RestaurantsItems  