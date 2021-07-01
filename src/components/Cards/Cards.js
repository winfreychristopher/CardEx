import React from "react";
import { getAllCards } from "../../api/index";

import "../Cards/Card.css";




const PlayingCards = ({props}) => {
  const cards = getAllCards();
  console.log(cards)

  return cards.map((card, index) => {
    const { card_title } = card;
    return (
      <div className="cardsContainer">
        <div className="card" key={index}>
          <div className="imgCard" > 
            <img src="#" />
          </div>
          <div className="detailsCard">
            <h2> {card_title} </h2> 
            <p> </p>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    );
  });
};

export default PlayingCards;