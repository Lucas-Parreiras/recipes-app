import PropTypes from 'prop-types';
import React, { useState, useMemo } from 'react';
import RecipeContext from './RecipeContext';

const INITIAL_STATE = { inicial: 'incial' };

function RecipeProvider({ children }) {
  const [state] = useState(INITIAL_STATE);
  const memo = useMemo(() => ({
    state,
  }), [state]);

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
