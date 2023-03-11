import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
import copy from 'clipboard-copy';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';
import FavoriteRecipes from '../pages/FavoriteRecipes';

jest.mock('clipboard-copy');

describe('FavoriteRecipes', () => {
  const recipe = {
    id: '123',
    type: 'meal',
    name: 'Spaghetti',
    image: 'https://www.exampleqwee.com/spaghetti.jpg',
    nationality: 'Italian',
    category: 'Pasta',
  };
  const recipe1 = {
    id: '123',
    type: 'meal',
    name: 'Spaghetti',
    image: 'https://www.examplyhye.com/spaghetti.jpg',
    nationality: 'Italian',
    category: 'Pasta',
  };
  const recipe2 = {
    id: '456',
    type: 'drink',
    name: 'Mojito',
    image: 'https://www.exampegdfgble.com/mojito.jpg',
    nationality: 'Cuban',
    category: 'Cocktail',
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('Renderiza tudo', () => {
    renderWithRouter(
      <FavoriteRecipes />,
    );
    expect(screen.getByTestId('filter-by-all-btn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('filter-by-all-btn')); // adicionado
  });

  it('Renderiza detalhes', () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));

    renderWithRouter(
      <FavoriteRecipes />,
    );

    fireEvent.click(screen.getByTestId('0-horizontal-image'));

    expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    expect(screen.getByText(/italian - pasta/i)).toBeInTheDocument();
  });

  it('Filtra Comida', () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify([recipe1, recipe2]));
    renderWithRouter(
      <FavoriteRecipes />,
    );

    fireEvent.click(screen.getByTestId('filter-by-meal-btn'));
    expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    expect(screen.queryByText('Mojito')).not.toBeInTheDocument();
  });

  it('Filtra Bebida', () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify([recipe1, recipe2]));

    renderWithRouter(
      <FavoriteRecipes />,
    );
    fireEvent.click(screen.getByTestId('filter-by-drink-btn'));
    expect(screen.queryByText('Spaghetti')).not.toBeInTheDocument();
    expect(screen.getByText('Mojito')).toBeInTheDocument();
  });

  it('HandleSelectUnFav com click', () => {
    window.localStorage.setItem('favoriteRecipes', JSON.stringify([recipe, recipe2]));
    renderWithRouter(
      <FavoriteRecipes />,
    );
    expect(screen.queryByText(/spaghetti/i)).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getAllByAltText('Black Heart Icon')[0]);
    });
    expect(JSON.parse(window.localStorage.getItem('favoriteRecipes'))).toEqual([recipe2]);
    expect(screen.queryByText(/spaghetti/i)).not.toBeInTheDocument();
  });

  it('HandleShare com click', () => {
    copy.mockImplementation(() => {});
    window.localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));
    renderWithRouter(
      <FavoriteRecipes />,
    );
    act(() => {
      fireEvent.click(screen.getByAltText('Share Icon'));
    });
    expect(copy).toHaveBeenCalledWith('http://localhost:3000/meals/123');
  });
});
