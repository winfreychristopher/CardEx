import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar.js"
import HomeBanner from "./components/Carousel/SlideBanner.js"
import LeftNavBar from "./components/SideBar/SideBar.js";
import PlayingCards from "./components/Cards/Cards";
import { getAllCards } from "./api";

import "./App.css"


function App() {

  const [cards, setCards] = useState([]);
  const retrieveCards = () => {
    getAllCards()
      .then((card) => {
        console.log(card)
        setCards(card);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    retrieveCards();
  }, []);

  return (
    <div className="appContainer">
      <Navbar />
      <HomeBanner />
      <body>
        <LeftNavBar />
        <PlayingCards/>
      </body>
   
      {/* <h1>Hello World - CardEx</h1> */}
    </div>
  );
}

export default App;
