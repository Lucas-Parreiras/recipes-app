import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import doneRecipes from './mocks/localStorageDoneRecipesMock';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';

const ROUTE = '/done-recipes';

describe('Teste do componente DoneRecipes.jsx', () => {
  it('Testa se os elementos estão renderizados na tela', async () => {
    window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const { history } = renderWithRouter(<App />);

    act(() => history.push(ROUTE));

    const img1 = await screen.findByTestId('0-horizontal-image');
    const img2 = await screen.findByTestId('1-horizontal-image');
    expect(img1).toBeInTheDocument();
    expect(img2).toBeInTheDocument();
  });

  it('Testa se o filtro foods é aplicado corretamente', async () => {
    window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const { history } = renderWithRouter(<App />);

    act(() => history.push(ROUTE));

    const foodFilterButton = await screen.findByTestId('filter-by-meal-btn');
    expect(foodFilterButton).toBeInTheDocument();
    userEvent.click(foodFilterButton);
    const filteredRecipe = await screen.findByText(/Spicy Arrabiata Penne/i);
    expect(filteredRecipe).toBeInTheDocument();
  });

  it('Testa se o filtro drinks é aplicado corretamente', async () => {
    window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    const { history } = renderWithRouter(<App />);

    act(() => history.push(ROUTE));

    const drinkFilterButton = await screen.findByTestId('filter-by-drink-btn');
    expect(drinkFilterButton).toBeInTheDocument();
    userEvent.click(drinkFilterButton);
    const filteredRecipe = await screen.findByText(/aquamarine/i);
    expect(filteredRecipe).toBeInTheDocument();
  });

  // it('Testa o botão compartilhar', async () => {
  //   window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  //   const { history } = renderWithRouter(<App />);

  //   act(() => history.push(ROUTE));

  //   const shareButton = await screen.findByTestId('0-horizontal-share-btn');
  //   expect(shareButton.parentElement).toBeInTheDocument();
  //   userEvent.click(shareButton.parentElement);
  // });
});
