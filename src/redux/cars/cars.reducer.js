import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import axios from 'axios';

console.log('Before createAsyncThunk');

export const fetchCars = createAsyncThunk(
  'cars/fetchAll',
  async ({ page = 1, limit = 12 }, thunkApi) => {
    try {
      // Запит для отримання всіх контактів
      const { data: allCars } = await axios.get(
        `https://65e85b1c4bb72f0a9c4f090a.mockapi.io/cars`
      );

      // Запит для отримання обмеженого списку контактів з пагінацією
      const { data: limitedCars } = await axios.get(
        `https://65e85b1c4bb72f0a9c4f090a.mockapi.io/cars?limit=${limit}&page=${page}`
      );

      console.log('All cars: ', allCars);
      console.log('Limited cars: ', limitedCars);

      return { allCars, limitedCars }; // Повертаємо обидва набори даних
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  cars: [],
  isLoading: false,
  error: null,
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  extraReducers: builder =>
    builder
      .addCase(fetchCars.fulfilled, (state, { payload }) => {
        state.cars = payload;
        state.isLoading = false;
        state.error = null;
      })

      .addMatcher(isAnyOf(fetchCars.pending), state => {
        state.isLoading = true;
        state.error = null;
      })

      .addMatcher(isAnyOf(fetchCars.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      }),
});

export const carsReducer = carsSlice.reducer;
