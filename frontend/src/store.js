import { configureStore } from '@reduxjs/toolkit';
import authReducer from './utils/authSlice'; // Import the auth slice from utils

const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth slice to the store
  },
});

export default store;