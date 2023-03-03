import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';

export default function Header({ title }) {
  const history = useHistory();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(true);

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
    <>
      <h1 data-testid="page-title">{title}</h1>
      {renderSearch()}
      <br />
      <br />
      <button onClick={ handleClick }>
        <img
          src={ profileIcon }
          alt="icon-profile"
          data-testid="profile-top-btn"
        />
      </button>
      <br />
      <br />
      <div>
        {!showSearch && (
          <form>
            <input
              data-testid="search-input"
              type="text"
              placeholder="Pesquisar..."
            />
          </form>
        )}
      </div>
    </>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
};
