import React from "react";
// import ReactDOM from "react-dom";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./SlideBanner.css";

import pokeCardsImg from "../../assets/Best-Pokemon-Booster-Box-2021-Banner.jpg";
import cardMoneyImg from "../../assets/just-collect-value-banner.jpg"
import vintageCardsImg from "../../assets/vintage-sports-cards-banner.jpg"
import paniniCardImg from "../../assets/Panini Card-Banner.jpg";
import shinnyPokeImg from "../../assets/shinning Fates pokemon-banner.jpg";

const HomeBanner = (props) => {
	console.log(props)
	return (
		<div className="CarouselContainer">
			<Carousel>
				<Carousel.Item>
					<img
						className="d-block w-100"
						src={paniniCardImg}
						alt="First slide"
					/>
					<Carousel.Caption>
						<h3></h3>
						<p></p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img
						className="d-block w-100"
						src={cardMoneyImg}
						alt="Second slide"
					/>
					<Carousel.Caption>
						<h3></h3>
						<p></p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img
						className="d-block w-100"
						src={vintageCardsImg}
						alt="Third slide"
					/>
					<Carousel.Caption>
						<h3></h3>
						<p></p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img
						className="d-block w-100"
						src={paniniCardImg}
						alt="Third slide"
					/>
					<Carousel.Caption>
						<h3></h3>
						<p></p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img
						className="d-block w-100"
						src={shinnyPokeImg}
						alt="Third slide"
					/>
					<Carousel.Caption>
						<h3></h3>
						<p></p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</div>
	);
};

export default HomeBanner;