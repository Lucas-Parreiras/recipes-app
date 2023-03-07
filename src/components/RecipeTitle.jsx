import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeTitle({ index, name, id, type }) {
  return (
    <Link to={ `/${type}s/${id}` }>
      <h6 data-testid={ `${index}-horizontal-name` }>
        { name }
      </h6>
    </Link>
  );
}

RecipeTitle.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
