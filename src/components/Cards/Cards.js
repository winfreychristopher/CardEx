import React from "react";

import "../Cards/Card.css";




const PlayingCards = ({cards}) => {
  

  return cards.map((card, index) => {
    const { title } = card;
    return (
      <div className="cardsContainer">
        <div className="card" key={index}>
          <div className="imgCard" > 
            <img src="#" />
          </div>
          <div className="detailsCard">
            <h2> {} </h2> 
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