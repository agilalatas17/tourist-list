import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import registerReducer from './registerSlice';
import listReducer from './listSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    register: registerReducer,
    list: listReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;