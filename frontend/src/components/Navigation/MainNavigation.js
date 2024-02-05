import React from 'react';
import { NavLink } from 'react-router-dom';
import './mainNavigation.css'
import AuthContext from '../../context/auth-context';

const MainNavigation = props => (
  <AuthContext.Consumer>
    {(context) => {
      console.log(context);
      return (
        <header className='main-navigation'>
          <div className="main-navigation___logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="main-navigation___items">
            <ul>
              {!context.token &&<li>
                <NavLink to="/auth">Auth</NavLink>
              </li>}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token &&<li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>}
              {context.token && <li><NavLink to="/" onClick={() => {context.logout()} }>Logout</NavLink></li>}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
