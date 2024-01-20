import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Tourist {
  $id: string;
  createdat: string;
  id: string;
  tourist_email: string;
  tourist_profilepicture: string;
  tourist_location: string;
  tourist_name: string;
}

interface TouristState {
  currentPage: number;
  totalPages: number;
  tourists: Tourist[];
  searchTerm: string;
  isModalOpen: boolean;
  newTourist: {
    name: string;
    email: string;
    location: string;
  };
}

const initialState: TouristState = {
  currentPage: 1,
  totalPages: 1,
  tourists: [],
  searchTerm: '',
  isModalOpen: false,
  newTourist: {
    name: '',
    email: '',
    location: '',
  },
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setTourists: (state, action: PayloadAction<Tourist[]>) => {
      state.tourists = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setNewTourist: (state, action: PayloadAction<{ name: string; email: string; location: string }>) => {
      state.newTourist = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  setTourists,
  setSearchTerm,
  setIsModalOpen,
  setNewTourist,
  resetState,
} = listSlice.actions;

export const selectTourist = (state: RootState) => state.list;

export default listSlice.reducer;