export const addToFavorites = (type, actualRecipe, actualImg, actualId) => {
  const storageArr = [];
  if (type === 'drink') {
    const drinkObjRecipe = {
      id: actualId,
      type,
      nationality: '',
      category: actualRecipe.strCategory,
      alcoholicOrNot: actualRecipe.strAlcoholic,
      name: actualRecipe.strDrink,
      image: actualImg,
    };
    storageArr.push(drinkObjRecipe);
    localStorage.setItem('favoriteRecipes', JSON.stringify(storageArr));
    return;
  }
  const mealObjRecipe = {
    id: actualId,
    type,
    nationality: actualRecipe.strArea,
    category: actualRecipe.strCategory,
    alcoholicOrNot: '',
    name: actualRecipe.strMeal,
    image: actualImg,
  };
  storageArr.push(mealObjRecipe);
  localStorage.setItem('favoriteRecipes', JSON.stringify(storageArr));
};

export const updateFavoritesStorage = ({
  type, storage, actualRecipe, actualImg, actualId }) => {
  const checkStorage = storage.some((e) => e.id === actualId);
  if (checkStorage === true) {
    const recipIndex = storage.findIndex((e) => e.id === actualId);
    const newStorageToAdd = storage;
    newStorageToAdd.splice(recipIndex, 1);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newStorageToAdd));
    return;
  }
  const actualStorageArray = storage;
  if (type === 'meal') {
    const mealObjRecipe = {
      id: actualId,
      type,
      nationality: actualRecipe.strArea,
      category: actualRecipe.strCategory,
      alcoholicOrNot: '',
      name: actualRecipe.strMeal,
      image: actualImg,
    };
    actualStorageArray.push(mealObjRecipe);
    localStorage.setItem('favoriteRecipes', JSON.stringify(actualStorageArray));
    return;
  }
  const drinkObjRecipe = {
    id: actualId,
    type,
    nationality: '',
    category: actualRecipe.strCategory,
    alcoholicOrNot: actualRecipe.strAlcoholic,
    name: actualRecipe.strDrink,
    image: actualImg,
  };
  actualStorageArray.push(drinkObjRecipe);
  localStorage.setItem('favoriteRecipes', JSON.stringify(actualStorageArray));
};
