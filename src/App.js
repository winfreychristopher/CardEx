import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import HomeBanner from "./components/Carousel/SlideBanner.js";
import LeftNavBar from "./components/SideBar/SideBar.js";
import PlayingCards from "./components/Cards/Cards";
import { LoginPage, AdminPage } from "./components/index.js";
import { getAllCards } from "./api";

import "./App.css";

const App = () => {

  const [cards, setCards] = useState([]);
  const retrieveCards = () => {
    getAllCards()
      .then((card) => {
        console.log(card);
        setCards(card);
        return card;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    retrieveCards();
  }, []);

  return (
    <Router>
        <Navbar />
      <Switch>
        <Route exact path="/">
        <div className="appContainer">
        
          <HomeBanner />
          <body>
            <LeftNavBar />
            <div className="cardsForSaleContainer row m-0 p-1">
              <PlayingCards cards={cards} setCards={setCards} reset={retrieveCards} />
            </div>
          </body>
        </div>
        </Route>
        <Route path="/register" component={LoginPage}>
        </Route>
        <Route path="/admin" component={AdminPage} />

      </Switch>
    </Router>

  );
}

export default App;
