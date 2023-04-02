import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../auth.js';
  
function Register(props) {

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
    auth.register(password, email)
    .then((res) => {
      if(res.data) {
        navigate('/sign-in', {replace: true});
        props.onSuccess();
      } else {
        props.onFail()
      }
    })
    .catch((err) => {
      console.log(err);
      props.onFail()
    });
  }

  return (
    <section className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title popup__title">Регистрация</h2>
        <input id="email-input" type="email" className="login__input popup__input" name="email" value={formValue.email} onChange={handleChange} 
        placeholder="Email" minLength="2" required />
        <input id="password-input" type="password" className="login__input popup__input" name="password" value={formValue.password} onChange={handleChange} 
        placeholder="Пароль" minLength="2" required />
        <button className="login__submit-button popup__submitBtn" type="submit">Зарегистрироваться</button>
      </form>
        <p className="login__sign-in">Уже зарегистрированы?
          <Link to="/sign-in" className="login__sign-in-link"> Войти</Link> 
        </p>
    </section>
  );
}

export default Register;