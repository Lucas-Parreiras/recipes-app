import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FavoriteRecipes from '../pages/FavoriteRecipes';

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
    localStorage.clear();
  });

  it('Renderiza tudo', () => {
    render(
      <BrowserRouter>
        <FavoriteRecipes />
      </BrowserRouter>,
    );
    expect(screen.getByTestId('filter-by-all-btn')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('filter-by-all-btn'));
  });

  it('Renderiza detalhes', () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));

    render(
      <BrowserRouter>
        <FavoriteRecipes />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId('0-horizontal-image'));

    expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    expect(screen.getByText('Categoria: Pasta')).toBeInTheDocument();
    expect(screen.getByText('Italiana')).toBeInTheDocument();
  });

  it('Filtra Comida', () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe1, recipe2]));
    render(
      <BrowserRouter>
        <FavoriteRecipes />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByTestId('filter-by-meal-btn'));
    expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    expect(screen.queryByText('Mojito')).not.toBeInTheDocument();
  });

  it('Filtra Bebida', () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe1, recipe2]));

    render(
      <BrowserRouter>
        <FavoriteRecipes />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByTestId('filter-by-drink-btn'));
    expect(screen.queryByText('Spaghetti')).not.toBeInTheDocument();
    expect(screen.getByText('Mojito')).toBeInTheDocument();
  });

  it('HandleSelectUnFav com click', () => {
    const handleSelectUnFav = jest.fn();
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));
    render(
      <BrowserRouter>
        <FavoriteRecipes handleSelectUnFav={ handleSelectUnFav } />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByAltText('Black Heart Icon'));
    expect(handleSelectUnFav).toHaveBeenCalledWith('123');
  });

  it('HandleShare com click', () => {
    const handleChangeShare = jest.fn();
    localStorage.setItem('favoriteRecipes', JSON.stringify([recipe]));
    render(
      <BrowserRouter>
        <FavoriteRecipes handleChangeShare={ handleChangeShare } />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByAltText('Share Icon'));
    expect(handleChangeShare).toHaveBeenCalledWith(recipe);
  });
});
