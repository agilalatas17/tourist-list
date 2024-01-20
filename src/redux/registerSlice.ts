import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegistrationState {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
}

const initialState: RegistrationState = {
  name: '',
  email: '',
  password: '',
  showPassword: false,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setShowPassword: (state, action: PayloadAction<boolean>) => {
      state.showPassword = action.payload;
    },
  },
});

export const {
  setName,
  setEmail,
  setPassword,
  setShowPassword,
} = registrationSlice.actions;

export default registrationSlice.reducer;