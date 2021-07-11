import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import HomeBanner from "./components/Carousel/SlideBanner.js";
import LeftNavBar from "./components/SideBar/SideBar.js";
import PlayingCards from "./components/Cards/Cards";
import Cart from "./components/Cart/Cart";
import { LoginPage, AdminPage } from "./components/index.js";
import {
  getAllCards,
  userLogin,
  parseUserToken,
  getCart,
} from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

const App = () => {
  useEffect(async () => {
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

  const notifyWelcome = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
  const notifyWelcomeWarn = (message) => {
    toast.warn(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
  const notifySignup = () =>
    toast.success("Sign Up Successful, redirecting to Home Page!", {
      position: toast.POSITION.TOP_CENTER,
    });
  const notifyLogin = () =>
    toast.success("Welcome back King or Queen, redirecting to Home Page!", {
      position: toast.POSITION.TOP_CENTER,
    });
  const notifyLogout = () =>
    toast.warn("Logged out Successfully, redirecting to Login Page!", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  const token = localStorage.getItem("CardEXtoken");
  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [errMsgText, setErrMsgText] = useState("");
  const [authenticate, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [userDATA, setUserDATA] = useState({});

  // useEffect(() => {
  //   async function fetchData() {
      
  //     // console.log(userDATA);
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {

    retrieveCards();
    async function fetchData() {
      if (token) {
        setIsLoggedIn(true);
        const response = await parseUserToken();
        setUserDATA(response);
        const res = await getCart(userDATA.id, token);
        console.log(res, "APP Front End");
        setCart(res);
      } else {
        const isPrevUser = localStorage.getItem("CardExGuest");
        if (!isPrevUser) {
          notifyWelcome(
            `Welcome, to the Nation's largest Card Trading platform! 
              Founded in 2021 in the heart of Baton Rouge, LA!`
          );
          notifyWelcomeWarn(
            `Our site is still going through some Home Improvements but we 
            look forward to serving you the best we can progress.`
          );
          const guestToken = 'Thank you for visting CardEX-US';
          localStorage.setItem("CardExGuest", guestToken);
        }
        const guestCart = localStorage.getItem("CardEXGCart");
        const parsedCart = JSON.parse(guestCart);
        if (guestCart) {
          setCart(parsedCart);
        }
      }
    }
    fetchData();
  }, [userDATA]);

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

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        logoutAnim={notifyLogout}
        userDATA={userDATA}
        setUserDATA={setUserDATA}
      />
      <ToastContainer />
      <Switch>
        <Route exact path="/">
          <div className="appContainer">
            <HomeBanner />
            <body className="frontContainer">
              <LeftNavBar />
              <div className="cardsForSaleContainer r">
                <PlayingCards
                  cards={cards}
                  setCards={setCards}
                  reset={retrieveCards}
                  cart={cart}
                  setCart={setCart}
                  userDATA={userDATA}
                />
              </div>
            </body>
          </div>
        </Route>
        <Route path="/register">
          <LoginPage
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            setUserDATA={setUserDATA}
            userDATA={userDATA}
            notifySignup={notifySignup}
            notifyLogin={notifyLogin}
          />
        </Route>
        <Route path="/cart">
          <Cart cart={cart} setCart={setCart} userDATA={userDATA} />
        </Route>
        <Route path="/admin" component={AdminPage} />
      </Switch>
    </Router>
  );
};

export default App;
