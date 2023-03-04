import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';
import mealRecipesApiMock from './mocks/mealRecipesApiMock';
import drinkRecipesApiMock from './mocks/drinkRecipesApiMock';
import mealCategories from './mocks/mealCategoriesMock';
import drinkCategories from './mocks/drinkCategoriesMock';

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
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealRecipesApiMock),
    });

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealCategories),
    });
    const teste1 = await screen.findByText(/corba/i);
    const teste2 = await screen.findByText(/burek/i);
    const filterButton = await screen.findByRole('button', { name: /beef/i });
    expect(teste1).toBeInTheDocument();
    expect(teste2).toBeInTheDocument();
    expect(filterButton).toBeInTheDocument();
    userEvent.click(filterButton);

    expect(teste1).not.toBeInTheDocument();
    const rmvFilter = await screen.findByRole('button', { name: /all/i });
    expect(rmvFilter).toBeInTheDocument();
    userEvent.click(rmvFilter);
    expect(await screen.findByText(/corba/i)).toBeInTheDocument();
  });

  it('Testa os filtros são aplicados e removidos corretamente dos drinks', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinkRecipesApiMock),
    });

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/drinks');
    });

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(drinkCategories),
    });
    const teste1 = await screen.findByText(/a1/i);
    const teste2 = await screen.findByText(/ace/i);
    const filterButton = await screen.findByRole('button', { name: /shake/i });
    const allButton = await screen.findByRole('button', { name: /all/i });
    expect(teste1).toBeInTheDocument();
    expect(teste2).toBeInTheDocument();
    expect(filterButton).toBeInTheDocument();
    expect(allButton).toBeInTheDocument();
  });
});
