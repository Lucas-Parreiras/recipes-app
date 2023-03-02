// Para uso da função de fetch, chame a função mealAPI ou cockTailAPI e passe como parâmetro tudo que vier após v1/1 no link.

export const mealAPI = async (endpoint) => {
  const URL = `www.themealdb.com/api/json/v1/1/${endpoint}`;
  const data = await fetch(URL);
  const response = await data.json();
  return response;
};

export const cockTailAPI = async (endpoint) => {
  const URL = `www.thecocktaildb.com/api/json/v1/1/${endpoint}`;
  const data = await fetch(URL);
  const response = await data.json();
  return response;
};
