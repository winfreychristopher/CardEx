import React from 'react';
import { Link } from 'react-router-dom';
// import ReactDOM from 'react-dom';
import { FcSettings } from 'react-icons/fc'


import "./Navbar.css";

const Navbar = (props) => {
    console.log(props)
    return (
			<div className="navbarContainer">
				<ul class="nav">
						{/* <li id="settings">
							<a href="#"> <FcSettings /> </a>
						</li> */}
						<li>
							<a href="/">CardEx US</a>
						</li>
						<li>
							<a href="/sellcards">Sell Cards</a>
						</li>
						<li id="search">
								<form action="" method="get">
									<input type="text" name="search_text" id="search_text" placeholder="Search"/>
									<input type="button" name="search_button" id="search_button"/>
								</form>
						</li>
						<li id="options">
								<Link to="/register"> Login/Signup </Link>
								<ul class="subnav">
									<li><a href="#">User Profile</a></li>
									<li><a href="#">Settings</a></li>
									<li><Link to="/admin"  style={{color: "red"}}>Admin Mgmt.</Link></li>
								</ul>
						</li>
						<li id="options" className="cartList">
							<a href="#">Cart</a>
							<ul class="subnav cart">
								<li><a href="#">Lebron Card</a></li>
								<li><a href="#">Api Call here</a></li>
							</ul>
						</li>
				</ul>

				<script src="prefixfree-1.0.7.js" type="text/javascript"></script>
			</div>
    );
}

export default Navbar;