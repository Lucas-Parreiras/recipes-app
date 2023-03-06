import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';
import SearchBar from '../components/SearchBar';
import RecipeProvider from '../context/RecipeProvider';
// import { APIresponseDrinks, APIresponseMeals } from './mocks/APIresponse';
import App from '../App';

describe('Testes do Componente SearchBar, rota Meals', () => {
//   const mealsByIngredients = APIresponseMeals.ingredients;
//   const mealsByName = APIresponseMeals.name;
//   const mealsFirstLetter = APIresponseMeals.firstLetter;

  // beforeEach(() => {
  //   render(
  //     <MemoryRouter initialEntries={ ['/meals'] }>
  //       <Route path="/meals">
  //         <RecipeProvider>
  //           <SearchBar />
  //         </RecipeProvider>
  //       </Route>
  //     </MemoryRouter>,
  //   );
  // });

  const SEARCH_INPUT = 'search-input';
  const INGREDIENT_SEARCH_RADIO = 'ingredient-search-radio';
  const EXEC_SEARCH_BTN = 'exec-search-btn';
  const FIRST_LETTER_SEARCH_RADIO = 'first-letter-search-radio';

  it('Verifica renderização de todos os elementos', () => {
    const searchInput = screen.getByTestId(SEARCH_INPUT);
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    const nameRadioBtn = screen.getByTestId('name-search-radio');
    const firstLetterRadioBtn = screen.getByTestId(FIRST_LETTER_SEARCH_RADIO);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    expect(searchInput).toBeInTheDocument();
    expect(ingredientRadioBtn).toBeInTheDocument();
    expect(nameRadioBtn).toBeInTheDocument();
    expect(firstLetterRadioBtn).toBeInTheDocument();
    expect(searchBtn).toBeInTheDocument();
  });

  it('Verifica possibilidade de digitar no campo de input', () => {
    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'chicken');
    expect(searchInput).toHaveValue('chicken');
  });

  it('Verifica a possibilidade de usar o campo de input, os botões radio e o botão Search', () => {
    const searchInput = screen.getByTestId(SEARCH_INPUT);
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    const nameRadioBtn = screen.getByTestId('name-search-radio');
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
    const mealsByIngredients = APIresponseMeals.ingredients;
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(mealsByIngredients),
    }));

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'chicken');
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    userEvent.click(ingredientRadioBtn);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    userEvent.click(searchBtn);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken');

    await screen.findAllByRole('heading', { level: 2 });
    expect(renderedRecipes).toHaveLength(3);
    // ESTE TRECHO ESTÁ COM PROBLEMAS

    jest.restoreAllMocks();
  });

  it('Ao retornar apenas 1 receita da API, deve direcionar para a tela de detalhe da receita, com o id na URL', async () => {
    const uniqueRecipe = [APIresponseMeals.ingredients[0]];
    console.log(uniqueRecipe);
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(uniqueRecipe),
    }));

    const { history } = renderWithRouter(<App />);
    act(() => {
      history.push('/meals');
    });
    const searchTopBtn = screen.getByTestId('search-top-btn');
    userEvent.click(searchTopBtn);

    const searchInput = screen.getByTestId(SEARCH_INPUT);
    userEvent.type(searchInput, 'chicken');
    const ingredientRadioBtn = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    userEvent.click(ingredientRadioBtn);
    const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
    userEvent.click(searchBtn);
    // const searchText = await screen.findByText(/chicken/i);
    const { location } = history;
    console.log(location);

    jest.restoreAllMocks();
  });

  it('', () => {});

  //   it('Ao digitar mais de 1 caractere no campo de input, selecionar o radio button "First Letter" e clicar em "Search", deve exibir um alert message', async () => {
  //     // const alertMock = jest.spyOn(global, 'alert').mockImplementation();

  //     const searchInput = screen.getByTestId(SEARCH_INPUT);
  //     userEvent.type(searchInput, 'chicken');
  //     const firstLetterRadioBtn = screen.getByTestId(FIRST_LETTER_SEARCH_RADIO);
  //     userEvent.click(firstLetterRadioBtn);
  //     const searchBtn = screen.getByTestId(EXEC_SEARCH_BTN);
  //     userEvent.click(searchBtn);

//     // expect(alertMock).toHaveBeenCalledTimes(1);
//     await screen.findByRole('alert');
//     // expect(screen.getByRole('alert')).toHaveTextContent(/Your search must have only 1 (one) character/i);
//   });
});

describe('Testes do Componente SearchBar, rota Drinks', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Route path="/drinks">
          <RecipeProvider>
            <SearchBar />
          </RecipeProvider>
        </Route>
      </MemoryRouter>,
    );
  });

  const SEARCH_INPUT = 'search-input';
  const INGREDIENT_SEARCH_RADIO = 'ingredient-search-radio';
  const EXEC_SEARCH_BTN = 'exec-search-btn';

  it('Verifica se executa uma chamada à API Drinks quando realiza uma pesquisa', () => {
    const drinksByIngredients = APIresponseDrinks.ingredients;
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(drinksByIngredients),
    }));

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
