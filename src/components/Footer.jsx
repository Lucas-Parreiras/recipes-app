import React from 'react';
import { Link } from 'react-router-dom';
import mealIcon from '../images/mealIcon.svg';
import drinkIcon from '../images/drinkIcon.svg';

export default function Footer() {
  return (
    <div className="footer" data-testid="footer">
      <Link
        to="/drinks"
        className="footer-drinks-link"
      >
        <img
          data-testid="drinks-bottom-btn"
          src={ drinkIcon }
          alt="ícone drinks"
        />
      </Link>

      <Link
        to="/meals"
        className="footer-meals-link"
      >
        <img
          data-testid="meals-bottom-btn"
          src={ mealIcon }
          alt="ícone refeições"
        />
      </Link>
    </div>
  );
}
