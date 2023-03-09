import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import { mealAPI, cockTailAPI } from '../helpers/APIsHandle';
import shareIcon from '../images/shareIcon.svg';
import { updateFavoritesStorage, addToFavorites } from '../helpers/FavoriteLocalStorage';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

function RecipeDetails({ match }) {
  const { id } = match.params;
  const [recipeData, setRecipeData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const isMeal = location.pathname.includes('meals');
  const isDrink = location.pathname.includes('drinks');
  const number = 6;
  const type = isMeal ? 'meal' : 'drink';
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchRecipeData() {
      const apiEndpoint = isMeal ? 'lookup.php?i=' : 'lookup.php?i=';
      const data = isMeal ? await
      mealAPI(apiEndpoint + id) : await cockTailAPI(apiEndpoint + id);
      setRecipeData(data[isMeal ? 'meals' : 'drinks'][0] || {});
    }
    fetchRecipeData();
  }, [id, location.pathname, isMeal]);
  useEffect(() => {
    async function fetchRecommendations() {
      const recomendationEndpoint = isMeal ? 'search.php?s=' : 'search.php?s=';
      const data = isMeal ? await cockTailAPI(recomendationEndpoint)
        : await mealAPI(recomendationEndpoint);
      setRecommendations(data[isMeal ? 'drinks' : 'meals']?.slice(0, number) || []);
    }
    fetchRecommendations();
  }, [isMeal]);
  // fim das requisições
  const {
    strAlcoholic,
    strMealThumb,
    strDrinkThumb,
    strDrink,
    strMeal,
    strCategory: category,
    strInstructions: instructions,
    strYoutube: video,
  } = recipeData;

  const image = isMeal ? strMealThumb : strDrinkThumb;
  const title = isMeal ? strMeal : strDrink;
  const alcool = isDrink ? strAlcoholic : '';

  const ingredients = Object.entries(recipeData)
    .filter(([key]) => key.includes('Ingredient') && recipeData[key])
    .map(([key, value], index) => ({
      name: value,
      measure: recipeData[`strMeasure${index + 1}`],
      key: { key },
    }));

  const handleClickSetRecepies = () => {
    const path = isDrink ? `/drinks/${id}/in-progress` : `/meals/${id}/in-progress`;
    history.push(path);
  };

  const handleShareClick = async () => {
    const link = window.location.href;
    await clipboardCopy(link);
    const tagMsg = document.createElement('p');
    tagMsg.innerText = 'Link copied!';
    document.body.appendChild(tagMsg);
  };
  const handleFavoritesStorage = () => {
    const actualStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const paramObj = {
      type,
      storage: actualStorage,
      actualRecipe: recipeData,
      actualImg: image,
      actualId: id,
    };

    if (actualStorage) {
      return updateFavoritesStorage(paramObj);
    }
    return addToFavorites(type, recipeData, image, id);
  };

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];// Caso não haja nada salvo, é retornado um array vazio.
    const isRecipeFavorite = favoriteRecipes
      .find((f) => f.id === id) !== undefined;
    setIsFavorite(isRecipeFavorite);
  }, [id]);
  // find para verificar se o objeto com o id especificado está presente no array favoriteRecipes
  return (
    <div>
      {image && title && (
        <img
          className="imagem"
          data-testid="recipe-photo"
          src={ image }
          alt={ title }

        />
      )}
      {title && <h1 data-testid="recipe-title">{title}</h1>}
      {category && (
        <p data-testid="recipe-category">
          Category:
          {' '}

          {category}

          {' '}
          {alcool}
        </p>
      )}
      <h2>Instructions:</h2>
      <p data-testid="instructions">{instructions}</p>
      <h2>Ingredients:</h2>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
            {`${ingredient.name} - ${ingredient.measure}`}
          </li>
        ))}

      </ul>
      {video && (
        <iframe
          data-testid="video"
          width="560"
          height="315"
          src={ video.replace('watch?v=', 'embed/') }
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write;
         encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      <button
        data-testid="share-btn"
        type="button"
        className="btn-compartilhar-recipe"
        onClick={ () => {
          handleShareClick();
        } }
      >
        <img
          src={ shareIcon }
          alt="Share"
        />
        Compartilhar
      </button>

      <button
        type="button"
        className="btn-compartilhar-recipe"
        onClick={ () => {
          handleFavoritesStorage();
          setIsFavorite(!isFavorite);
        } }
      >
        {isFavorite ? <img
          data-testid="favorite-btn"
          src={ blackHeartIcon }
          alt="favoritar"
        /> : <img
          data-testid="favorite-btn"
          src={ whiteHeartIcon }
          alt="favoritar"
        /> }
        Favoritar
      </button>

      <h2>Recommendations:</h2>

      <div className="container-carrosel">
        {recommendations.map((item, index) => (
          <div
            className="itemCarrossel"
            key={ item.idMeal || item.idDrink }
            data-testid={ `${index}-recommendation-card` }

          >
            <img
              className="imagemCarrosel"
              src={ item.strMealThumb || item.strDrinkThumb }
              alt={ item.strMeal || item.strDrink }
            />
            <p
              data-testid={ `${index}-recommendation-title` }
              className="tileCarrossel"
            >
              { item.strMeal || item.strDrink }
            </p>
          </div>

        ))}
      </div>
      <div>
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="btn-start-recipe"
          onClick={ handleClickSetRecepies }

        >

          {' '}
          Start Recipe
        </button>
      </div>
    </div>
  );
}
RecipeDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default RecipeDetails;
