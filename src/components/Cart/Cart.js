import React from 'react';

import thanosImg from "../../assets/thanosCrown.jpg";
import cardEXLogo from "../../assets/CardEX name.png"
import "./Cart.scss";

const Cart = () => {
  // const Card = {
  //   name: "Thanos Card",
  //   price: "$4,000",
  //   descrption: "",
    

  // }

  const backupCard = {
    id: 8,
    card_title: '1st Edition Venusaur PSA 10',
    description:
     '1st edition Venusaur PSA 10 gem-mint super Rare, perfect for any pokemon collector',
    price: 560,
    view_count: 97,
    card_img: 'https://i.ebayimg.com/00/s/MTE1Mlg3Njg=/z/v3UAAOSw7bla~WOX/$_58.JPG',
  }

  const { id, card_title, description, price, view_count, card_img } = backupCard;
  

  return (
  <div className=" cartComponet container mt-5 p-3 rounded cart">
    <div className=" row no-gutters">
      <div className="col-md-8">
        <div className="product-details mr-2">
          <div className="d-flex flex-row align-items-center">
            <i className="fa fa-long-arrow-left" />
            <span className="ml-2"><a href="/">Continue Shopping</a></span>
          </div>
          <hr />
          <h4 className="mb-0">Shopping cart</h4>
          <div className="d-flex justify-content-between">
            <span>You have 4 items in your cart</span>
            <div className="d-flex flex-row align-items-center">
              <span className="text-black-50">Sort by:</span>
              <div className="price ml-2">
                <span className="mr-1">Price</span>
                <i className="fa fa-angle-down" />
              </div>
            </div>
          </div>

          {/* Generated Checkout Items */}
          <div className=" ItemContainer d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
            <div className=" itemInfo d-flex flex-row">
              <img
                className="rounded"
                src={thanosImg}
                alt={card_title}
              />
              <div className=" itemInfo ml-2">
                <span className="font-weight-bold d-block">
                  {card_title}  
                </span>
                <div className="spec" style={{fontSize: "0.8rem"}}>{description}</div>
              </div>
            </div>
            <div className=" priceInfo d-flex flex-row align-items-center">
              <span className="d-block"> Quantity:1</span>
              <div className=" d-flex ml-5 font-weight-bold"><span>$ </span> {price}</div>
              <i className="fa fa-trash-o ml-3 text-black-50" />
            </div>
          </div>

          {/* <div className="  d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
            <div className="d-flex flex-row">
              <img
                className="rounded"
                src="https://i.imgur.com/Tja5H1c.jpg"
                width={40}
                alt={card_title}
              />
              <div className="ml-2">
                <span className="font-weight-bold d-block">
                  Samsung galaxy Note 10&nbsp;
                </span>
                <span className="spec">256GB, Navy Blue</span>
              </div>
            </div>
            <div className="d-flex flex-row align-items-center">
              <span className="d-block">1</span>
              <span className="d-block ml-5 font-weight-bold">$999</span>
              <i className="fa fa-trash-o ml-3 text-black-50" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Checkout Card Info */}
      <div className=" ccInfoContainer col-md-4">
        <div className="payment-info">
          <div className="d-flex justify-content-between align-items-center">
            <span>Card details</span>
            <img
              className="rounded"
              src={cardEXLogo}
              alt="Company Logo"
              width={60}
            />
          </div>
          <span className="type d-block mt-3 mb-1">Card type</span>
          <label className="radio">
            {" "}
            <input
              type="radio"
              name="card"
              defaultValue="payment"
              defaultChecked
            />{" "}
            <span>
              <img
                width={40}
                src="https://img.icons8.com/color/48/000000/mastercard.png"
              />
            </span>{" "}
          </label>
          <label className="radio">
            {" "}
            <input type="radio" name="card" defaultValue="payment" />{" "}
            <span>
              <img
                width={40}
                src="https://img.icons8.com/officel/48/000000/visa.png"
              />
            </span>{" "}
          </label>
          <label className="radio">
            {" "}
            <input type="radio" name="card" defaultValue="payment" />{" "}
            <span>
              <img
                width={40}
                src="https://img.icons8.com/ultraviolet/48/000000/amex.png"
              />
            </span>{" "}
          </label>
          <label className="radio">
            {" "}
            <input type="radio" name="card" defaultValue="payment" />{" "}
            <span>
              <img
                width={40}
                src="https://img.icons8.com/officel/48/000000/paypal.png"
              />
            </span>{" "}
          </label>
          <div>
            <label className="credit-card-label">Name on card</label>
            <input
              type="text"
              className="form-control credit-inputs"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="credit-card-label">Card number</label>
            <input
              type="text"
              className="form-control credit-inputs"
              placeholder="0000 0000 0000 0000"
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="credit-card-label">Date</label>
              <input
                type="text"
                className="form-control credit-inputs"
                placeholder="12/24"
              />
            </div>
            <div className="col-md-6">
              <label className="credit-card-label">CVV</label>
              <input
                type="text"
                className="form-control credit-inputs"
                placeholder={342}
              />
            </div>
          </div>
          <hr className="line" />

          <div className="subPriceCont">
            <div className=" subPriceCont d-flex justify-content-between information">
              <span>Subtotal</span>
              <span>$3000.00</span>
            </div>
            <div className="d-flex justify-content-between information">
              <span>Shipping</span>
              <span>$20.00</span>
            </div>
            <div className="d-flex justify-content-between information">
              <span>Total(Incl. taxes)</span>
              <span>$3020.00</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block d-flex justify-content-between mt-3"
            type="button"
          >
            {/* total price function */}
            <span>${price}</span>
            <span>
              Checkout
              <i className="fa fa-long-arrow-right ml-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>   
  );
};

export default Cart;