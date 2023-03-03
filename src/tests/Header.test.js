import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';
import Meals from '../pages/Meals';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';

describe('Header', () => {
  it('Testando se renderiza as telas drinks e meals', () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Route path="/drinks">
          <Header />
        </Route>
      </MemoryRouter>,
    );

    const searchButton = screen.getByTestId('search-top-btn');

    expect(searchButton).toBeInTheDocument();
  });

  it('toggles showSearch state when button is clicked', () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks'] }>
        <Route path="/drinks">
          <Header />
        </Route>
      </MemoryRouter>,
    );

    const searchButton = screen.getByTestId('search-top-btn');
    fireEvent.click(searchButton);

    expect(searchButton).toBeInTheDocument();
  });

  it('Testa redirecionamento da rota /Meals', () => {
    const { history } = renderWithRouter(<Meals />);
    const btn = screen.getByRole('img', { name: /profile/i });
    expect(btn).toBeInTheDocument();
    userEvent.click(btn);
    expect(history.location.pathname).toBe('/profile');
  });
});
