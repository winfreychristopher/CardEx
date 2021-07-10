import React from 'react';
import { Link } from 'react-router-dom';
// import ReactDOM from 'react-dom';
import { BiUser } from 'react-icons/bi'
import {clearToken, getToken } from '../../api/index';
import { useHistory } from 'react-router-dom';


import "./Navbar.css";

const Navbar = ({isLoggedIn, setIsLoggedIn, user, logoutAnim, userDATA}) => {
	

	const history = useHistory();
	
		const logOut = () => {
			logoutAnim();
			setIsLoggedIn(false);
			clearToken();

			setTimeout(function() {
				history.push("/register");
			}, 2000);
				



		}

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
								
									<>
										<a href="#"><BiUser size={28} /> { isLoggedIn ? `${userDATA.username}` : "My Account"}</a>
										<ul class="subnav">
											<li><a href="#">User Profile</a></li>
											<li><a href="#">Settings</a></li>
											{ !isLoggedIn ? <li><a href="/register">Login</a></li> : "" }
											{ isLoggedIn ? <li><Link to="#" onClick={logOut} >Logout </Link></li> : ''}
											{user.admin && 
												<li><Link to="/admin"  style={{color: "red"}}>Admin Mgmt.</Link></li>
											}	
										</ul>
									</>
								
								
						</li>
						<li id="options" className="cartList">
							<a href="/cart">Cart</a>
							<ul class="subnav cart">
							</ul>
						</li>
				</ul>

				<script src="prefixfree-1.0.7.js" type="text/javascript"></script>
			</div>
    );
}



export default Navbar;