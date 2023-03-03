import React from 'react';

import { useHistory } from 'react-router-dom';
import Drinks from './Drinks';
import Meals from './Meals';

export default function Recipes() {
  const history = useHistory();
  const path = history.location.pathname;

  // renderiza componente de receita, com duas opção exibindo uma rota
  const component = () => (path === '/drinks' ? <Drinks /> : <Meals />);

  return (
    <div>{component()}</div>
  );
}
