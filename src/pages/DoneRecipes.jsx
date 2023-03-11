import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import RecipeTitle from '../components/RecipeTitle';
import ShareRecipeButton from '../components/ShareRecipeButton';
import doneRecipes from '../tests/mocks/localStorageDoneRecipesMock';
import done from '../images/done.svg';

export default function DoneRecipes() {
  const [doneRecipesList, setDoneRecipesList] = useState([]);

  useEffect(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    setDoneRecipesList([
      ...JSON.parse(localStorage.getItem('doneRecipes')),
    ]);
  }, []);

  const setFilters = ({ target: { name } }) => {
    const LSDoneRecipesList = JSON.parse(localStorage.getItem('doneRecipes'));
    const filteredList = LSDoneRecipesList.filter(({ type }) => type.includes(name));
    setDoneRecipesList([...filteredList]);
  };

  return (
    <div>
      <Header />
      <img src={ done } alt="logo done" className="logo-done" />
      <h1 data-testid="page-title" className="done-recipes-title">Done Recipes</h1>

      <div className="filters-container">
        <input
          name=""
          id="filter-by-all"
          data-testid="filter-by-all-btn"
          type="button"
          onClick={ setFilters }
        />
        <input
          name="meal"
          id="filter-by-meal"
          data-testid="filter-by-meal-btn"
          type="button"
          onClick={ setFilters }
        />
        <input
          name="drink"
          id="filter-by-drink"
          data-testid="filter-by-drink-btn"
          type="button"
          onClick={ setFilters }
        />
      </div>

      <div className="cards-container-recipes">
        { doneRecipesList
          .map((
            {
              id,
              image,
              category,
              name,
              doneDate,
              tags,
              nationality,
              type,
              alcoholicOrNot },
            index,
          ) => (
            <div className="card-recipe" key={ id }>
              <Link
                to={ `/${type}s/${id}` }
                className="image-link"
              >
                <img
                  data-testid={ `${index}-horizontal-image` }
                  src={ image }
                  alt={ name }
                />
              </Link>

              <div className="card-content">

                <div className="head">
                  <div className="title-and-button">
                    <RecipeTitle
                      index={ index }
                      name={ name }
                      id={ id }
                      type={ type }
                    />
                    <ShareRecipeButton
                      index={ index }
                      id={ id }
                      type={ type }
                    />
                  </div>

                  <span data-testid={ `${index}-horizontal-top-text` }>
                    { `${nationality} - ${category}` }
                  </span>

                </div>

                <div className="middle">
                  <p data-testid={ `${index}-horizontal-done-date` }>
                    Done in:
                    {' '}
                    { doneDate }
                  </p>
                  { type === 'drink'
                    && (
                      <span data-testid={ `${index}-horizontal-top-text` }>
                        { alcoholicOrNot }
                      </span>) }
                </div>

                <div className="bottom">
                  { tags.map((tag, index2) => (
                    <span
                      data-testid={ `${index}-${tag}-horizontal-tag` }
                      key={ index2 }
                      className="card-tags"
                    >
                      { tag }
                    </span>
                  )) }
                </div>
              </div>
            </div>
          )) }
      </div>

    </div>
  );
}
