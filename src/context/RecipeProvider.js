import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import RecipeContext from './RecipeContext';

function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const memo = useMemo(() => ({
    recipes,
    setRecipes,
  }), [recipes, setRecipes]);

  return (
    <RecipeContext.Provider value={ memo }>
      {children}
    </RecipeContext.Provider>
  );
}

RecipeProvider.propTypes = {
  children: PropTypes.shape({}).isRequired,
};

export default RecipeProvider;
