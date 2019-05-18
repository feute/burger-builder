import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => ({
  type: actionTypes.AUTH_START,
});

export const authSuccess = (idToken, userId) => ({
  type: actionTypes.AUTH_SUCCESS,
  idToken,
  userId,
});

export const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  error,
});

export const auth = (email, password, isSignup) => dispatch => {
  dispatch(authStart());
  const authData = {
    email,
    password,
    returnSecureToken: true,
  };
  let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDoSt1JC5XWZYGhxGY1ZlrCLVb7AI47lag';
  if (!isSignup) {
    url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDoSt1JC5XWZYGhxGY1ZlrCLVb7AI47lag';
  }

  axios.post(url, authData)
    .then(response => {
      dispatch(authSuccess(response.data.idToken, response.data.localId));
    })
    .catch(err => {
      dispatch(authFail(err));
    });
};
