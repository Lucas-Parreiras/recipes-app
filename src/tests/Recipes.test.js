import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';
import mealRecipesApiMock from './mocks/mealRecipesApiMock';
import drinkRecipesApiMock from './mocks/drinkRecipesApiMock';
// import drinkCategories from './mocks/drinkCategoriesMock';
// import filteredDrink from './mocks/filteredDrinksMyCocktail';
import fetch from '../../cypress/mocks/fetch';

describe('Testes da página de receitas', () => {
  it('Testa se as receitas são carregadas na rota "/meals"', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealRecipesApiMock),
    });

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    const teste1 = await screen.findByText(/corba/i);
    const teste2 = await screen.findByText(/sushi/i);
    expect(teste1).toBeInTheDocument();
    expect(teste2).toBeInTheDocument();
  });

  it('Testa se as receitas são carregadas na rota "/drinks"', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinkRecipesApiMock),
    });

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });
    const teste1 = await screen.findByText(/gg/i);
    const teste2 = await screen.findByText(/ace/i);
    expect(teste1).toBeInTheDocument();
    expect(teste2).toBeInTheDocument();
  });

  it('Testa os filtros são aplicados e removidos corretamente das refeições', async () => {
    global.fetch = fetch;
    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    const teste1 = await screen.findByText(/corba/i);
    const teste2 = await screen.findByText(/kumpir/i);
    const filterButton = await screen.findByRole('button', { name: /beef/i });
    expect(teste1).toBeInTheDocument();
    expect(teste2).toBeInTheDocument();
    expect(filterButton).toBeInTheDocument();
    userEvent.click(filterButton);
    // expect(teste1).not.toBeInTheDocument();
    const filteredMeal = await screen.findByText(/big mac/i);
    expect(filteredMeal).toBeInTheDocument();
    const rmvFilter = await screen.findByRole('button', { name: /all/i });
    expect(rmvFilter).toBeInTheDocument();
    userEvent.click(rmvFilter);
    expect(await screen.findByText(/corba/i)).toBeInTheDocument();
  });

  it('Testa os filtros são aplicados e removidos corretamente dos drinks', async () => {
    global.fetch = fetch;

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    const teste1 = await screen.findByText(/gg/i);
    const teste2 = await screen.findByText(/a1/i);
    expect(teste1).toBeInTheDocument();
    expect(teste2).toBeInTheDocument();
    const filterButton = await screen.findByTestId('Cocktail-category-filter');
    expect(filterButton).toBeInTheDocument();
    userEvent.click(filterButton);
    userEvent.click(filterButton);

    const filteredDrink = await screen.findByText(/gg/i);
    expect(filteredDrink).toBeInTheDocument();
    const rmvFilter = await screen.findByRole('button', { name: /all/i });
    expect(rmvFilter).toBeInTheDocument();
    userEvent.click(rmvFilter);
    expect(await screen.findByText(/acid/i)).toBeInTheDocument();
  });
});
