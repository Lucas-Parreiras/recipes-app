import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import RecipeProvider from '../../context/RecipeProvider';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(
      <RecipeProvider>
        <Router history={ history }>{component}</Router>
      </RecipeProvider>,
    ),
    history,
  });
};
export default renderWithRouter;
