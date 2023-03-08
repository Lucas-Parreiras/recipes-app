import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useLocation } from 'react-router-dom';
import { mealAPI, cockTailAPI } from '../helpers/APIsHandle';

function RecipeDetails({ match }) {
  const { id } = match.params;
  const [recipeData, setRecipeData] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  const location = useLocation();
  const isMeal = location.pathname.includes('meals');
  const isDrink = location.pathname.includes('drinks');
  const number = 6;

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

  console.log(recommendations);
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
    // eslint-disable-next-line no-unused-vars
    .map(([key, value], index) => ({
      name: value,

      measure: recipeData[`strMeasure${index + 1}`],
      key: `ingredient-${index}`,
    }));

  return (
    <div>
      {image && title && (
        <img
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
    </div>
  );
}

RecipeDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  category: PropTypes.string.isRequired,
  instructions: PropTypes.string.isRequired,
  ingredients: PropTypes.array.isRequired,
  video: PropTypes.string.isRequired,
};

export default RecipeDetails;
