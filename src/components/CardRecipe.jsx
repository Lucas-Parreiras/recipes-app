import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

export default function CardRecipe({ recipeType, recipeName, recipeThumb, index, id }) {
  return (
    <Link to={ `/${recipeType}/${id}` }>
      <div
        className="recipe-card"
        data-testid={ `${index}-recipe-card` }
      >
        <img
          data-testid={ `${index}-card-img` }
          src={ recipeThumb }
          alt={ recipeName }
        />
        <p data-testid={ `${index}-card-name` }>{ recipeName }</p>
      </div>
    </Link>
  );
}

CardRecipe.propTypes = {
  recipeType: PropTypes.string.isRequired,
  recipeName: PropTypes.string.isRequired,
  recipeThumb: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};
