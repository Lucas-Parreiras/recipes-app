import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import headerLogo from '../images/header-logo.svg';
import headerTitle from '../images/header-title.svg';
import '../css/Header.css';

export default function Header() {
  const history = useHistory();
  const location = useLocation();
  const { showSearch, setShowSearch } = useContext(RecipeContext);

  //  verifica o caminho atual da página, se é meals ou drink
  const renderSearch = () => {
    if (location.pathname === '/drinks' || location.pathname === '/meals') {
      return (
        <button onClick={ () => setShowSearch(!showSearch) }>
          <img src={ searchIcon } alt="icon-search" data-testid="search-top-btn" />
        </button>
      );
    }
  };

  // caminho da ágina que se deseja caminhar
  const handleClick = () => {
    history.push('/profile');
  };

  return (
    <div className="application-header">
      <div className="logo-container">
        <img src={ headerLogo } alt="logo do header" />
        <img src={ headerTitle } alt="titulo do header" className="header-title" />
      </div>

      <div className="header-buttons-container">
        {renderSearch()}
        <button onClick={ handleClick }>
          <img
            src={ profileIcon }
            alt="icon-profile"
            data-testid="profile-top-btn"
          />
        </button>
      </div>
    </div>
  );
}
