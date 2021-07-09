import React, { useState } from "react";
import { getAllCards } from "../../api/index";

import "../Cards/Card.scss";

const PlayingCards = ({cards, setCards, reset}) => {
  // // const cards = getAllCards();
  // let cards;
  // const getCards = async () => {
  //   try {
  //     cards = await getAllCards();
  //     console.log(cards + "I'M HERERE")
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  // getCards();

  const handleTags = async (tagName) => {
    try {
      const tagReturn = await getAllCards(tagName);
      setCards(tagReturn);
    } catch (err) {
      console.err(err);
    }
  };
  const handleReset = () => {
    reset();
  };
  
  // document.querySelectorAll('.add-to-cart-button').forEach(function(addToCartButton) {
  //   addToCartButton.addEventListener('click', function() {
  //       addToCartButton.classList.add('added');
  //       setTimeout(function(){
  //           addToCartButton.classList.remove('added');
  //       }, 2000);
  //   });
  // });


  const addToCartButton = document.getElementById("add-to-cart-button");

  const addBtnAnimation = (e) => {
    e.target.classList.add('added');
    setTimeout(function() {
      e.target.classList.remove('added');
    }, 1000);
  }
  
  // const [isActive, setActive] = useState("false");
  // const handleToggle = () => {
  //   setActive(!isActive);
  // };

  return cards.map((card, index) => {
    const { 
      card_title, 
      card_img,
      creation_date,
      description,
      id,
      price,
      view_count
    } = card;

    return (
      <div className="rootContainer ">
        <div className="cardContainer" key={index}>
          <div className="imgCard col-5 m-0 px-1">
            <img className="img-fluid objectfit pointer" src={card_img} alt="Trading Card" />
          </div>
          <div className="detailsCard col-md-6 col-7">
            <h4> {card_title} </h4>
            <div className="desc"> "{description}" </div>
            
            <div className="itemInfo ">
              <div>Stock-ID #: <i>0000{id}</i></div>
              <div>Watchers: <b>{view_count}</b></div>   
              {/* <li>Listing Date: <span>{creation_date}</span></li> */} 
            </div>
            <div className=" prices ">
              <div className="col ">
                <h4 className="m-0 font-weight-bold">
                  <div >${price}</div>
                </h4>
              </div>
              <div className="row m-0 p-0 font-weight-bold">1 in stock</div>
            </div>
          </div>
        </div>
        <div className="cartButtons"
          onClick={(e) => {addBtnAnimation(e)}}  
        >
          <button id="add-to-cart-button"
            onClick={(e) => {addBtnAnimation(e)}}
          >
            <svg class="add-to-cart-box box-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="2" fill="#ffffff"/></svg>
            <svg class="add-to-cart-box box-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="2" fill="#ffffff"/></svg>
            <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <svg class="tick" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"/></svg>
            <span class="add-to-cart">Add to cart</span>
            <span class="added-to-cart">Added to cart</span>
          </button>
        </div>
      </div>
    );
  });
};

export default PlayingCards;
