import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../auth.js';
  
function Login(props) {

  const [formValue, setFormValue] = React.useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const {name, value} = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = formValue;
    auth.authorize(password, email)
    .then((data) => {
      if(data.token) {
        setFormValue({email: '', password: ''});
        props.handleLogin();
        navigate('/', {replace: true});
      }
    })
    .catch(err => console.log(err));
  }

  return (
    <section className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title popup__title">Вход</h2>
        <input id="email-input" type="email" className="login__input popup__input" name="email" value={formValue.email} onChange={handleChange}
        placeholder="Email" minLength="2" required />
        <input id="password-input" type="password" className="login__input popup__input" name="password" value={formValue.password} onChange={handleChange}
        placeholder="Пароль" minLength="2" required />
        <button className="login__submit-button popup__submitBtn" type="submit">Войти</button>
      </form>
    </section>
  );
}

export default Login;