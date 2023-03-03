import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const [disability, setDisability] = useState(true);
  const [login, setLogin] = useState({ email: '', password: '' });
  const history = useHistory(); // utiliza o hook, para navegação

  // atualiza o estado do login com o email e senha inseridos, e váida o formato para habilitar ou não o botão
  const handleEmailPassword = ({ target: { name, value } }) => {
    setLogin({ ...login, [name]: value });
    const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const minChar = 6;
    const isEmailValid = login.email.length >= minChar && emailValid.test(login.email);
    const isPasswordValid = login.password.length >= minChar;

    setDisability(!isEmailValid || !isPasswordValid);
  };

  // armazenar o email do usuário no localStorage e redirecionar para a página de refeições (/meals)
  const handleButtonStorage = () => {
    const user = { email: login.email };
    localStorage.setItem('user', JSON.stringify(user));
    history.push('/meals');
  };

  return (
    <>
      <p>E-mail</p>
      <input
        type="text"
        name="email"
        id="email"
        data-testid="email-input"
        placeholder="example@example.com"
        onChange={ handleEmailPassword }
      />
      <br />
      <p>Senha</p>
      <input
        type="text"
        name="password"
        id="senha"
        data-testid="password-input"
        placeholder="*******"
        onChange={ handleEmailPassword }
      />
      <br />
      <button
        type="button"
        name=""
        id="botaum"
        data-testid="login-submit-btn"
        disabled={ disability }
        onClick={ handleButtonStorage }
      >
        Logar
      </button>
    </>
  );
}

export default Login;
