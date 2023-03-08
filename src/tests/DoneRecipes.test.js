import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';
import copy from 'clipboard-copy';
import userEvent from '@testing-library/user-event';
import App from '../App';
import doneRecipes from './mocks/localStorageDoneRecipesMock';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';

jest.mock('clipboard-copy');

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

  it('Testa o botão compartilhar receita (meal)', async () => {
    window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    copy.mockImplementation(() => {});
    const { history } = renderWithRouter(<App />);

    act(() => history.push(ROUTE));

    const shareButton = await screen.findByTestId('0-horizontal-share-btn');
    expect(shareButton.parentElement).toBeInTheDocument();
    userEvent.click(shareButton.parentElement);
    expect(copy).toHaveBeenCalledWith('http://localhost:3000/meals/52771');
    expect(shareButton).not.toBeInTheDocument();
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();
  });

  it('Testa o botão compartilhar receita (drink)', async () => {
    window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    copy.mockImplementation(() => {});
    const { history } = renderWithRouter(<App />);

    act(() => history.push(ROUTE));

    const shareButton = await screen.findByTestId('1-horizontal-share-btn');
    expect(shareButton.parentElement).toBeInTheDocument();
    userEvent.click(shareButton.parentElement);
    expect(copy).toHaveBeenCalledWith('http://localhost:3000/drinks/178319');
    expect(shareButton).not.toBeInTheDocument();
    expect(screen.getByText(/link copied!/i)).toBeInTheDocument();
  });
});
