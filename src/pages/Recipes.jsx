import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import CardRecipe from '../components/CardRecipe';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RecipeContext from '../context/RecipeContext';
import { cockTailAPI, mealAPI } from '../helpers/APIsHandle';
// import drinksTitle from '../images/drinksTitle.svg';
// import mealsTitle from '../images/mealsTitle.svg';
// import Drinks from './Drinks';
// import Meals from './Meals';

function Recipes() {
  const [firstRender, setFirstRender] = useState(true);
  // criação de estado local para armazenamento das receitas obtidas
  const { recipes, setRecipes } = useContext(RecipeContext);
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
  }, [firstRender, setRecipes]); // precisava chamar o setRecipes nessa linha

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
      <Header />
      <header className="recipes-page-title">
        <h1 data-testid="page-title">
          { pathname === '/meals' ? 'Meals' : 'Drinks'}
        </h1>
      </header>
      <div className="categories-container">
        <input
          type="button"
          data-testid="All-category-filter"
          onClick={ removeAppliedFilters }
          className={
            pathname === '/meals'
              ? 'all-meals-filter-button'
              : 'all-drinks-filter-button'
          }
        />
        { categories.map(({ strCategory }, index) => (
          <input
            type="button"
            name={ strCategory }
            data-testid={ `${strCategory}-category-filter` }
            key={ index }
            onClick={ applyFilterByCategory }
            className={ `${
              strCategory.split(' ').join('-')
                === 'Other-/-Unknown'
                ? 'OtherUnknow'
                : strCategory.split(' ').join('-')
            }-filter-button` }
          />
        )) }
      </div>

      { recipes !== null && (
        <div className="recipes-container">

          {(pathname === '/meals')
            ? recipes.map(({ idMeal, strMeal, strMealThumb }, index) => (
              <CardRecipe
                recipeType="meals"
                key={ idMeal }
                recipeName={ strMeal }
                recipeThumb={ strMealThumb }
                id={ idMeal }
                index={ index }
              />
            ))
            : recipes.map(({ idDrink, strDrink, strDrinkThumb }, index) => (
              <CardRecipe
                recipeType="drinks"
                key={ idDrink }
                recipeName={ strDrink }
                recipeThumb={ strDrinkThumb }
                id={ idDrink }
                index={ index }
              />
            )) }
        </div>)}
      <Footer />
    </div>

  );
}

export default Recipes;
