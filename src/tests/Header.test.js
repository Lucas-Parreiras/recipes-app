import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import Header from '../components/Header';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';
import App from '../App';
import mealRecipesApiMock from './mocks/mealRecipesApiMock';

describe('Header', () => {
  let searchButton;

  describe('renderização', () => {
    it('renderiza o botão de busca na tela de bebidas', () => {
      render(
        <MemoryRouter initialEntries={ ['/drinks'] }>
          <Route path="/drinks">
            <Header />
          </Route>
        </MemoryRouter>,
      );

      searchButton = screen.getByTestId('search-top-btn');

      expect(searchButton).toBeInTheDocument();
    });

    it('não renderiza o botão de busca na tela de perfil', () => {
      render(
        <MemoryRouter initialEntries={ ['/profile'] }>
          <Route path="/profile">
            <Header />
          </Route>
        </MemoryRouter>,
      );

      expect(searchButton).not.toBeInTheDocument();
    });
  });

  it('não renderiza o componente SearchBar inicialmente', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const searchBar = screen.queryByTestId('search-bar');

    expect(searchBar).not.toBeInTheDocument();
  });
});

describe('comportamento', () => {
  it('ao clicar no botão de busca, o componente SearchBar é renderizado', () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Route path="/drinks">
          <Header />
        </Route>
      </MemoryRouter>,
    );

    const searchButton = screen.getByTestId('search-top-btn');
    fireEvent.click(searchButton);

    const searchBar = screen.getByTestId('search-bar');

    expect(searchBar).toBeInTheDocument();
  });

  it('ao clicar no botão de perfil, o usuário é redirecionado para /profile', () => {
    const history = createMemoryHistory();
    render(
      <Router history={ history }>
        <Header />
      </Router>,
    );

    const profileButton = screen.getByTestId('profile-top-btn');
    userEvent.click(profileButton);

    expect(history.location.pathname).toBe('/profile');
  });

  it('ao entrar na rota /meals, o botão de perfil é renderizado', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealRecipesApiMock),
    });

    const { history } = renderWithRouter(<App />, { route: '/meals' });

    const profileButton = await screen.findByTestId('profile-top-btn');

    expect(profileButton).toBeInTheDocument();
    expect(history.location.pathname).toBe('/meals');
  });
});
