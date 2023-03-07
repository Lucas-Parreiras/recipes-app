import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';

const USER_EMAIL = 'teste@teste.com';

describe('Testes da página Profile', () => {
  beforeEach(async () => {
    const { history } = renderWithRouter(<App />);
    // renderiza tela de Login para informar os dados
    const inputEmail = screen.getByTestId('email-input');
    const inputPwd = screen.getByTestId('password-input');
    const btnLogin = screen.getByTestId('login-submit-btn');

    userEvent.type(inputEmail, USER_EMAIL);
    userEvent.type(inputPwd, '1234567');
    userEvent.click(btnLogin);

    // renderiza tela inicial, para clicar no ícone do Profile
    const btnProfile = await screen.findByTestId('profile-top-btn');
    userEvent.click(btnProfile);

    // aguarda redirecionamento para a rota /profile
    await waitFor(async () => {
      const { pathname } = history.location;
      expect(pathname).toBe('/profile');
    });
  });

  it('Verifica renderização e valores dos elementos da tela Profile', () => {
    const pageTitle = screen.getByTestId('page-title');
    expect(pageTitle).toHaveTextContent(/profile/i);
    const email = screen.getByTestId('profile-email');
    expect(email).toHaveTextContent(USER_EMAIL);
    const doneIcon = screen.getByTestId('profile-done-btn');
    expect(doneIcon).toHaveTextContent(/done recipes/i);
    const favoriteIcon = screen.getByTestId('profile-favorite-btn');
    expect(favoriteIcon).toHaveTextContent(/favorite recipes/i);
    const logoutIcon = screen.getByTestId('profile-logout-btn');
    expect(logoutIcon).toHaveTextContent(/logout/i);
  });
});

describe('Testa o funcionamento do botão Logout', () => {
  it('Verifica se ocorre o redirecionamento para a tela de Login', async () => {
    const { history } = renderWithRouter(<App />);
    const inputEmail = screen.getByTestId('email-input');
    const inputPwd = screen.getByTestId('password-input');
    const btnLogin = screen.getByTestId('login-submit-btn');
    userEvent.type(inputEmail, USER_EMAIL);
    userEvent.type(inputPwd, '1234567');
    userEvent.click(btnLogin);
    const btnProfile = await screen.findByTestId('profile-top-btn');
    userEvent.click(btnProfile);
    await waitFor(async () => {
      const { pathname } = history.location;
      expect(pathname).toBe('/profile');
    });

    const logoutIcon = screen.getByTestId('profile-logout-btn');
    userEvent.click(logoutIcon);

    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
});
