import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.js";
import HomeBanner from "./components/Carousel/SlideBanner.js";
import LeftNavBar from "./components/SideBar/SideBar.js";
import PlayingCards from "./components/Cards/Cards";
import Cart from "./components/Cart/Cart";
import { LoginPage, AdminPage } from "./components/index.js";
import { CSSTransition } from 'react-transition-group'
import { ToastContainer, toast, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllCards,
  userLogin,
  parseUserToken,
} from "./api";


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

  const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
  });

  const notifyWelcome = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
      transition: bounce,
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
  const jwt = require("jsonwebtoken");

  const { REACT_APP_JWT_SECRET } = process.env;
  
  const userInfo = () => {
    if (token) {
      return jwt.verify(token, REACT_APP_JWT_SECRET);
    }
  } 
  console.log(token, "ayeeee")
  console.log(userInfo())
  


  const [cards, setCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [errMsgText, setErrMsgText] = useState("");
  const [authenticate, setAuth] = useState(false);
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [userDATA, setUserDATA] = useState({});
  const [userTOKEN, setUserTOKEN] = useState(token);
  const sleepyyyyy = userInfo();
  console.log(sleepyyyyy);




  
  
  // const WelcomeFunction = async () =>{
  //   const isPrevUser = localStorage.getItem("CardEXtoken");
  //   console.log(isPrevUser)
  //   // await parseUserToken()
  //   //   .then((userInfo) => {
  //   //     console.log(userInfo);
  //   //     setUserDATA(userDATA);
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //   });
    
  // }
  // WelcomeFunction();
  
  useEffect(() => {
    // async function fetchUser() {
    //   const userInfo = await parseUserToken();
    //   setUserDATA(userInfo);
    //   return userInfo.id;
    // }
    // async function fetchCart() {
    //   const userInfo = 
    //   const res = await getCart(userInfo.id, token);
    //   console.log(res, "APP Front End");
    //   setCart(res);
      
    // }
    // fetchCart();
  },[]);

  useEffect(() => {
    retrieveCards();
    // getCurrentCart(userInfo.id);
    // getCart(userDATA.id, token);
    async function fetchData() {
      if (token) {
        setIsLoggedIn(true);
        // const response = await parseUserToken();
        // setUserDATA(response);
        // console.log(response, "AYEE YO");
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
  }, []);

  const retrieveCards = () => {
    getAllCards()
      .then((card) => {
        setCards(card);
        return card;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
  }, []);
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
  });

  return (
    <Router>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn}
        user={user} 
        logoutAnim={notifyLogout}
        userDATA={sleepyyyyy}
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
                  userDATA={sleepyyyyy}
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
            userDATA={sleepyyyyy}
            notifySignup={notifySignup}
            notifyLogin={notifyLogin}
          />
        </Route>
        <Route path="/cart">
          <Cart cart={cart} setCart={setCart} 
            userDATA={sleepyyyyy}
            formatter={formatter} 
            userTOKEN={userTOKEN} setUserTOKEN={setUserTOKEN}
            toastWarn={notifyWelcomeWarn}
           
          />
        </Route>
        <Route path="/admin" component={AdminPage} />
      </Switch>
      
    </Router>

  );
}

export default App;
