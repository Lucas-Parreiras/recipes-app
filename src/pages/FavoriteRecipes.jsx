import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';

function FavoriteRecipes() {
  const history = useHistory();
  const [fav, setFav] = useState([]);
  const [linkC, setLinkC] = useState('');
  const [fill, setFill] = useState([]);

  useEffect(() => { // Define um hook de efeito que atualiza o estado "fill" quando "fav" é atualizado
    setFill(fav);
  }, [fav]);

  useEffect(() => { // Define um hook de efeito que busca dados do localStorage e atualiza o estado "fav" quando o componente é montado
    if (!JSON.parse(localStorage.getItem('favoriteRecipes'))) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([{ error: 'LS_error' }]));
    }
    const listaLocaLStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    setFav(listaLocaLStorage);
  }, []);

  const handleFilterByMealsAndDrinks = ({ target }) => { // Define uma função que filtra as receitas favoritas por tipo (bebida ou comida) ao clicar nos botões correspondentes
    const id = target.name;
    switch (id) {
    case 'meal':
      setFill(fav.filter((e) => e.type === 'meal'));
      break;
    case 'drink':
      setFill(fav.filter((e) => e.type === 'drink'));
      break;
    default:
      setFill(fav);
      break;
    }
  };

  // const handleAllBtn = () => { setFill(fav); }; // Define uma função que atualiza o estado "fill" para exibir todas as receitas favoritas

  const handleSelectUnFav = ({ target }) => { // Define uma função que remove uma receita favorita pelo seu ID
    const id = target.name;
    const newest = fav.filter((e) => e.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newest));
    setFav(newest);
  };

  const handleChangeShare = async (favorite) => { // Define uma função assíncrona que escreve o link da receita favorita atual na área de transferência ao clicar no botão "compartilhar"
    try {
      await copy(`http://localhost:3000/${favorite.type}s/${favorite.id}`);
      setLinkC('Link copied!');
    } catch (error) {
      setLinkC(`Falha ao copiar: ${error}`);
    }
  };

  const evento = history.location.pathname; // Define uma variável que armazena o pathname da localização atual do histórico de navegação
  return (

    <div>
      <Header pathName={ evento } canSearch={ false } />
      <h1 data-testid="page-title">Favorite Recipes</h1>
      <div>

        <section>
          {linkC}
          <button
            type="button"
            data-testid="filter-by-all-btn"
            onClick={ handleFilterByMealsAndDrinks }
          >
            Tudo
          </button>

          <button
            type="button"
            data-testid="filter-by-meal-btn"
            name="meal"
            onClick={ (event) => handleFilterByMealsAndDrinks(event) }
          >
            Comida
          </button>

          <button
            type="button"
            data-testid="filter-by-drink-btn"
            name="drink"
            onClick={ (event) => handleFilterByMealsAndDrinks(event) }
          >
            Bebida
          </button>

        </section>
      </div>

      <div>
        <main>
          {fill.map((e, index) => (
            <div key={ index }>

              <Link to={ `${e.type}s/${e.id}` }>
                <img
                  data-testid={ `${index}-horizontal-image` }
                  src={ e.image }
                  alt={ e.name }
                  style={ { width: '80px' } }
                />
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {e.type === 'meal'
                    ? `${e.nationality} 
                    - ${e.category}`
                    : e.alcoholicOrNot}
                </p>
                <p data-testid={ `${index}-horizontal-name` }>{e.name}</p>
              </Link>

              <button type="button" onClick={ () => handleChangeShare(e) }>
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt="Share Icon"
                />
              </button>

              <button type="button" onClick={ handleSelectUnFav }>
                <img
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  src={ blackHeartIcon }
                  alt="Black Heart Icon"
                  name={ e.id }
                />
              </button>
            </div>
          ))}
        </main>
      </div>

      <div>
        <Footer />
      </div>

    </div>
  );
}
export default FavoriteRecipes;
