import React from 'react';
import './App.css';
import './css/Recipes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import RecipeInProgress from './pages/RecipeInProgress';
import Recipes from './pages/Recipes';
import './css/RecipeDetails.css';

// Conferir complementação do id do component RecipeDetails.
// Conferir uso das páginas Drinks e Meals.

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={ Login } />
        <Route path="/drinks/:id-da-receita/in-progress" component={ RecipeInProgress } />
        <Route path="/drinks/:id" component={ RecipeDetails } />
        <Route exact path="/drinks" component={ Recipes } />
        <Route path="/meals/:id-da-receita/in-progress" component={ RecipeInProgress } />
        <Route path="/meals/:id" component={ RecipeDetails } />
        <Route exact path="/meals" component={ Recipes } />
        <Route path="/profile" component={ Profile } />
        <Route path="/done-recipes" component={ DoneRecipes } />
        <Route path="/favorite-recipes" component={ FavoriteRecipes } />
      </Switch>
    </div>
  );
}

export default App;
