import React from 'react';
import { useLocation } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/mesto-logo.svg';

function Header(props) {

  const location = useLocation();
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem('token');
    navigate('/sign-in', {replace: true});
    props.handleLogOut();
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Место Россия" />
      <div className="header__container">
        {props.loggedIn && <p className="header__user-email">{props.userEmail }</p>}
        {props.loggedIn && <p className="header__auth-button" onClick={signOut}>Выйти</p>}
        {location.pathname === '/sign-up' && <Link to='/sign-in' className="header__auth-button">Войти</Link>}
        {location.pathname === '/sign-in' && <Link to='/sign-up' className="header__auth-button">Регистрация</Link>}
      </div>
    </header>
  );
}

export default Header;