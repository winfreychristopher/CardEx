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
							<a href="#">CardEx US</a>
						</li>
						<li>
							<a href="#">Sell Cards</a>
						</li>
						<li id="search">
								<form action="" method="get">
									<input type="text" name="search_text" id="search_text" placeholder="Search"/>
									<input type="button" name="search_button" id="search_button"/>
								</form>
						</li>
						<li id="options">
								<Link to="/register">
									<a href="#">Login/Signup</a>
								</Link>
								<ul class="subnav">
									<li><a href="#">User Profile</a></li>
									<li><a href="#">Settings</a></li>
									<li><a href="#">Admin</a></li>
								</ul>
						</li>
						<li>
							<a href="#">Cart</a>
						</li>
				</ul>

				<script src="prefixfree-1.0.7.js" type="text/javascript"></script>
			</div>
    );
}

export default Navbar;