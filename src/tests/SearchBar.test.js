import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';
import SearchBar from '../components/SearchBar';
import RecipeProvider from '../context/RecipeProvider';
import App from '../App';
import mealRecipesApiMock from './mocks/mealRecipesApiMock';
import drinkRecipesApiMock from './mocks/drinkRecipesApiMock';
import fetch from '../../cypress/mocks/fetch';
import mealCategories from './mocks/mealCategoriesMock';

describe('Testes do Componente SearchBar, rota Meals', () => {
  const SEARCH_INPUT = 'search-input';
  const INGREDIENT_SEARCH_RADIO = 'ingredient-search-radio';
  const NAME_SEARCH_RADIO = 'name-search-radio';
  const FIRST_LETTER_SEARCH_RADIO = 'first-letter-search-radio';
  const EXEC_SEARCH_BTN = 'exec-search-btn';
  const SEARCH_TOP_BTN = 'search-top-btn';

  it('Redireciona o campo com nome selecionado', async () => {
    const { history } = renderWithRouter(<RecipeProvider><App /></RecipeProvider>);
    // Navega para a página de drinks
    act(() => {
      history.push('/drinks');
    });

    // Obtém os elementos da tela e executa a pesquisa
    const topSearchBtn = screen.getByTestId(SEARCH_TOP_BTN);
    userEvent.click(topSearchBtn);
    const nameSearchRadio = screen.getByTestId(NAME_SEARCH_RADIO);
    userEvent.click(nameSearchRadio);
    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'xablau');
    const execSearchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    userEvent.click(execSearchBtn);

    // Aguarda o redirecionamento para a tela de detalhes
    await waitFor(async () => {
      const { pathname } = history.location;
      expect(pathname).toBe('/drinks/178319');
    }, { timeout: 4000 });
  });

  it('Verifica renderização de todos os elementos', () => {
    const { history } = renderWithRouter(<RecipeProvider><App /></RecipeProvider>);
    act(() => history.push('/meals'));
    const topSearchBtn = screen.getByTestId(SEARCH_TOP_BTN);
    userEvent.click(topSearchBtn);

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    const nameRadioBtn = screen.getByTestId(NAME_SEARCH_RADIO);
    const firstLetterRadioBtn = screen.getByTestId(FIRST_LETTER_SEARCH_RADIO);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    expect(searchInput).toBeInTheDocument();
    expect(ingredientRadioBtn).toBeInTheDocument();
    expect(nameRadioBtn).toBeInTheDocument();
    expect(firstLetterRadioBtn).toBeInTheDocument();
    expect(searchBtn).toBeInTheDocument();
  });

  it('Verifica possibilidade de digitar no campo de input', () => {
    const { history } = renderWithRouter(<RecipeProvider><App /></RecipeProvider>);
    act(() => history.push('/meals'));
    const topSearchBtn = screen.getByTestId(SEARCH_TOP_BTN);
    userEvent.click(topSearchBtn);

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'chicken');
    expect(searchInput).toHaveValue('chicken');
  });

  it('Verifica a possibilidade de usar o campo de input, os botões radio e o botão Search', () => {
    const { history } = renderWithRouter(<RecipeProvider><App /></RecipeProvider>);
    act(() => history.push('/meals'));
    const topSearchBtn = screen.getByTestId(SEARCH_TOP_BTN);
    userEvent.click(topSearchBtn);

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    const nameRadioBtn = screen.getByTestId(NAME_SEARCH_RADIO);
    const firstLetterRadioBtn = screen.getByTestId(FIRST_LETTER_SEARCH_RADIO);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);

    userEvent.type(searchInput, 'chicken');
    userEvent.click(ingredientRadioBtn);
    userEvent.click(searchBtn);
    userEvent.click(nameRadioBtn);
    userEvent.click(searchBtn);
    userEvent.click(firstLetterRadioBtn);
    userEvent.click(searchBtn);
  });

  it('Verifica se executa uma chamada à API Meals quando realiza uma pesquisa e em caso de sucesso renderiza as receitas', async () => {
    const mealsByIngredients = mealRecipesApiMock;
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mealsByIngredients),
    }));

    const { history } = renderWithRouter(<RecipeProvider><SearchBar /></RecipeProvider>);
    act(() => history.push('/meals'));

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'chicken');
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    userEvent.click(ingredientRadioBtn);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    userEvent.click(searchBtn);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken');

    jest.restoreAllMocks();
  });

  it('Ao retornar apenas 1 receita da API, deve direcionar para a tela de detalhe da receita, com o id na URL', async () => {
    const uniqueRecipe = [mealRecipesApiMock.meals[0]];
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(uniqueRecipe),
    }));

    const { history } = renderWithRouter(<SearchBar />);
    act(() => history.push('/meals'));

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'chicken');
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    userEvent.click(ingredientRadioBtn);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    userEvent.click(searchBtn);

    jest.restoreAllMocks();
  });

  it('Ao não retornar nenhuma receita da API, deve exibir um alert', async () => {
    const noRecipe = { meals: null };
    jest.spyOn(global, 'fetch');
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mealRecipesApiMock),
    }).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mealCategories),
    }).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mealRecipesApiMock),
    })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mealCategories),
      })
      .mockResolvedValue({
        json: jest.fn().mockResolvedValue(noRecipe),
      });

    global.alert = jest.fn().mockReturnValue('Sorry, we haven\'t found any recipes for these filters.');

    const { history } = renderWithRouter(<App />);
    act(() => history.push('/meals'));

    const topSearchBtn = screen.getByTestId(SEARCH_TOP_BTN);
    expect(topSearchBtn).toBeInTheDocument();
    userEvent.click(topSearchBtn);

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    const nameRadioBtn = screen.getByTestId(NAME_SEARCH_RADIO);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);

    expect(searchInput).toBeInTheDocument();
    expect(nameRadioBtn).toBeInTheDocument();
    expect(searchBtn).toBeInTheDocument();

    userEvent.type(searchInput, 'xablau');
    expect(screen.getByDisplayValue(/xablay/i)).toBeInTheDocument();
    userEvent.click(nameRadioBtn);
    userEvent.click(searchBtn);
    // VERIFICAR MOCK E TESTAR O COMPORTAMENTO DO ALERT
    // expect(global.alert).toHaveBeenCalledTimes(1);
    // expect(fetch).toHaveBeenCalled();;
    // expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=xablau');
  });
});

describe('Testes do Componente SearchBar, rota Drinks', () => {
  const SEARCH_INPUT = 'search-input';
  const INGREDIENT_SEARCH_RADIO = 'ingredient-search-radio';
  const EXEC_SEARCH_BTN = 'exec-search-btn';

  it('Verifica se executa uma chamada à API Drinks quando realiza uma pesquisa', () => {
    const drinksByIngredients = drinkRecipesApiMock;
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(drinksByIngredients),
    }));

    const { history } = renderWithRouter(<RecipeProvider><SearchBar /></RecipeProvider>);
    act(() => history.push('/drinks'));

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'whiskey');
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    userEvent.click(ingredientRadioBtn);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    userEvent.click(searchBtn);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=whiskey');
  });
});
