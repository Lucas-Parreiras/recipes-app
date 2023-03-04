import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { cockTailAPI, mealAPI } from '../helpers/APIsHandle';
import Drinks from './Drinks';
import Meals from './Meals';

function Recipes() {
  const [firstRender, setFirstRender] = useState(true);
  // criação de estado local para armazenamento das receitas obtidas
  const [recipes, setRecipes] = useState([]);
  // criação de estado local para armazenamento das categorias obtidas
  const [categories, setCatgories] = useState([]);
  // criação de estado local para armazenamento da lista de receitas sem filtros aplicados
  const [originalRecipes, setOriginalRecipes] = useState([]);
  // criação de estado local para armazenamento do filtro selecionado
  const [selectedFilter, setSelectedFilter] = useState('');
  // usado para obtenção de dados do navegador a respeito da rota em uso no momento
  const location = useLocation();
  // destruturando apenas o nome da rota em uso
  const { pathname } = location;

  // função responsável por obter apenas as 12 primeiras receitas e salvá-las no estado recipes, recebendo a recipesList obtida na API, como parâmetro
  const getTwelveRecipes = useCallback(async (recipesList, recipeType) => {
    const LIMIT = 12;
    const newRecipesList = [];

    if (recipesList[recipeType].length > LIMIT) {
      for (let i = 0; i < LIMIT; i += 1) {
        newRecipesList.push(recipesList[recipeType][i]);
      }
      setRecipes([...newRecipesList]);
    } else {
      setRecipes([...recipesList[recipeType]]);
    }
    if (firstRender) {
      setOriginalRecipes([...newRecipesList]);
      setFirstRender(false);
    }
  }, [firstRender]);

  const getFiveCategories = (categoriesList, categoryType) => {
    const LIMIT = 5;
    const newCategoriesList = [];

    for (let i = 0; i < LIMIT; i += 1) {
      newCategoriesList.push(categoriesList[categoryType][i]);
    }
    setCatgories([...newCategoriesList]);
  };

  useEffect(() => {
    // função assíncrona para obtenção das receitas
    const getRecipes = async () => {
      // muda o estado de loading para true, para exibir mensagem de 'carregando...'
      let recipesList = [];
      let categoriesList = [];
      // verificação para ver o pathname
      if (pathname === '/meals') {
        recipesList = await mealAPI('search.php?s=');
        categoriesList = await mealAPI('list.php?c=list');
        getTwelveRecipes(recipesList, 'meals');
        getFiveCategories(categoriesList, 'meals');
      } else {
        recipesList = await cockTailAPI('search.php?s=');
        categoriesList = await cockTailAPI('list.php?c=list');
        getTwelveRecipes(recipesList, 'drinks');
        getFiveCategories(categoriesList, 'drinks');
      }
    };
    getRecipes();
  }, [location, pathname, getTwelveRecipes]);

  const removeAppliedFilters = () => {
    setRecipes([...originalRecipes]);
    setSelectedFilter('');
  };

  const applyFilterByCategory = async ({ target: { name } }) => {
    // setIsLoading(true);
    setSelectedFilter(name);
    let recipesList = [];
    if (selectedFilter !== name) {
      switch (pathname) {
      case '/meals':
        recipesList = await mealAPI(`filter.php?c=${name}`);
        getTwelveRecipes(recipesList, 'meals');
        break;
      case '/drinks':
        recipesList = await cockTailAPI(`filter.php?c=${name}`);
        getTwelveRecipes(recipesList, 'drinks');
        break;
      default:
      }
    } else {
      removeAppliedFilters();
    }
  };

  return (
    <div className="main-container">
      <Header title={ pathname === '/meals' ? 'Meals' : 'Drinks' } />
      <div className="categories-container">
        <button
          data-testid="All-category-filter"
          onClick={ removeAppliedFilters }
        >
          All
        </button>
        { categories.map(({ strCategory }, index) => (
          <button
            name={ strCategory }
            data-testid={ `${strCategory}-category-filter` }
            key={ index }
            onClick={ applyFilterByCategory }
          >
            { strCategory }
          </button>
        )) }
      </div>

      <div className="recipes-container">
        {pathname === '/meals'
          ? recipes.map(({ idMeal, strMeal, strMealThumb }, index) => (
            <Meals
              key={ idMeal }
              strMeal={ strMeal }
              strMealThumb={ strMealThumb }
              idMeal={ idMeal }
              index={ index }
            />
          ))
          : recipes.map(({ idDrink, strDrink, strDrinkThumb }, index) => (
            <Drinks
              key={ idDrink }
              strDrink={ strDrink }
              strDrinkThumb={ strDrinkThumb }
              idDrink={ idDrink }
              index={ index }
            />
          )) }
      </div>

    </div>

  );
}

export default Recipes;
