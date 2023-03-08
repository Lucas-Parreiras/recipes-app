import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../App';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';

const USER_EMAIL = 'teste@teste.com';
const PROFILE_EMAIL = 'profile-email';
const EMAIL_INPUT = 'email-input';
const PASSWORD_INPUT = 'password-input';
const LOGIN_SUBMIT_BTN = 'login-submit-btn';
const PROFILE_TOP_BTN = 'profile-top-btn';

describe('Testes da página Profile', () => {
  beforeEach(async () => {
    const { history } = renderWithRouter(<App />);
    // renderiza tela de Login para informar os dados
    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPwd = screen.getByTestId(PASSWORD_INPUT);
    const btnLogin = screen.getByTestId(LOGIN_SUBMIT_BTN);

    userEvent.type(inputEmail, USER_EMAIL);
    userEvent.type(inputPwd, '1234567');
    userEvent.click(btnLogin);

    // renderiza tela inicial, para clicar no ícone do Profile
    const btnProfile = await screen.findByTestId(PROFILE_TOP_BTN);
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
    const email = screen.getByTestId(PROFILE_EMAIL);
    expect(email).toHaveTextContent(USER_EMAIL);
    const doneIcon = screen.getByTestId('profile-done-btn');
    expect(doneIcon).toHaveTextContent(/done recipes/i);
    const favoriteIcon = screen.getByTestId('profile-favorite-btn');
    expect(favoriteIcon).toHaveTextContent(/favorite recipes/i);
    const logoutIcon = screen.getByTestId('profile-logout-btn');
    expect(logoutIcon).toHaveTextContent(/logout/i);
  });
});

describe('Simulação de estado do localStorage', () => {
  // it('Verifica se quando localStorage === null, o email não é renderizado', () => {
  //   localStorage.setItem('user', JSON.stringify(null));
  //   console.log(JSON.parse(localStorage.getItem('user')));
  //   const { history } = renderWithRouter(<App />);
  //   act(() => history.push('/profile'));
  //   const email = screen.getByTestId(PROFILE_EMAIL);
  //   expect(email).toHaveTextContent('none');
  // });

  it('Verifica se quando localStorage !== null, a informação contida nele é renderizada', () => {
    localStorage.setItem('user', JSON.stringify({ email: USER_EMAIL }));
    const { history } = renderWithRouter(<App />);
    act(() => history.push('/profile'));
    const email = screen.getByTestId(PROFILE_EMAIL);
    expect(email).toHaveTextContent('teste@teste.com');
  });
});

describe('Verifica redirecionamento para páginas', () => {
  it('Verifica se botão Done Recipes direciona corretamente para a rota', async () => {
    const { history } = renderWithRouter(<App />);
    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPwd = screen.getByTestId(PASSWORD_INPUT);
    const btnLogin = screen.getByTestId(LOGIN_SUBMIT_BTN);
    userEvent.type(inputEmail, USER_EMAIL);
    userEvent.type(inputPwd, '1234567');
    userEvent.click(btnLogin);
    const btnProfile = await screen.findByTestId(PROFILE_TOP_BTN);
    userEvent.click(btnProfile);
    await waitFor(async () => {
      const { pathname } = history.location;
      expect(pathname).toBe('/profile');
    });

    const doneIcon = screen.getByTestId('profile-done-btn');
    userEvent.click(doneIcon);

    const { pathname } = history.location;
    expect(pathname).toBe('/done-recipes');
  });

  it('Verifica se botão Favorite Recipes direciona corretamente para a rota', async () => {
    const { history } = renderWithRouter(<App />);
    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPwd = screen.getByTestId(PASSWORD_INPUT);
    const btnLogin = screen.getByTestId(LOGIN_SUBMIT_BTN);
    userEvent.type(inputEmail, USER_EMAIL);
    userEvent.type(inputPwd, '1234567');
    userEvent.click(btnLogin);
    const btnProfile = await screen.findByTestId(PROFILE_TOP_BTN);
    userEvent.click(btnProfile);
    await waitFor(async () => {
      const { pathname } = history.location;
      expect(pathname).toBe('/profile');
    });

    const favoriteIcon = screen.getByTestId('profile-favorite-btn');
    userEvent.click(favoriteIcon);

    const { pathname } = history.location;
    expect(pathname).toBe('/favorite-recipes');
  });
});

describe('Testa o funcionamento do botão Logout', () => {
  it('Verifica se ocorre o redirecionamento para a tela de Login', async () => {
    const { history } = renderWithRouter(<App />);
    const inputEmail = screen.getByTestId(EMAIL_INPUT);
    const inputPwd = screen.getByTestId(PASSWORD_INPUT);
    const btnLogin = screen.getByTestId(LOGIN_SUBMIT_BTN);
    userEvent.type(inputEmail, USER_EMAIL);
    userEvent.type(inputPwd, '1234567');
    userEvent.click(btnLogin);
    const btnProfile = await screen.findByTestId(PROFILE_TOP_BTN);
    userEvent.click(btnProfile);
    await waitFor(async () => {
      const { pathname } = history.location;
      expect(pathname).toBe('/profile');
    });
    const email = screen.getByTestId(PROFILE_EMAIL);

    const logoutIcon = screen.getByTestId('profile-logout-btn');
    userEvent.click(logoutIcon);

    expect(email).not.toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
});
