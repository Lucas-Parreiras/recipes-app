import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import profileIconRound from '../images/profileIconRound.svg';
import doneIcon from '../images/doneIcon.svg';
import favoritesIcon from '../images/favoritesIcon.svg';
import logoutIcon from '../images/logoutIcon.svg';
import '../css/Profile.css';

export default function Profile() {
  const [userEmail, setUserEmail] = useState('');

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('user'))) {
      localStorage.setItem('user', JSON.stringify({ email: 'LS_error' }));
    }
    const getLSData = JSON.parse(localStorage.getItem('user'));
    const emailToRender = getLSData.email;
    setUserEmail(emailToRender);
  }, []);

  return (
    <div>
      <Header />
      <h1 data-testid="page-title">Profile</h1>

      <section className="userInfo">
        <img src={ profileIconRound } alt="Profile Icon" />
        <h5 data-testid="profile-email">{userEmail}</h5>
      </section>

      <section className="links">
        <Link to="/done-recipes" data-testid="profile-done-btn">
          <img src={ doneIcon } alt="Link Done Recipes" />
          <p>Done Recipes</p>
        </Link>
        <Link to="/favorite-recipes" data-testid="profile-favorite-btn">
          <img src={ favoritesIcon } alt="Link Favorite Recipes" />
          <p>Favorite Recipes</p>
        </Link>
        <Link
          to="/"
          data-testid="profile-logout-btn"
          onClick={ () => clearLocalStorage() }
        >
          <img src={ logoutIcon } alt="Link Logout" />
          <p>Logout</p>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
