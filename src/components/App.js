import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRouteElement from './ProtectedRoute';
import * as auth from '../auth.js';
import InfoToolTip from './InfoToolTip';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');

  const navigate = useNavigate();

  function handleSuccessfulRegistration() {
    setIsSuccess(true);
    handleInfoToolTipOpen();
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogOut() {
    setLoggedIn(false);
  }

  function tokenCheck() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      if(token) {
        auth.getContent(token)
        .then((res) => {
          if(res) {
            setLoggedIn(true);
            setUserEmail(res.data.email)
            navigate('/', {replace: true})
          }
        });
      }
    }
  }

  function handleInfoToolTipOpen() {
    setIsInfoToolTipOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setIsInfoToolTipOpen(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));    
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleAddPlaceSubmit(data) {
    console.log(data);
    api.postCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards,]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then((res) => {
      console.log(res);
      setCards((prevState) => prevState.filter(oldCard => oldCard._id != card._id))
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateUser(data) {
    api.patchUserInfo(data)
    .then((newUserInfo) => {
      setCurrentUser(newUserInfo);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleUpdateAvatar(link) {
    api.patchAvatar(link)
    .then((userInfo) => {
      setCurrentUser(userInfo);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  React.useEffect(() => {
    tokenCheck();
  }, [])

  React.useEffect (() => {
    api.getUserInfo()
  .then((userInfo) => {
    setCurrentUser(userInfo);
  })
  .catch((err) => {
    console.log(err);
  });
  }, [])

  React.useEffect(() => {
    api.getCardArray()
    .then((cardArray) => {
      setCards(cardArray);
    })
    .catch((err) => {
      console.log(err); 
    });
  }, [])

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header loggedIn={loggedIn} handleLogOut={handleLogOut} userEmail={userEmail} />
        <Routes>
          <Route path="/sign-up" element={<Register onSuccess={handleSuccessfulRegistration} onFail={handleInfoToolTipOpen} />} />
          <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />
          <Route path="/" element={<ProtectedRouteElement element={Main} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick} onEditProfile={handleEditProfileClick} onEditAvatar={handleEditAvatarClick} loggedIn={loggedIn} />} />
        </Routes>
        <Footer />
        <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
        <AddPlacePopup  onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
        <PopupWithForm name="deleteCard" title="Вы уверены" />
        <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
        <InfoToolTip onClose={closeAllPopups} isOpen={isInfoToolTipOpen} isSuccess={isSuccess} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
