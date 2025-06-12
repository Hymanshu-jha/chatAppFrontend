// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/users/loginSlice';
import roomReducer from '../features/rooms/roomSlice'

export const store = configureStore({
  reducer: {
    auth: loginReducer,// <-- this is the key used in useSelector (state.auth)
    room: roomReducer
  },
});
