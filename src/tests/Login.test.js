import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './renderWithRouter.js/renderWithRouter';

describe('Login', () => {
  it('Testando os inputs da tela de login', async () => {
    renderWithRouter(<App />);
    const email = await screen.findByTestId('email-input');
    expect(email).toBeInTheDocument();
    userEvent.type(email, 'email@email.com');
    const password = await screen.findByTestId('password-input');
    expect(password).toBeInTheDocument();
    userEvent.type(password, 'dog');
    const botaum = await screen.findByTestId('login-submit-btn');
    expect(botaum).toBeInTheDocument();
    expect(botaum).toBeDisabled();

    userEvent.type(password, 'cachorro');
    userEvent.click(botaum);
  });
});
