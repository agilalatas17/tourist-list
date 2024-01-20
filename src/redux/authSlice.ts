import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('Id') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{ token: string; userId: string }>) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('Id', action.payload.userId);
    },
    clearAuthData: (state) => {
      state.token = null;
      state.userId = null;
      localStorage.removeItem('token');
      localStorage.removeItem('Id');
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export const authSelector = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
