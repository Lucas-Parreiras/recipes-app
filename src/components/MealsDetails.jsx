function MealsDetails({ title, image, category, instructions, ingredients, video }) {
  return (
    <div>
      {image && title && <img
        src={ image }
        alt={ title }
        data-testid="recipe-photo"
      />}
      {/* Titulo */}
      {title && <h1 data-testid="recipe-title">{title}</h1>}

      {/* Categoria */}
      {category && (
        <p data-testid="recipe-category">
          Category:
          {' '}
          {category}
        </p>
      )}

      {/* Instruções */}
      <h2>Instructions:</h2>
      <p data-testid="instructions">{instructions}</p>
      Ingredientes

      <ul>
        <h2
          data-testid="$
      {index}
      -ingredient-name-and-measure"
        >
          Ingredients:

        </h2>

        { ingredients.map((ingredient, index) => (
          <li key={ index }>

            {`${ingredient.name} - ${quantities[index].quantity}`}
          </li>
        ))}
      </ul>
      Video Youtube
      {video && (
        <iframe
          data-testid="video"
          width="560"
          height="315"
          src={ video }
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write;
     encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* //Recomendação */}
      <h2>Recommendations:</h2>
      {/* add recommendations here */}
    </div>
  );
}

export default MealsDetails;
