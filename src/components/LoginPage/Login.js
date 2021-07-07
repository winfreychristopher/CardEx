import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { userRegister } from '../../api/index';

import "./Login.css";

const LoginPage  = () => {
  // const modalSwitcher = () => {
  //   const { path }  = useLocation();
  // }
  //   path.includes("register") ?

  // }

  const userForms = document.getElementById('user_options-forms');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // const onFormSubmit = async (e) => {
  //   e.preventDefault();

  // }
  const SignupUser = async (e, name, pass, mail) => {
    

    try {
      const res = await userRegister(name, pass);
      console.log(res);
      document.getElementById("errMsg").innerHTML = `${"You have Logged in " + name + "."}`;
      e.preventDefault();
      
    } catch (err) {
      document.getElementById("errMsg").innerHTML = `${err}`;
      console.log(err)
    }
  }

  const rmBounceR = () => {
    userForms.classList.remove('bounceRight');
    userForms.classList.add('bounceLeft');
  }
  const rmBounceL = () => {
    userForms.classList.remove('bounceLeft');
    userForms.classList.add('bounceRight');
  }

  return (
    <section class="user">
      <div class="user_options-container">
        <div class="user_options-text">
          <div class="user_options-unregistered">
            <h2 class="user_unregistered-title">Don't have a CardEX account?</h2>
            <p class="user_unregistered-text">
              Join CardEx now and start trading today!
            </p>
            <button class="user_unregistered-signup" id="signup-button"
              onClick={rmBounceR}
            >
              Sign up
            </button>
          </div>

          <div class="user_options-registered">
            <h2 class="user_registered-title">Have a CardEX account?</h2>
            <p class="user_registered-text">
              Already have an Account? Login Here.
            </p>
            <button 
              class="user_registered-login" 
              id="login-button"
              onClick={rmBounceL}
            >
              Login
            </button>
          </div>
        </div>

        <div class="user_options-forms" id="user_options-forms">
          <div class="user_forms-login">
            <h2 class="forms_title">Login</h2>
            <div id="errMsg">
       
            </div>
            <form class="forms_form">
              <fieldset class="forms_fieldset">
                <div class="forms_field">
                  <input type="text" class="forms_field-input" required />
                  <label class="forms_field-label">Email</label>
                </div>
                <div class="forms_field">
                  <input type="password" class="forms_field-input" required />
                  <label class="forms_field-label">Password</label>
                </div>
              </fieldset>
              <div class="forms_buttons">
                <button type="button" class="forms_buttons-forgot">
                  Forgot password?
                </button>
                <input
                  type="submit"
                  value="Login"
                  class="forms_buttons-action"
                  
                />
              </div>
            </form>
          </div>
          <div class="user_forms-signup">
            <h2 class="forms_title">Sign Up</h2>
            <div id="errMsg">
            
            </div>
            <form class="forms_form" onSubmit={(event) => {SignupUser( event, username, password, email)}}>
              <fieldset class="forms_fieldset">
                <div class="forms_field">
                  <input type="text" class="forms_field-input" required 
                    onInput={(event) => {
                      console.log(event.target.value)
                      setUsername(event.target.value);
                    }} 
                  />
                  <label class="forms_field-label"> Username </label>
                </div>
                <div class="forms_field">
                  <input type="text" class="forms_field-input" required 
                    onInput={(event) => {
                      console.log(event.target.value)
                      setEmail(event.target.value);
                    }} 
                  />
                  <label class="forms_field-label">Email</label>
                </div>
                <div class="forms_field">
                <label class="forms_field-label">Password</label>
                  <input type="password" class="forms_field-input" required 
                    onInput={(event) => {
                      console.log(event.target.value)
                      setPassword(event.target.value);                     
                    }} 
                  />
                </div>
                <div class="forms_field">
                  <input type="password" class="forms_field-input" required />
                  <label class="forms_field-label">Confirm Password</label>
                </div>
              </fieldset>
              <div class="forms_buttons">
                <input
                  type="submit"
                  value="Sign up"
                  class="forms_buttons-action"
                  
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>


  );
};

export default LoginPage;