import React from "react";
import { getAllCards } from "../../api/index";

import "../Cards/Card.css";

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

  console.log(cards);

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
      <div className="cardsContainer m-0 p-0 py-2 px-2 col-12 col-md-6 col-xl-4">
        <div className="card row m-0 p-0 h-100" key={index} >
          <div className="col-12 m-0 p-2 bg-white roundedGreyBorder h-100">
            <div className="imgCard">
              <img className="img-fluid objectfit pointer w-100" src={card_img} />
            </div>
            <div className="detailsCard">
              <h3> {card_title} </h3>
              <p> {description} </p>
              <ul>
                <li>Item #: <span>{id}</span></li>
                <li>Views: <span>{view_count}</span></li>   
                <li>Listing Date: <span>{creation_date}</span></li>
                <li>Price: <span>{price}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default PlayingCards;
