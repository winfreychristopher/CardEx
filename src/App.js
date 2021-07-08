import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import HomeBanner from "./components/Carousel/SlideBanner.js";
import LeftNavBar from "./components/SideBar/SideBar.js";
import PlayingCards from "./components/Cards/Cards";
import Cart from "./components/Cart/Cart"
import { LoginPage, AdminPage } from "./components/index.js";
import { getAllCards, userLogin, getToken } from "./api";


import "./App.css";

const App = () => {
  useEffect(() => {
    document.title = `CardEX\u2122 - US`;
  }, []);

  // useEffect(() => {
  //   if (getToken()) {
  //     setAuth(true);
  //   }
  //   userLogin()
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch(console.error);
  // }, []);

  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [errMsgText, setErrMsgText] = useState("");
  const [authenticate, setAuth] = useState(false);

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
          <body className="frontContainer">
            <LeftNavBar />
            <div className="cardsForSaleContainer row m-0 p-1">
              <PlayingCards cards={cards} setCards={setCards} reset={retrieveCards} />
            </div>
          </body>
        </div>
        </Route>
        <Route path="/register">
          <LoginPage />
        </Route>
        <Route path="/cart">
          <Cart />
          
        </Route>
        <Route path="/admin" component={AdminPage} />

      </Switch>
      <footer style={{height: "200px"}}></footer>
    </Router>

  );
}

export default App;
