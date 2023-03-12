import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import { mealAPI, cockTailAPI } from '../helpers/APIsHandle';
import { addToFavorites,
  updateFavoritesStorage, doneRecipeFunc } from '../helpers/FavoriteLocalStorage';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

function RecipeInProgress() {
  const [recipe, setRecipe] = useState({});
  const [ingredientsArray, setIngredientsArray] = useState([]);
  const [recipeImg, setRecipeImg] = useState('');
  const [savedIngredients, setSavedIngredients] = useState([]);
  const [recipeType, setRecipeType] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();

  // Função responsável por adicionar receita pronta ao localStorage e redirecionar para doneRecipes.

  const doneBtnHandler = () => {
    doneRecipeFunc(recipeType, recipe, recipeImg, id);
    history.push('/done-recipes');
  };

  // Função para salvar os ingredientes no localStorage, ela é chamada na função resposável pelo click dos checkboxes.

  const createProgress = (ingredientName) => {
    const ingredientsKey = [];
    ingredientsKey.push(ingredientName);
    const newStorageObj = {
      recipeIdStorage: id,
      ingredientsInProgress: ingredientsKey,
    };
    const initialStorage = [newStorageObj];
    localStorage.setItem('inProgressRecipes', JSON.stringify(initialStorage));
  };

  const updateProgress = (progress, ingredientName) => {
    const checkProgress = progress.some(({ recipeIdStorage }) => recipeIdStorage === id);
    if (checkProgress === true) {
      const thisRecipe = progress
        .find(({ recipeIdStorage }) => recipeIdStorage === id);
      const recipeIndex = progress
        .findIndex(({ recipeIdStorage }) => recipeIdStorage === id);
      const ingredientsArrayStorage = thisRecipe.ingredientsInProgress;
      ingredientsArrayStorage.push(ingredientName);
      const newRecipeObj = {
        recipeIdStorage: id,
        ingredientsInProgress: ingredientsArrayStorage,
      };
      progress.splice(recipeIndex, 1, newRecipeObj);
      localStorage.setItem('inProgressRecipes', JSON.stringify(progress));
      return;
    }
    const newProgressArr = progress;
    const newRecipeIngredients = [];
    newRecipeIngredients.push(ingredientName);
    const newRecipeProgress = {
      recipeIdStorage: id,
      ingredientsInProgress: newRecipeIngredients,
    };
    newProgressArr.push(newRecipeProgress);
    localStorage.setItem('inProgressRecipes', JSON.stringify(newProgressArr));
  };

  const handleLocalStorage = (ingredientName) => {
    const actualProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (actualProgress !== null) {
      updateProgress(actualProgress, ingredientName);
    } else {
      createProgress(ingredientName);
    }
  };

  // Função responsável pela adição do risco no ingrediente checkado, ela é chamada no atributo onClick dos inputs checkbox.

  const handleClickCheckbox = ({ target }) => {
    const ingredientId = target.id.substring(1);
    const ingredient = document.getElementsByClassName(ingredientId);
    ingredient[0].style.textDecoration = 'line-through solid rgb(0, 0, 0)';
    handleLocalStorage(target.name);
  };

  // Função responsável por copiar o url, ela é chamada no botão de compartilhar.

  const handleShareClick = async () => {
    const path = location.pathname;
    const num = 12;
    const detailPath = path.substring(0, path.length - num);
    const fullUrl = `https://localhost:3000${detailPath}`;
    await clipboardCopy(fullUrl);
    global.alert('Link copied!');
  };

  // Função responsável por favoritar receitas e salvar no localStorage, ela será chamada no botão favoritar.

  const handleFavoritesStorage = () => {
    const actualStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const paramObj = {
      type: recipeType,
      storage: actualStorage,
      actualRecipe: recipe,
      actualImg: recipeImg,
      actualId: id,
    };
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
    }

    if (actualStorage) {
      return updateFavoritesStorage(paramObj);
    }
    return addToFavorites(recipeType, recipe, recipeImg, id);
  };

  const isFavoriteCheck = () => {
    const actualStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (actualStorage) {
      const favoriteCheck = actualStorage.some((e) => e.id === id);
      setIsFavorite(favoriteCheck);
    }
  };

  useEffect(() => {
    const savedIngredientsHandler = (storage) => {
      const checkId = storage.some((e) => e.recipeIdStorage === id);
      if (checkId === true) {
        const savedStorageRecipe = storage
          .find(({ recipeIdStorage }) => recipeIdStorage === id);
        const storageIngredients = savedStorageRecipe.ingredientsInProgress;
        setSavedIngredients(storageIngredients);
      }
    };

    const getStorage = () => {
      const savedStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
      if (savedStorage !== null) {
        savedIngredientsHandler(savedStorage);
      }
    };

    const getMeal = async () => {
      const recipeData = await mealAPI(`lookup.php?i=${id}`);
      const recipeObj = recipeData.meals[0];
      const recipeObjToArray = Object.entries(recipeObj);
      const recipeIngredients = recipeObjToArray
        .filter((item) => item[0]
          .startsWith('strIngredient') && item[1] !== '' && item[1] !== null);
      setRecipe(recipeObj);
      setRecipeImg(recipeObj.strMealThumb);
      setIngredientsArray(recipeIngredients);
      setRecipeType('meal');
    };

    const getDrink = async () => {
      const drinkData = await cockTailAPI(`lookup.php?i=${id}`);
      const drinkObj = drinkData.drinks[0];
      const drinkObjToArray = Object.entries(drinkObj);
      const drinkIngredients = drinkObjToArray
        .filter((item) => item[0]
          .startsWith('strIngredient') && item[1] !== '' && item[1] !== null);
      setRecipe(drinkObj);
      setRecipeImg(drinkObj.strDrinkThumb);
      setIngredientsArray(drinkIngredients);
      setRecipeType('drink');
    };

    if (location.pathname.startsWith('/meals')) {
      getMeal();
    } else {
      getDrink();
    }
    getStorage();
    isFavoriteCheck();
  }, [id, location.pathname]);

  return (
    <div>
      <h1 data-testid="recipe-title">{recipe.strMeal}</h1>
      <img
        src={ recipeImg }
        alt="imagem da receita pronta"
        data-testid="recipe-photo"
      />
      <h4 data-testid="recipe-category">{ recipe.strCategory }</h4>
      <button
        type="button"
        // data-testid="favorite-btn"
        onClick={ handleFavoritesStorage }
      >
        {
          isFavorite ? <img
            src={ blackHeartIcon }
            data-testid="favorite-btn"
            alt="icone de favoritar preenchido"
          /> : <img
            src={ whiteHeartIcon }
            data-testid="favorite-btn"
            alt="icone de favoritar vazio"
          />
        }
      </button>
      <button
        type="button"
        data-testid="share-btn"
        onClick={ handleShareClick }
      >
        Compartilhar
      </button>
      <p data-testid="instructions">{ recipe.strInstructions }</p>
      <div>
        {
          ingredientsArray.map((item, index) => {
            const testId = `${index}-ingredient-step`;
            if (savedIngredients.includes(item[1])) {
              return (
                <label
                  htmlFor={ item[1] }
                  key={ index }
                  data-testid={ testId }
                  className={ item[1].substring(1) }
                  style={ ({ textDecoration: 'line-through solid rgb(0, 0, 0)' }) }
                >
                  <input
                    type="checkbox"
                    name={ item[1] }
                    id={ item[1] }
                    onClick={ handleClickCheckbox }
                    checked
                  />
                  {item[1]}
                </label>
              );
            }
            return (
              <label
                htmlFor={ item[1] }
                key={ index }
                data-testid={ testId }
                className={ item[1].substring(1) }
              >
                <input
                  type="checkbox"
                  name={ item[1] }
                  id={ item[1] }
                  onClick={ handleClickCheckbox }
                />
                {item[1]}
              </label>
            );
          })
        }
      </div>
      <button
        type="button"
        data-testid="finish-recipe-btn"
        onClick={ doneBtnHandler }
      >
        Finalizar receita
      </button>
    </div>
  );
}

export default RecipeInProgress;
